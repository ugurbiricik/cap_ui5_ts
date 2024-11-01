import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device"; 
import History from "sap/ui/core/routing/History"; 
import Storage from "sap/ui/util/Storage";


/**
 * @namespace uimodule
 */

export default class Component extends UIComponent {
  private _sContentDensityClass!: string;
  private _storage: Storage;

  public static metadata = {
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
    manifest: "json"
  };

  constructor() {
    super();
  }

  public init(): void {
    super.init();

    this._storage = new Storage(Storage.Type.local);
    

    // Accessibility Model
    const oAccessibilityModel = new JSONModel({
      theme: "sap_fiori_3",
      fontSize: "1rem",
      contrastMode: false,
      blueFilter: false
    });
    this.setModel(oAccessibilityModel, "accessibilityModel");

    this.setModel(models.createDeviceModel(), "device");

    const isUserLoggedIn = this._storage.get("isUserLoggedIn") === "true";
    const userData = this._storage.get("userData");
    let initialData;

    if (isUserLoggedIn && userData) {
        // `localStorage`daki veriler varsa, onları kullanarak modeli başlat
        initialData = {
            isUserLoggedIn: true,
            user: JSON.parse(userData)
        };
        console.log("GlobalModel initialized with localStorage data.");
    } else {
        // Eğer `localStorage`da veri yoksa boş bir model başlat
        initialData = {
            isUserLoggedIn: false,
            user: {}
        };
        console.log("GlobalModel initialized as empty.");
    }

    const oGlobalModel = new JSONModel(initialData);
    this.setModel(oGlobalModel, "globalModel");
    this._initLocalSession();


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

    this.getRouter().initialize();
  }

  private _initLocalSession(): void {
    const oGlobalModel = this.getModel("globalModel") as JSONModel;
     // isUserLoggedIn ve userData değerlerini storage'dan alın
     const isUserLoggedIn = this._storage.get("isUserLoggedIn") === "true";
     const userData = this._storage.get("userData");

    if (isUserLoggedIn && userData) {
        const oUserData = JSON.parse(userData);
        oGlobalModel.setProperty("/isUserLoggedIn", true);
        oGlobalModel.setProperty("/user", oUserData);

        oGlobalModel.refresh(true);
        oGlobalModel.updateBindings(true);
        console.log("User data loaded from localStorage:", oUserData);
    } else {
        // Oturum verisi yoksa boş model ayarla ve login sayfasına yönlendir
        oGlobalModel.setProperty("/isUserLoggedIn", false);
        oGlobalModel.setProperty("/user", {});
        this.getRouter().navTo("Login", {}, true);
    }

    // Model bağlantılarını güncelle
    oGlobalModel.updateBindings(true);
}


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

  public myNavBack(): void {
    const oHistory = History.getInstance();
    const oPrevHash = oHistory.getPreviousHash();

    if (oPrevHash !== undefined) {
      window.history.go(-1);
    } else {
      this.getRouter().navTo("masterSettings", {}, true); 
    }
  }
}
