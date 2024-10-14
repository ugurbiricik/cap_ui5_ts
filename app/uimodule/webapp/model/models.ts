import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";

const models = {
    createDeviceModel: function (): JSONModel {
        const oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
    }
};

export default models;