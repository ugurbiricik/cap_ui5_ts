import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";
import Storage from "sap/ui/util/Storage";

export default class Login extends Controller {
    private oDataModel!: ODataModel;
    private oStorage: Storage;

    public onInit(): void {

        this.oStorage = new Storage(Storage.Type.local);
        const oData = {
            email: "",
            password: "",
            isUserLoggedIn: this.oStorage.get("isUserLoggedIn") === "true",
            user: JSON.parse(this.oStorage.get("userData") || "{}")
        };
        const oModel = new JSONModel(oData);
        this.getView()?.setModel(oModel, "loginModel");
        this.oDataModel = (this.getOwnerComponent() as UIComponent).getModel("mainServiceModel") as ODataModel;

        if (oData.isUserLoggedIn) {
            (this.getOwnerComponent() as UIComponent).getRouter().navTo("Home");
        }
    }

    public onLogin(): void {
        const oLoginModel = this.getView()?.getModel("loginModel") as JSONModel;
        const oLoginData = oLoginModel.getData();
        const sEmail = oLoginData.email ? oLoginData.email.trim() : "";
        const sPassword = oLoginData.password ? oLoginData.password.trim() : "";

        if (!sEmail || !sPassword) {
            MessageBox.error("Please enter both email and password.");
            return;
        }

        const aFilters = [
            new Filter("email", FilterOperator.EQ, sEmail),
            new Filter("password", FilterOperator.EQ, sPassword),
        ];

        const oListBinding = this.oDataModel.bindList("/Users", undefined, undefined, aFilters);

        oListBinding.requestContexts().then((aContexts: any[]) => {
            if (aContexts.length > 0) {
                const oUserData = aContexts[0].getObject();

                this.onLoginSuccess(oUserData);

                (this.getOwnerComponent() as UIComponent).getRouter().navTo("Home");

                MessageToast.show("Login successful! Welcome, " + oUserData.name + "."); 
                oLoginModel.setProperty("/email", "");
                oLoginModel.setProperty("/password", "");

            } else {
                MessageBox.error("Invalid email or password. Please try again.");
            }
        }).catch((error: any) => {
            MessageBox.error("An error occurred while verifying the credentials. Please try again. Error: " + error.message);
        });
    }

    private onLoginSuccess(oUserData: any): void {
        const oGlobalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel") as JSONModel;

        // Kullanıcı verisini `globalModel` ve `Storage` ile güncelle
        oGlobalModel.setProperty("/isUserLoggedIn", true);
        oGlobalModel.setProperty("/user", oUserData);

        // Oturum verilerini storage'a kaydet
        this.oStorage.put("isUserLoggedIn", "true");
        this.oStorage.put("userData", JSON.stringify(oUserData));

        // Home sayfasına yönlendir
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Home");

        MessageToast.show("Login successful! Welcome, " + oUserData.username + ".");
    }

    public onNavToRegister(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Register");
    }
}
