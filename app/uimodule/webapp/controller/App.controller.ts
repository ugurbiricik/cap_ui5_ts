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

    public async onAccessVisible(): Promise<void> {
      if (!this._AccessDialog) {
          this._AccessDialog = await Fragment.load({
              name: "uimodule.view.fragments.AccessDialog",
              controller: this
          });
          this.getView()?.addDependent(this._AccessDialog);
      }
      this._AccessDialog.open();
    }

    // Close Accessibility Dialog
    public onCloseAccessibilityDialog(): void {
        this._AccessDialog.close();
    }

    // Handlers for Accessibility Features
    public onFontSizeChange(oEvent: any): void {
        // Slider olayındaki value parametresini alıyoruz
        const newValue: number = oEvent.getParameter("value");
    
        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/fontSize", newValue);
        }
    
        // Yazı boyutunu global olarak ayarlıyoruz
        document.documentElement.style.fontSize = `${newValue * 10}px`;
    }
    

    public onContrastModeChange(oEvent: any): void {
        const isContrastEnabled = oEvent.getParameter("state");
    
        // Modeli JSONModel olarak dönüştürüyoruz
        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/contrastMode", isContrastEnabled);
        }
    
        document.body.classList.toggle("high-contrast", isContrastEnabled); // Kontrast modunu değiştir
    }
    

    public onBlueLightChange(oEvent: any): void {
        const newValue = oEvent.getParameter("value");
    
        // Modeli JSONModel olarak dönüştürüyoruz
        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/blueLight", newValue);
        }
    
        // Mavi ışık filtresi için ayar yapıyoruz
        const blueLightIntensity = (100 - newValue) / 100;
        document.body.style.filter = `brightness(${blueLightIntensity})`;
    }

    public onNightModeChange(oEvent: any): void {
        const isNightMode = oEvent.getParameter("state");

        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/nightMode", isNightMode);
        }
        document.body.classList.toggle("night-mode", isNightMode); // Toggle night mode
    }

    public onTextToSpeechChange(oEvent: any): void {
        const isTextToSpeech = oEvent.getParameter("state");

        const globalModel = this.getView()?.getModel("globalModel") as JSONModel;
    
        if (globalModel) {
            globalModel.setProperty("/accessibility/textToSpeech", isTextToSpeech);
        }
        if (isTextToSpeech) {
            this.startTextToSpeech(); // Implement your text-to-speech functionality here
        }
    }

    // Implement your text-to-speech functionality here
    public startTextToSpeech(): void {
        const text = document.body.innerText; // Get the entire page's text
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }
  }

  