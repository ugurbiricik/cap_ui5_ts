import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import Router from "sap/ui/core/routing/Router";
import SideNavigation from "sap/tnt/SideNavigation";
import NavigationListItem from "sap/tnt/NavigationListItem";

export default class AdminPanel extends Controller {

    public onInit(): void {
        const oSideNavigation = this.byId("sideNavigation");

     
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
       
        const oItem: any = oEvent.getParameter("item" as never); 
        if (!oItem || !(oItem instanceof NavigationListItem)) {
            MessageToast.show("No item selected.");
            return; 
        }
    
        const sKey: string = oItem.getKey(); 

        this.getRouter().navTo(sKey);
    }
    

    public getRouter(): Router {
        return UIComponent.getRouterFor(this); 
    }
}
