import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent"; // UIComponent'i import ettik
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class Navigation extends Controller {
    private _oPopover: any;

    public onInit(): void {
        // Popover oluşturma
        this._oPopover = this.byId("menuPopover");
        if (this._oPopover && this._oPopover.isOpen()) {
            this._oPopover.close();
            this._oPopover.setVisible(false);
        }
    }

    public onNavToHome(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Home");
    }

    public onNavToProducts(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Products");
    }

    public onNavToProductsAdd(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("ProductsAdd");
    }

    public onNavToUsers(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Users");
    }

    public onNavToLogin(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Login");
    }

    public onNavToRegister(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Register");
    }

    public onNavToCart(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Cart");
    }

    public onLogout(): void {
        const oGlobalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel") as JSONModel;
        oGlobalModel?.setProperty("/isUserLoggedIn", false);
        oGlobalModel?.setProperty("/user", {});

        localStorage.removeItem("isUserLoggedIn");
        localStorage.removeItem("userData");

        MessageToast.show("You have been logged out.");
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Login");
    }
}
