import BaseController from "../BaseController";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import AppAccessibility from "./AppAccessibility.controller";
import AppLayout from "./AppLayout.controller";

export default class App extends BaseController {
    private accessibilityController: AppAccessibility;
    private layoutController: AppLayout;

    public onInit(): void {
        const globalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel") as JSONModel;
        this.accessibilityController = this.getView()?.getController() as AppAccessibility;
        this.accessibilityController.onInitialFunc();

        this.layoutController = new AppLayout("uimodule.view.App");  
        this.layoutController.onInit();  
        
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

    public onSideNavButtonPress(): void {
        this.layoutController.onSideNavButtonPress();  // AppLayout'tan fonksiyonu çağırıyoruz
    }

    public onUserNamePress(oEvent: any): void {
        this.layoutController.onUserNamePress(oEvent);  // AppLayout fonksiyonunu çağır
    }

    public onNotificationPress(oEvent: any): void {
        this.layoutController.onNotificationPress(oEvent);  // AppLayout fonksiyonunu çağır
    }
}
