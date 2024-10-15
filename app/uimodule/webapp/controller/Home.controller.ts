import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent"; 
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";

export default class Home extends Controller {

    public onInit(): void {
    }

    public onNavToHome(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Home");
    }

    public onNavToProducts(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Products");
    }

    public onNavToUsers(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Users");
    }

    public onNavToReports(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Reports");
    }

    public onMenuPress(oEvent: Event): void {
        MessageToast.show("Menu Clicked!");
    }
}
