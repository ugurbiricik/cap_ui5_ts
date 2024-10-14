import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent"; // UIComponent'i import ettik
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";

export default class Home extends Controller {

    public onInit(): void {
        // Başlangıç işlemleri, eğer gerekliyse
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
        // Raportlar sayfasına yönlendirme
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Reports");
    }

    public onMenuPress(oEvent: Event): void {
        // Menü ikonuna tıklanınca yapılacak işlemler
        MessageToast.show("Menu Clicked!");
    }
}
