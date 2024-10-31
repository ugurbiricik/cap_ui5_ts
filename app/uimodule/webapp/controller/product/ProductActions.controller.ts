// ProductActions.controller.js
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import Text from "sap/m/Text";
import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import Control from "sap/ui/core/Control";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Fragment from "sap/ui/core/Fragment";
import Carousel from "sap/m/Carousel";
import Controller from "sap/ui/core/mvc/Controller";

export class ProductActions extends Controller {
    getView: any;
    aSelectedContexts : any;

    constructor(private oModel: ODataModel, private view: any) {
        super("uimodule.controller.product.ProductActions")
    }
    private _pEditDialog: any;

    public onAddProduct(): void {
        const oNewProductModel = this.view.getModel("newProductModel") as JSONModel;
        const oNewProductData = oNewProductModel?.getProperty("/newProduct");
        if (!oNewProductData.Name || !oNewProductData.Status || !oNewProductData.SupplierName || !oNewProductData.MainCategory) {
            MessageToast.show("Please fill all product details.");
            return;
        }
        const oListBinding = this.oModel.bindList("/Products") as ODataListBinding;

        oListBinding.create(oNewProductData).created()?.then(() => {
            MessageToast.show("Product successfully added!");
            // Navigate or refresh logic
            oNewProductModel.setProperty("/newProduct", this.getEmptyProduct());
        }).catch((error: any) => {
            MessageToast.show("Failed to add product: " + error.message);
        });
    }

    public onDeleteSelectedProducts(): void {
        const oModel = this.getView().getModel("mainServiceModel") as ODataModel;
        const aSelectedProducts = this.getSelectedProductContexts();
    
        if (aSelectedProducts.length === 0) {
            MessageToast.show("Silmek için en az bir ürün seçin.");
            return;
        }
    
        MessageBox.confirm("Seçili ürünleri silmek istediğinize emin misiniz?", {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            onClose: (sAction : any) => {
                if (sAction === MessageBox.Action.OK) {
                    aSelectedProducts.forEach((oContext) => {
                        oContext.delete().then(() => {
                            MessageToast.show("Ürün başarıyla silindi.");
                        }).catch((oError: any) => {
                            MessageBox.error("Ürün silinemedi: " + oError.message);
                        });
                    });
    
                    this._refreshProductList();
                }
            }
        });
    }
    
    // Seçili ürünlerin context'lerini almak için yardımcı fonksiyon
    private getSelectedProductContexts(): any[] {
        const oModel = this.getView().getModel("mainServiceModel") as ODataModel;
    
        const oBinding = this.getView().byId("productList").getBinding("items") as ODataListBinding;
    
        // Tüm ürünlerin bağlamlarını alıyoruz
        oBinding.requestContexts().then((aContexts: any[]) => {
            aContexts.forEach((oContext: any) => {
                const oProductData = oContext.getObject();
                if (oProductData.isSelected) {  // Seçili ürünleri filtrele
                    this.aSelectedContexts.push(oContext);
                }
            });
        });
    
        return this.aSelectedContexts;
    }
    

    public onDeleteProductPress(oEvent: Event): void {
        const oContext = (oEvent.getSource() as Control).getBindingContext("mainServiceModel");
        const sProductName = oContext?.getProperty("Name");

        if (!oContext) {
            MessageToast.show("Please select the product you want to delete.");
            return;
        }

        const oDialog = new Dialog({
            title: "Delete Confirmation",
            content: new Text({ text: "Are you sure you want to delete this product? Product: " + sProductName }),
            beginButton: new Button({
                text: "Yes",
                press: () => {
                    (oContext as any).delete().then(() => {
                        MessageToast.show("Product successfully deleted: " + sProductName);
                        this._refreshProductList();
                    }).catch((oError: any) => {
                        MessageBox.error("Failed to delete product: " + oError.message);
                    });
                    oDialog.close();
                }
            }),
            endButton: new Button({
                text: "No",
                press: () => {
                    oDialog.close();
                }
            }),
            afterClose: () => {
                oDialog.destroy();
            }
        });

        oDialog.open();
    }

    public onIncrease(oEvent: Event): void {
        const oButton = (oEvent.getSource() as Control);
        const oProductContext = oButton.getBindingContext("mainServiceModel");
        const sProductID = oProductContext?.getProperty("ID");

        const oCartModel = this.view.getModel("cartModel") as JSONModel;
        let aCartItems = oCartModel.getProperty("/cartItems") as any[];

        const oCartItem = aCartItems.find(item => item.productID === sProductID);

        if (oCartItem) {
            oCartItem.quantity += 1;
        } else {
            aCartItems.push({ productID: sProductID, quantity: 1 });
        }

        oCartModel.setProperty("/cartItems", aCartItems);
    }

