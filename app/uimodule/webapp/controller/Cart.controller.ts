import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ODataModel from "sap/ui/model/odata/v4/ODataModel"; 

export default class Cart extends Controller {
    private oModel!: ODataModel; 
    private oCartModel!: JSONModel; 

    public onInit(): void {
        this.oModel = (this.getOwnerComponent() as UIComponent).getModel("mainServiceModel") as ODataModel;
        this.getView()?.setModel(this.oModel);
        this.loadCartData();
    }
    public loadCartData(): void {
        const oGlobalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel");
        
        if (!oGlobalModel) {
            MessageToast.show("Global model yüklenmedi.");
            console.error("Global model bulunamadı.");
            return;
        }

        const sUserID = oGlobalModel.getProperty("/user/ID");

        if (!sUserID) {
            MessageToast.show("Kullanıcı ID'si bulunamadı.");
            console.error("Kullanıcı ID'si null veya undefined.");
            return;
        }

        const oCartBinding = this.oModel.bindList("/Cart", undefined, undefined, new Filter("userID_ID", FilterOperator.EQ, sUserID));
        
        oCartBinding.requestContexts().then((aContexts: any[]) => {
            this.oCartModel = new JSONModel();
            this.oCartModel.setData(aContexts.map(oContext => oContext.getObject()));
            this.getView()?.setModel(this.oCartModel, "cartModel");
        }).catch((oError: any) => {
            MessageToast.show("Sepet verileri yüklenemedi: " + oError.message);
        });
    }
    public onUpdateCart(): void {
        MessageToast.show("Sepet güncellendi.");
    }
    public onClearCart(): void {
        MessageToast.show("Sepet boşaltıldı.");
    }
    public onCheckout(): void {
        MessageToast.show("Satın alma işlemi başlatıldı.");
    }
}
