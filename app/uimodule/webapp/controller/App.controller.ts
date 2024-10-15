import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Panel from "sap/m/Panel";
import Dialog, { Dialog$AfterOpenEvent } from "sap/m/Dialog";
import Button from "sap/m/Button";
import Select from "sap/m/Select";
import Fragment from "sap/ui/core/Fragment";
import JSONModel from "sap/ui/model/json/JSONModel";

  
export default class App extends Controller {

    private _AccessDialog: any;

    public onInit(): void {

        const globalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel") as JSONModel;
        globalModel.setData({
            accessibility: {
                fontSize: 3, // Default font size
                contrastMode: false,
                blueLight: 30, // Blue light intensity
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
        // Popover'ı açmak için kaynağı belirtin (örn. ikon)
        const oButton = oEvent.getSource(); 
        this._AccessDialog.openBy(oButton);
    }
    
    public onCloseAccessibilityPopover(): void {
        this._AccessDialog.close();
    }
    public onFontSizeChange(oEvent: any): void {
        const newValue: number = oEvent.getParameter("value");
    
        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
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
    
        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/blueLight", newValue);
        }
        const blueLightIntensity = (100 - newValue) / 100;
        document.body.style.filter = `brightness(${blueLightIntensity})`;
    }

    public onNightModeChange(oEvent: any): void {
        const isNightMode = oEvent.getParameter("state");

        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/nightMode", isNightMode);
        }
        document.body.classList.toggle("night-mode", isNightMode); 
    }

    public onTextToSpeechChange(oEvent: any): void {
        const isTextToSpeech = oEvent.getParameter("state");

        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
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

  