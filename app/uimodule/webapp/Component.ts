import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device"; 
import History from "sap/ui/core/routing/History"; 


/**
 * @namespace uimodule
 */

export default class Component extends UIComponent {
  private _sContentDensityClass!: string;

  public static metadata = {
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
    manifest: "json"
  };

  constructor() {
    super();
  }

  public init(): void {
    super.init();

    // Accessibility Model
    const oAccessibilityModel = new JSONModel({
      theme: "sap_fiori_3",
      fontSize: "1rem",
      contrastMode: false,
      blueFilter: false
    });
    this.setModel(oAccessibilityModel, "accessibilityModel");

    // Device Model
    this.setModel(models.createDeviceModel(), "device");

    // Global Model
    const oGlobalModel = new JSONModel({
      isUserLoggedIn: false,
      username: ""
    });
    this.setModel(oGlobalModel, "globalModel");

    // Cart Model
    const oCartModel = new JSONModel({
      cartID: null,
      totalQuantity: 0,
      totalAmount: 0
    });
    this.setModel(oCartModel, "cartModel");

    // OData Model (mainServiceModel)
    let oODataModel = this.getModel("mainServiceModel") as ODataModel;
    if (!oODataModel) {
      oODataModel = new ODataModel({
        serviceUrl: "/odata/v4/product/",
        synchronizationMode: "None",
        operationMode: "Server",
        autoExpandSelect: true,
        earlyRequests: true,
        updateGroupId: "myUpdateGroup"
      });
      this.setModel(oODataModel, "mainServiceModel");
    }

    // Local session initialization
    this._initLocalSession();
    
    // Router initialization
    this.getRouter().initialize();
  }

  // Local session initialization
  private _initLocalSession(): void {
    const oGlobalModel = this.getModel("globalModel") as JSONModel;
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const userData = localStorage.getItem("userData");

    if (isUserLoggedIn) {
      const oUserData = JSON.parse(userData || "{}");
      oGlobalModel.setProperty("/isUserLoggedIn", true);
      oGlobalModel.setProperty("/user", oUserData);
    } else {
      // this.getRouter().navTo("Login", {}, true);
      console.log("user logged out")
    }
  }

  // Content Density Class fonksiyonu (Cihaz tipi kontrolü)
  public getContentDensityClass(): string {
    if (!this._sContentDensityClass) {
      // Dokunmatik cihazlar için cozy, diğerleri için compact
      if (!Device.support.touch) {
        this._sContentDensityClass = "sapUiSizeCompact";
      } else {
        this._sContentDensityClass = "sapUiSizeCozy";
      }
    }
    return this._sContentDensityClass;
  }

  // Geri navigasyon fonksiyonu
  public myNavBack(): void {
    const oHistory = History.getInstance();
    const oPrevHash = oHistory.getPreviousHash();

    if (oPrevHash !== undefined) {
      window.history.go(-1);
    } else {
      this.getRouter().navTo("masterSettings", {}, true);  // Eğer geri gidilecek bir yer yoksa masterSettings'e git
    }
  }
}
