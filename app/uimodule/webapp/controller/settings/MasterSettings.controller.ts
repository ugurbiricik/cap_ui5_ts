import BaseController from "uimodule/controller/BaseController";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import formatter from "uimodule/model/formatter";
import UI5Date from "sap/ui/core/date/UI5Date";
import Event from "sap/ui/base/Event";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Component from "uimodule/Component";

export default class MasterSettings extends BaseController {
    formatter = formatter;

    public onInit(): void {
        const oViewModel = new JSONModel({
            currentUser: "Administrator",
            lastLogin: UI5Date.getInstance(Date.now() - 86400000)
        });

        this.setModel(oViewModel, "view");
    }

    public onMasterPressed(oEvent: any): void {
        const oContext = oEvent.getParameter("listItem")?.getBindingContext("side");
        if (!oContext) return;

        const sPath = `${oContext.getPath()}/selected`;
        oContext.getModel().setProperty(sPath, true);

        const sKey = oContext.getProperty("key") as string;
        switch (sKey) {
            case "systemSettings":
                this.getRouter().navTo(sKey);
                break;
            default:
                this.getBundleText(oContext.getProperty("titleI18nKey")).then((sMasterElementText: string) => {
                    this.getBundleText("clickHandlerMessage", [sMasterElementText]).then((sMessageText: string) => {
                        MessageToast.show(sMessageText);
                    });
                });
                break;
        }
    }

    public onSavePressed(oEvent: Event): void {
        this.onGeneralButtonPress(oEvent);
    }

    public onCancelPressed(oEvent: Event): void {
        this.onGeneralButtonPress(oEvent);
    }

    public onGeneralButtonPress(oEvent: any): void {
        const sButtonText = oEvent.getSource()?.getText();
        if (!sButtonText) return;

        this.getBundleText("clickHandlerMessage", [sButtonText]).then((sMessageText: string) => {
            MessageToast.show(sMessageText);
        });
    }

    public onNavButtonPress(): void {
        const oComponent = this.getOwnerComponent() as Component;
        if (oComponent && oComponent.myNavBack) {
            oComponent.myNavBack();
}
    }

    /**
     * Returns a promise which resolves with the resource bundle value of the given key <code>sI18nKey</code>
     *
     * @public
     * @param {string} sI18nKey The key
     * @param {string[]} [aPlaceholderValues] The values which will replace the placeholders in the i18n value
     * @returns {Promise<string>} The promise
     */
    public getBundleText(sI18nKey: string, aPlaceholderValues?: string[]): Promise<string> {
        const i18nModel = this.getModel("i18n") as ResourceModel;
        return this.getBundleTextByModel(sI18nKey, i18nModel, aPlaceholderValues);
    }
}
