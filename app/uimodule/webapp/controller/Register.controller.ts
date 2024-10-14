import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UIComponent from "sap/ui/core/UIComponent";


export default class Register extends Controller {
    private oModel!: ODataModel;

    public onInit(): void {
        console.log("Register controller initialized.");
        const oData = {
            newUser: {
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            }
        };

        const oModel = new JSONModel(oData);
        this.getView()?.setModel(oModel, "registerModel");

        this.oModel = this.getOwnerComponent()?.getModel("mainServiceModel") as ODataModel;
        console.log(this.oModel, "this.oModel")
    }

    public onNavToLogin(): void {
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("Login");


    }

    public onRegister(): void {
        console.log("Register butonuna tiklandi");
        const oModel = this.getView()?.getModel("registerModel") as JSONModel;
        const oNewUserData = oModel?.getProperty("/newUser") as {
            username: string;
            email: string;
            password: string;
            confirmPassword: string;
        };

        if (!oNewUserData.username || !oNewUserData.email || !oNewUserData.password || !oNewUserData.confirmPassword) {
            MessageToast.show("Please fill in all fields.");
            return;
        }

        if (oNewUserData.password !== oNewUserData.confirmPassword) {
            MessageToast.show("Passwords do not match.");
            return;
        }

        const sRole = oNewUserData.email === "ugur@gmail.com" ? "admin" : "client";

        const oUserToSend = {
            username: oNewUserData.username,
            email: oNewUserData.email,
            password: oNewUserData.password,
            role: sRole
        };

        const oListBinding = this.oModel?.bindList("/Users") as ODataListBinding;

        oListBinding.create(oUserToSend).created()?.then(() => {
            MessageToast.show("Registration successful!");
            oModel?.setProperty("/newUser", {
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            (this.getOwnerComponent() as UIComponent).getRouter().navTo("Login");

        }).catch((error: any) => {
            MessageToast.show("Registration failed: " + error.message);
        });
    }
}
