import BaseController from "../BaseController";
import ActionSheet from "sap/m/ActionSheet";
import Button from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";
import ResponsivePopover from "sap/m/ResponsivePopover";
import NotificationListItem from "sap/m/NotificationListItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import Component from "uimodule/Component";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default class AppLayout extends BaseController {
    private _bExpanded: boolean = true;

    public onInit(): void {
        const oComponent = this.getOwnerComponent() as Component;
        if (oComponent) {
            this.getView()?.addStyleClass(oComponent.getContentDensityClass());
    
            this.getRouter().attachRouteMatched(this.onRouteChange.bind(this));
        }
    
        if (window.innerWidth <= 1024) {
            this.onSideNavButtonPress();
        }
        window.addEventListener("resize", this._handleWindowResize.bind(this));
    }
    

    public onExit(): void {
        window.removeEventListener("resize", this._handleWindowResize.bind(this));
    }

    public onRouteChange(oEvent: any): void {
        const sideModel = (this.getOwnerComponent() as Component).getModel("side") as JSONModel;
        sideModel.setProperty("/selectedKey", oEvent.getParameter("name"));
        if (window.innerWidth <= 768) {
            this.onSideNavButtonPress();
        }
    }

    public onUserNamePress(oEvent: any): void {
        const oSource = oEvent.getSource();
        const oActionSheet = new ActionSheet({
            title: "User Actions",
            buttons: [
                new Button({
                    text: "User Settings",
                    press: () => MessageToast.show("User Settings pressed")
                }),
                new Button({
                    text: "Online Guide",
                    press: () => MessageToast.show("Online Guide pressed")
                }),
                new Button({
                    text: "Feedback",
                    press: () => MessageToast.show("Feedback pressed")
                }),
                new Button({
                    text: "Help",
                    press: () => MessageToast.show("Help pressed")
                }),
                new Button({
                    text: "Logout",
                    press: () => MessageToast.show("Logout pressed")
                })
            ]
        });

        this.getView()?.addDependent(oActionSheet);
        oActionSheet.openBy(oSource);
    }

    public onSideNavButtonPress(): void {
        console.log("tiklandi");
        const oToolPage = this.getView()?.byId("app") as any;  // this.byId yerine getView()?.byId kullan
        if (oToolPage) {
            const bSideExpanded = oToolPage.getSideExpanded();
            this._setToggleButtonTooltip(bSideExpanded);
            oToolPage.setSideExpanded(!bSideExpanded);
        } else {
            console.error("ToolPage bulunamadı veya app id'li kontrol yok.");
        }
    }
    

    private _setToggleButtonTooltip(bSideExpanded: boolean): void {
        const oToggleButton = this.byId("sideNavigationToggleButton") as any;
        const tooltipText = bSideExpanded ? "Collapse Menu" : "Expand Menu";
        oToggleButton.setTooltip(tooltipText);
    }

    public onNotificationPress(oEvent: any): void {
        const oSource = oEvent.getSource();
        const oNotificationPopover = new ResponsivePopover({
            title: "Notifications",
            contentWidth: "300px",
            content: new NotificationListItem({
                title: "Sample Notification",
                description: "This is a sample notification.",
                close: () => MessageToast.show("Notification closed")
            })
        });

        this.getView()?.addDependent(oNotificationPopover);
        oNotificationPopover.openBy(oSource);
    }

    async getBundleText(sI18nKey: string, aPlaceholderValues: string[]): Promise<string | undefined> {
        return await this.getBundleTextByModel(sI18nKey, this.getModel("i18n") as ResourceModel, aPlaceholderValues);
    }
    
    private _handleWindowResize(): void {
        if (window.innerWidth <= 1024 && this._bExpanded) {
            this.onSideNavButtonPress();
            this._bExpanded = false;
        } else if (window.innerWidth > 1024) {
            this._bExpanded = true;
        }
    }
}
