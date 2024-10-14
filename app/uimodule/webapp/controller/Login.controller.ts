import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";

export default class Login extends Controller {
    private oDataModel!: ODataModel;

    public onInit(): void {
        const oData = {
            email: "",
            password: ""
        };
        const oModel = new JSONModel(oData);
        this.getView()?.setModel(oModel, "loginModel");

        this.oDataModel = (this.getOwnerComponent() as UIComponent).getModel("mainServiceModel") as ODataModel;
    }

    public onLogin(): void {
        const oLoginModel = this.getView()?.getModel("loginModel") as JSONModel;
        const oLoginData = oLoginModel.getData();
        console.log(oLoginData, "Login Data");
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
                (this.getOwnerComponent() as UIComponent).getRouter().navTo("Home");
                const oUserData = aContexts[0].getObject();

                const oGlobalModel = (this.getOwnerComponent() as UIComponent).getModel("globalModel") as JSONModel;
                oGlobalModel.setProperty("/isUserLoggedIn", true);
                oGlobalModel.setProperty("/user", oUserData);

                localStorage.setItem("isUserLoggedIn", "true");
                localStorage.setItem("userData", JSON.stringify(oUserData));

                MessageToast.show("Login successful! Welcome, " + oUserData.name + "."); // oUserData'dan isim al
                oLoginModel.setProperty("/email", "");
                oLoginModel.setProperty("/password", "");

            } else {
                MessageBox.error("Invalid email or password. Please try again.");
            }
        }).catch((error: any) => {
            MessageBox.error("An error occurred while verifying the credentials. Please try again. Error: " + error.message);
        });
    }

    public onNavToRegister(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Register");
    }
}
