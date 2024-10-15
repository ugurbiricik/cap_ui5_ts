import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace uimodule
 */

export default class Component extends UIComponent {

  public static metadata = {
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
    manifest: "json"
  };
  constructor() {
    super(); 
  }
  public init(): void {
    super.init();

    const oAccessibilityModel = new JSONModel({
      theme: "sap_fiori_3",
      fontSize: "1rem",
      contrastMode: false,
      blueFilter: false
  });
  this.setModel(oAccessibilityModel, "accessibilityModel");

    this.setModel(models.createDeviceModel(), "device");

   
    const oGlobalModel = new JSONModel({
      isUserLoggedIn: false,
      username: ""
    });
    this.setModel(oGlobalModel, "globalModel");
    const oCartModel = new JSONModel({
      cartID: null, 
      totalQuantity: 0, 
      totalAmount: 0  
    });
    this.setModel(oCartModel, "cartModel");
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
    this._initLocalSession();
    this.getRouter().initialize();
  }
  private _initLocalSession(): void {
    const oGlobalModel = this.getModel("globalModel") as JSONModel;
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const userData = localStorage.getItem("userData");

    if (isUserLoggedIn) {
      const oUserData = JSON.parse(userData || "{}");
      oGlobalModel.setProperty("/isUserLoggedIn", true);
      oGlobalModel.setProperty("/user", oUserData);
    } else {
      this.getRouter().navTo("Login", {}, true); 
    }
  }
}
