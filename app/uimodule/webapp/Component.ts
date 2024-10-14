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

  // Constructor ekleniyor
  constructor() {
    super();  // UIComponent'in constructor'ını çağırıyoruz
  }

  // init metodu, uygulama başlatılırken çalışır
  public init(): void {
    // Parent sınıfın init fonksiyonunu çağırın
    super.init();

    const oAccessibilityModel = new JSONModel({
      theme: "sap_fiori_3",
      fontSize: "1rem",
      contrastMode: false,
      blueFilter: false
  });
  this.setModel(oAccessibilityModel, "accessibilityModel");

    // Device modelini yükle
    this.setModel(models.createDeviceModel(), "device");

    // Global Model
    const oGlobalModel = new JSONModel({
      isUserLoggedIn: false,
      username: ""
    });
    this.setModel(oGlobalModel, "globalModel");

    // cartModel (JSON Model) tanımlama - sepet bilgilerini geçici olarak saklar
    const oCartModel = new JSONModel({
      cartID: null,    // Sepet ID'si
      totalQuantity: 0, // Sepetteki toplam ürün adedi
      totalAmount: 0    // Sepetteki toplam tutar
    });
    this.setModel(oCartModel, "cartModel"); // Modeli view'de kullanmak için set et

    // OData Model'in Tanımlanması ve Global Olarak Set Edilmesi
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

    // Local session ayarlarının başlatılması
    this._initLocalSession();

    // Router'ın başlatılması
    this.getRouter().initialize();
  }

  // Local session bilgilerini başlatır
  private _initLocalSession(): void {
    const oGlobalModel = this.getModel("globalModel") as JSONModel;
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const userData = localStorage.getItem("userData");

    if (isUserLoggedIn) {
      const oUserData = JSON.parse(userData || "{}");
      oGlobalModel.setProperty("/isUserLoggedIn", true);
      oGlobalModel.setProperty("/user", oUserData);
    } else {
      this.getRouter().navTo("Login", {}, true); // Kullanıcı giriş yapmadıysa login ekranına yönlendir
    }
  }
}
