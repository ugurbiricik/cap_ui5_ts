import BaseController from "../BaseController";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import AppAccessibility from "./AppAccessibility.controller";
import AppLayout from "./AppLayout.controller";
import ResponsivePopover from "sap/m/ResponsivePopover";
import NotificationListItem from "sap/m/NotificationListItem";
import MessageToast from "sap/m/MessageToast";
import Fragment from "sap/ui/core/Fragment";
import Event from "sap/ui/base/Event";

export default class App extends BaseController {
    private accessibilityController: AppAccessibility;
    private layoutController: AppLayout;
    _AccessDialog: any;

    public onInit(): void {
        const globalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel") as JSONModel;
        this.accessibilityController = new AppAccessibility(globalModel);
        this.accessibilityController.onInitialFunc();

        this.layoutController = new AppLayout("appLayout");
    }

    public onSideNavButtonPress(): void {
        console.log("tiklandi");

        this.getView()?.attachAfterRendering(() => {
            const oToolPage = this.getView()?.byId("app");
            console.log("ToolPage: ", oToolPage);
        });
        
        console.log("View: ", this.getView());  // Görünümün doğru gelip gelmediğini kontrol edin
        const oToolPage = this.getView()?.byId("app") as any;
        console.log("ToolPage: ", oToolPage);  // ToolPage'in alınıp alınmadığını kontrol edin

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
            placement:"Bottom",
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

    public async onNotificationVisible(oEvent: any): Promise<void> {
        if (!this._AccessDialog) {
            // Fragment'i yükle ve Popover'ı tanımla
            this._AccessDialog = await Fragment.load({
                name: "uimodule.view.fragments.NotificationPopover",  // Popover tanımı olan Fragment
                controller: this
            });
            this.getView()?.addDependent(this._AccessDialog);
        }
        const oButton = oEvent.getSource(); 
        this._AccessDialog.openBy(oButton);
    }

    public async onUserAuthPopover(oEvent: any): Promise<void> {
        if (!this._AccessDialog) {
            // Fragment'i yükle ve Popover'ı tanımla
            this._AccessDialog = await Fragment.load({
                name: "uimodule.view.fragments.UserAuthPopover",  // Popover tanımı olan Fragment
                controller: this
            });
            this.getView()?.addDependent(this._AccessDialog);
        }
        const oButton = oEvent.getSource(); 
        this._AccessDialog.openBy(oButton);
    }

   
    

    public onAccessVisible(oEvent: any): void {
        this.accessibilityController.onAccessVisible(oEvent);  // AppAccessibility'den çağır
    }

    public onFontSizeChange(oEvent: any): void {
        this.accessibilityController.onFontSizeChange(oEvent);  // AppAccessibility'den çağır
    }

    public onContrastModeChange(oEvent: any): void {
        this.accessibilityController.onContrastModeChange(oEvent);  // AppAccessibility'den çağır
    }

    public onBlueLightChange(oEvent: any): void {
        this.accessibilityController.onBlueLightChange(oEvent);  // AppAccessibility'den çağır
    }

    public onNightModeChange(oEvent: any): void {
        this.accessibilityController.onNightModeChange(oEvent);  // AppAccessibility'den çağır
    }

    public onTextToSpeechChange(oEvent: any): void {
        this.accessibilityController.onTextToSpeechChange(oEvent);  // AppAccessibility'den çağır
    }

    // public onSideNavButtonPress(): void {
    //     this.layoutController.onSideNavButtonPress();  // AppLayout'tan fonksiyonu çağırıyoruz
    // }

    public onUserNamePress(oEvent: any): void {
        this.layoutController.onUserNamePress(oEvent);  // AppLayout fonksiyonunu çağır
    }

    // public onNotificationPress(oEvent: any): void {
    //     this.layoutController.onNotificationPress(oEvent);  // AppLayout fonksiyonunu çağır
    // }
}