    public onDecrease(oEvent: Event): void {
        const oButton = (oEvent.getSource() as Control);
        const oProductContext = oButton.getBindingContext("mainServiceModel");
        const sProductID = oProductContext?.getProperty("ID");

        const oCartModel = this.view.getModel("cartModel") as JSONModel;
        let aCartItems = oCartModel.getProperty("/cartItems") as any[];

        const oCartItem = aCartItems.find(item => item.productID === sProductID);

        if (oCartItem && oCartItem.quantity > 0) {
            oCartItem.quantity -= 1;

            if (oCartItem.quantity === 0) {
                aCartItems = aCartItems.filter(item => item.productID !== sProductID);
            }
        }

        oCartModel.setProperty("/cartItems", aCartItems);
    }

    public addToCart(oEvent: Event): void {
        const oProductContext = (oEvent.getSource() as Control).getBindingContext("mainServiceModel");
        const sProductID = oProductContext?.getProperty("ID");
        const sUserID = (this.view.getModel("globalModel") as JSONModel).getProperty("/user/ID");
        const fProductPrice = oProductContext?.getProperty("price");

        const oCartModel = this.view.getModel("cartModel") as JSONModel;
        const iQuantity = oCartModel.getProperty("/quantity");

        const oCartListBinding = this.oModel.bindList("/Cart") as ODataListBinding;

        oCartListBinding.filter(new Filter({
            filters: [
                new Filter("productID_ID", FilterOperator.EQ, sProductID),
                new Filter("userID_ID", FilterOperator.EQ, sUserID)
            ],
            and: true
        }));

        oCartListBinding.requestContexts().then((aCartContexts: any[]) => {
            let bProductExists = false;

            if (aCartContexts.length > 0) {
                const oCartItem = aCartContexts[0].getObject();
                oCartItem.quantity += iQuantity;
                oCartItem.totalPrice += (fProductPrice * iQuantity);

                aCartContexts[0].setProperty("quantity", oCartItem.quantity);
                aCartContexts[0].setProperty("totalPrice", oCartItem.totalPrice);

                MessageToast.show("The quantity of the product has been updated!");
                bProductExists = true;
            }

            if (!bProductExists) {
                const fTotalPrice = fProductPrice * iQuantity;

                const oCartData = {
                    userID: { ID: sUserID },
                    productID: { ID: sProductID },
                    quantity: iQuantity,
                    totalPrice: fTotalPrice
                };

                oCartListBinding.create(oCartData).created()?.then(() => {
                    MessageToast.show("Product added to cart successfully!");
                    oCartModel.setProperty("/quantity", 0);
                }).catch((error: any) => {
                    MessageToast.show("Product could not be added to cart: " + error.message);
                });
            }
        }).catch((error: any) => {
            MessageToast.show("Could not get cart data: " + error.message);
        });
    }

    public async onEditProductPress(oEvent: Event): Promise<void> {
        const oProductContext = (oEvent.getSource() as Control).getBindingContext("mainServiceModel");
        const oProductData = oProductContext?.getObject();

        if (!this._pEditDialog) {
            this._pEditDialog = await Fragment.load({
                name: "uimodule.view.fragments.EditProductDialog",
                controller:this
            });
            this.getView()?.addDependent(this._pEditDialog);
        }

        const oEditModel = new JSONModel({
            product: oProductData
        });
        this.getView()?.setModel(oEditModel, "editProductModel");


        this._pEditDialog.open();
    }

    public onSaveEditProduct(): void {
        const oEditModel = this.view.getModel("editProductModel") as JSONModel;
        const oProductData = oEditModel.getProperty("/product");
        const sProductID = oProductData.ID;

        const oBindList = this.oModel.bindList("/Products");
        const aFilter = new Filter("ID", FilterOperator.EQ, sProductID);

        oBindList.filter(aFilter).requestContexts().then((aContexts: any[]) => {
            if (aContexts.length > 0) {
                const oContext = aContexts[0];
                this.updateProductProperties(oContext, oProductData);
                this.oModel.refresh();
                MessageToast.show("Product updated successfully.");
            } else {
                MessageToast.show("Product not found for update.");
            }
        }).catch((oError: any) => {
            MessageBox.error("Failed to update product: " + oError.message);
        });
    }

    public onCancelEditProduct(oEditDialog: Dialog): void {
        oEditDialog.close();
    }

    private updateProductProperties(oContext: any, oProductData: any): void {
        oContext.setProperty("Name", oProductData.Name);
        oContext.setProperty("Status", oProductData.Status);
        oContext.setProperty("SupplierName", oProductData.SupplierName);
        oContext.setProperty("MainCategory", oProductData.MainCategory);
        oContext.setProperty("Category", oProductData.Category);
        oContext.setProperty("Width", oProductData.Width);
        oContext.setProperty("Height", oProductData.Height);
        oContext.setProperty("WeightMeasure", oProductData.WeightMeasure);
        oContext.setProperty("ProductPicUrl", oProductData.ProductPicUrl);
    }

    private getEmptyProduct() {
        return {
            Name: "",
            Status: "",
            SupplierName: "",
            MainCategory: "",
            Category: "",
            Width: "",
            Height: "",
            WeightMeasure: "",
            ProductPicUrl: ""
        };
    }

    private _refreshProductList(): void {
        const oList = this.view.byId("productList");
        if (oList) {
            const oBinding = oList.getBinding("items");
            oBinding?.refresh();
            this.oModel.refresh();
        }
    }
}
