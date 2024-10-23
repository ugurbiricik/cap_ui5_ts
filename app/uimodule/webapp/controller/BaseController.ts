import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Model from "sap/ui/model/Model";
import View from "sap/ui/core/mvc/View";
import Router from "sap/ui/core/routing/Router";

export default class BaseController extends Controller {

    /**
     * Convenience method for accessing the router.
     * @public
     * @returns {sap.ui.core.routing.Router} the router for this component
     */
    public getRouter(): Router {
        return UIComponent.getRouterFor(this) as Router;
    }

    /**
     * Convenience method for getting the view model by name.
     * @public
     * @param {string} [sName] the model name
     * @returns {sap.ui.model.Model} the model instance
     */
    public getModel(sName?: string): Model {
        return this.getView()?.getModel(sName) as Model;
    }

    /**
     * Convenience method for setting the view model.
     * @public
     * @param {sap.ui.model.Model} oModel the model instance
     * @param {string} sName the model name
     * @returns {sap.ui.mvc.View} the view instance
     */
    public setModel(oModel: Model, sName?: string): View {
        return this.getView()?.setModel(oModel, sName) as View;
    }

    /**
     * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
     *
     * @public
     * @param {string} sI18nKey The key
     * @param {sap.ui.core.model.ResourceModel} oResourceModel The resource model
     * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
     * @returns {Promise<string>} The promise
     */
    public getBundleTextByModel(sI18nKey: string, oResourceModel: ResourceModel, aPlaceholderValues?: string[]): Promise<string> {
        const oBundleOrPromise = oResourceModel.getResourceBundle();
    
        if (oBundleOrPromise instanceof Promise) {
            return oBundleOrPromise.then((oBundle: any) => {
                return oBundle.getText(sI18nKey, aPlaceholderValues) ?? ""; // Eğer undefined ise, boş string döner
            });
        } else {
            return Promise.resolve(oBundleOrPromise.getText(sI18nKey, aPlaceholderValues) ?? ""); // Aynı şekilde burada da kontrol
        }
    }
    
    
}
