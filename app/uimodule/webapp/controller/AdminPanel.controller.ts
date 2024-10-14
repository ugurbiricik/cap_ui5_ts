import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event"; // Event için import
import Router from "sap/ui/core/routing/Router";
import SideNavigation from "sap/tnt/SideNavigation";
import NavigationListItem from "sap/tnt/NavigationListItem";

export default class AdminPanel extends Controller {

    public onInit(): void {
        const oSideNavigation = this.byId("sideNavigation");

        // Add event listeners for hover functionality
        oSideNavigation?.addEventDelegate({
            onmouseover: () => {
                this._expandSideNavigation();
            },
            onmouseout: () => {
                this._collapseSideNavigation();
            }
        });
    }

    private _expandSideNavigation(): void {
        const oSideNavigation = this.byId("sideNavigation") as SideNavigation;
        oSideNavigation?.setExpanded(true);
    }

    private _collapseSideNavigation(): void {
        const oSideNavigation = this.byId("sideNavigation") as SideNavigation;
        oSideNavigation?.setExpanded(false);
    }

    public onItemSelect(oEvent: Event): void {
        // Seçilen itemin key'ini alıyoruz
        const oItem: any = oEvent.getParameter("item" as never); // Türü 'any' olarak belirtiyoruz
        if (!oItem || !(oItem instanceof NavigationListItem)) {
            MessageToast.show("No item selected.");
            return; // Eğer item seçilmemişse işlemden çık
        }
    
        const sKey: string = oItem.getKey(); // oItem'den getKey() metodunu çağır
    
        // Router kullanarak yönlendirme yapıyoruz
        this.getRouter().navTo(sKey); // Key ile doğrudan rota adı eşleşiyor
    }
    

    public getRouter(): Router {
        return UIComponent.getRouterFor(this); // UIComponent üzerinden router'ı alıyoruz
    }
}
