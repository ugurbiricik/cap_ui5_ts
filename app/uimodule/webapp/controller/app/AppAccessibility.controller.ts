import BaseController from "../BaseController";
import Fragment from "sap/ui/core/Fragment";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class AppAccessibility extends BaseController {

    private _AccessDialog: any;
    private globalModel: JSONModel;

    constructor(globalModel: JSONModel) {
        super("AppAccessibility"); // BaseController'a sName parametresini geçiyoruz
        this.globalModel = globalModel;
    }
    

    public onInitialFunc(): void {
        this.globalModel.setData({
            accessibility: {
                fontSize: 3, // Varsayılan yazı tipi boyutu
                contrastMode: false,
                blueLight: 30, // Mavi ışık yoğunluğu
                nightMode: false,
                textToSpeech: false,
            }
        });
    }

    public async onAccessVisible(oEvent: any): Promise<void> {
        if (!this._AccessDialog) {
            // Fragment'i yükle ve Popover'ı tanımla
            this._AccessDialog = await Fragment.load({
                name: "uimodule.view.fragments.AccessPopover",  // Popover tanımı olan Fragment
                controller: this
            });
            this.getView()?.addDependent(this._AccessDialog);
        }
        const oButton = oEvent.getSource(); 
        this._AccessDialog.openBy(oButton);
    }

    public onCloseAccessibilityPopover(): void {
        this._AccessDialog.close();
    }

    public onFontSizeChange(oEvent: any): void {
        const newValue: number = oEvent.getParameter("value");
        const globalModel = this.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/fontSize", newValue);
        }
        document.documentElement.style.fontSize = `${newValue * 10}px`;
    }

    public onContrastModeChange(oEvent: any): void {
        const isContrastEnabled = oEvent.getParameter("state");
        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;

        if (globalModel) {
            globalModel.setProperty("/accessibility/contrastMode", isContrastEnabled);
        }

        document.body.classList.toggle("high-contrast", isContrastEnabled); 
    }

    public onBlueLightChange(oEvent: any): void {
        const newValue = oEvent.getParameter("value");
        const globalModel = this.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/blueLight", newValue);
        }
        const blueLightIntensity = (100 - newValue) / 100;
        document.body.style.filter = `brightness(${blueLightIntensity})`;
    }

    public onNightModeChange(oEvent: any): void {
        const isNightMode = oEvent.getParameter("state");
        const globalModel = this.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/nightMode", isNightMode);
        }
        document.body.classList.toggle("night-mode", isNightMode); 
    }

    public onTextToSpeechChange(oEvent: any): void {
        const isTextToSpeech = oEvent.getParameter("state");
        const globalModel = this.getModel("globalModel") as JSONModel;

        if (globalModel) {
            globalModel.setProperty("/accessibility/textToSpeech", isTextToSpeech);
        }

        if (isTextToSpeech) {
            this.startTextToSpeech(); 
        }
    }

    public startTextToSpeech(): void {
        const text = document.body.innerText; 
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }
}
