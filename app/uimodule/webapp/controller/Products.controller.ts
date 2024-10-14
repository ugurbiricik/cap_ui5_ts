import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Fragment from "sap/ui/core/Fragment";
import MessageBox from "sap/m/MessageBox";
// import formatter from "../model/formatter";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Dialog from "sap/m/Dialog";
import Text from "sap/m/Text";
import Button from "sap/m/Button";




export default class Products extends Controller {
    private oModel!: ODataModel;
    private oEventBus: any;
    private _pEditDialog: any;
    private _oProductContext: any;

    // public formatter = formatter;

    public onInit(): void {
        const oCartModel = new JSONModel({
            quantity: 0 // Initialize quantity as 0
        });
        this.getView()?.setModel(oCartModel, "cartModel");

        // Ana OData modelini al ve View'e ata
        this.oModel = this.getOwnerComponent()?.getModel("mainServiceModel") as ODataModel;
        this.getView()?.setModel(this.oModel);

        // Yeni ürün eklemek için kullanılan JSON modelini tanımla
        const oNewProductModel = new JSONModel({
            newProduct: {
                name: "",
                price: 0,
                description: "",
                image: "" // URL alanı
            }
        });
        this.getView()?.setModel(oNewProductModel, "newProductModel");

        // View'ler arası olayları yönetmek için EventBus tanımla
        this.oEventBus = sap.ui.getCore().getEventBus();
    }

    public onAddProduct(): void {
        const oNewProductModel = this.getView()?.getModel("newProductModel") as JSONModel;
        const oNewProductData = oNewProductModel?.getProperty("/newProduct");

        // Boş alanların olup olmadığını kontrol et
        if (!oNewProductData.name || !oNewProductData.price || !oNewProductData.description || !oNewProductData.image) {
            MessageToast.show("Please fill all product details and enter an image URL.");
            return;
        }

        // Price ve Stock alanlarının geçerli olup olmadığını kontrol et
        if (isNaN(oNewProductData.price)) {
            MessageToast.show("Please enter valid numeric values for Price.");
            return;
        }

        // OData modeline yeni ürün ekle
        const oListBinding = this.oModel?.bindList("/Products") as ODataListBinding;

        oListBinding.create(oNewProductData).created()?.then(() => {
            MessageToast.show("Product successfully added!");
            (this.getOwnerComponent() as UIComponent).getRouter().navTo("Products");

            // Formu sıfırla
            oNewProductModel.setProperty("/newProduct", {
                name: "",
                price: 0,
                description: "",
                image: "" // URL alanını sıfırla
            });
            this._refreshProductList();
        }).catch((error: any) => {
            MessageToast.show("Failed to add product: " + error.message);
        });
    }

    public onDeleteProductPress(oEvent: Event): void {
        const oContext = (oEvent.getSource() as Control).getBindingContext("mainServiceModel");

        const sProductName = oContext?.getProperty("name");

        if (!oContext) {
            MessageToast.show("Please select the product you want to delete.");
            return;
        }

        const oDialog = new Dialog({
            title: "Delete Confirmation",
            type: "Message",
            content: new Text({ text: "Are you sure you want to delete this product? Product: " + sProductName }),
            beginButton: new Button({
                text: "Yes",
                type: "Emphasized",
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

    private _refreshProductList(): void {
        const oList = this.byId("productList");
        if (oList) {
            const oBinding = oList.getBinding("items");
            oBinding?.refresh();
            this.oModel?.refresh();
        }
    }

    public onIncrease(oEvent: Event): void {
        const oButton = (oEvent.getSource() as Control);
        const oProductContext = oButton.getBindingContext("mainServiceModel");
        const sProductID = oProductContext?.getProperty("ID");

        const oCartModel = this.getView()?.getModel("cartModel") as JSONModel;
        let aCartItems = oCartModel.getProperty("/cartItems") as any[];

        const oCartItem = aCartItems.find(item => item.productID === sProductID);

        if (oCartItem) {
            oCartItem.quantity += 1;
        } else {
            aCartItems.push({
                productID: sProductID,
                quantity: 1
            });
        }

        oCartModel.setProperty("/cartItems", aCartItems);
    }

    public onDecrease(oEvent: Event): void {
        const oButton = (oEvent.getSource() as Control);
        const oProductContext = oButton.getBindingContext("mainServiceModel");
        const sProductID = oProductContext?.getProperty("ID");

        const oCartModel = this.getView()?.getModel("cartModel") as JSONModel;
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
        const sUserID = (this.getView()?.getModel("globalModel") as JSONModel).getProperty("/user/ID");
        const fProductPrice = oProductContext?.getProperty("price");

        const oCartModel = this.getView()?.getModel("cartModel") as JSONModel;
        const iQuantity = oCartModel.getProperty("/quantity");

        const oCartListBinding = this.oModel?.bindList("/Cart") as ODataListBinding;

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
                name: "uimodule.view.fragments.EditProductDialog"
            });
            this.getView()?.addDependent(this._pEditDialog);
        }

        const oEditModel = new JSONModel({
            product: oProductData
        });
        this.getView()?.setModel(oEditModel, "editProductModel");

        this._oProductContext = oProductContext;

        this._pEditDialog.open();
    }

    public onSaveEditProduct(): void {
        const oEditModel = this.getView()?.getModel("editProductModel") as JSONModel;
        const oProductData = oEditModel.getProperty("/product");

        const oModel = this.getView()?.getModel("mainServiceModel") as ODataModel;

        const sProductID = oProductData.ID;

        const oBindList = oModel.bindList("/Products");
        const aFilter = new Filter("ID", FilterOperator.EQ, sProductID);

        oBindList.filter(aFilter).requestContexts().then((aContexts: any[]) => {
            if (aContexts.length > 0) {
                const oContext = aContexts[0];

                oContext.setProperty("name", oProductData.name);
                oContext.setProperty("price", oProductData.price);
                oContext.setProperty("description", oProductData.description);
                oContext.setProperty("image", oProductData.image);

                oModel.refresh();

                MessageToast.show("Product updated successfully.");
                this._pEditDialog.close();
            } else {
                MessageToast.show("Product not found for update.");
            }
        }).catch((oError: any) => {
            MessageBox.error("Failed to update product: " + oError.message);
        });
    }

    public onCancelEditProduct(): void {
        this._pEditDialog?.close();
    }
}
