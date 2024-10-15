import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast"; 
import MessageBox from "sap/m/MessageBox"; 
import EventBus from "sap/ui/core/EventBus"; 
import Event from "sap/ui/base/Event";
import Table from "sap/m/Table";
import Control from "sap/ui/core/Control"; 
export default class Users extends Controller {
  private oModel: any;
  private oEventBus: EventBus;

  public onInit(): void {
    const oComponent = this.getOwnerComponent();
    if (oComponent) {
      this.oModel = oComponent.getModel("mainServiceModel");
      this.getView()?.setModel(this.oModel);
    } 
    this.oEventBus = sap.ui.getCore().getEventBus();

    this.onReadProducts();
  }

  public onReadProducts(): void {
    const oListBinding = this.oModel.bindList("/Users");

    oListBinding.requestContexts().then((aContexts: any[]) => {

      const oTable = this.byId("usersTable") as Table;
      const oBinding = oTable.getBinding("items");
        if (oBinding) {
        oBinding.refresh();
      }

      MessageToast.show("Kullanıcılar başarıyla yüklendi!");
    }).catch((error: any) => {
      MessageToast.show("Kullanıcıları okuma başarısız oldu: " + error.message);
    });
  }

  public onDeleteUser(oEvent: Event): void {
    let sUser: string;
    const oSource = oEvent.getSource() as Control; 
    const oContext = oSource.getParent()?.getParent()?.getBindingContext();
    if (!oContext) {
      MessageToast.show("Lütfen silmek istediğiniz kullanıcıyı seçin.");
      return;
    }
    sUser = oContext.getProperty("username");
    MessageBox.confirm(
      "Kullanıcıyı silmek istediğinize emin misiniz? Kullanıcı: " + sUser,
      {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: (sAction: string) => {
          if (sAction === MessageBox.Action.YES) {
            (oContext as any).delete().then(() => {
              MessageToast.show("Kullanıcı başarıyla silindi: " + sUser);
              this.oEventBus.publish("Users", "userDeleted");
            }).catch((oError: any) => {
              MessageBox.error("Kullanıcı silme başarısız oldu: " + oError.message);
            });
          }
        }
      }
    );
  }
}
