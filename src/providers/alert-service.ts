import { Injectable } from "@angular/core";
import { ModalController } from "ionic-angular";
import { ModelInfoPage } from "../pages/model-info/model-info";
import { ModelErrorPage } from "../pages/model-error/model-error";
import { ModelAlertPage } from "../pages/model-alert/model-alert";

@Injectable()
export class AlertService {
  constructor(public modalCtrl: ModalController) {}

  public showInfo(
    primaryMessage: string,
    secundaryMessage?: string,
    onDismiss?: Function
  ) {
    let modal = this.modalCtrl.create(
      ModelInfoPage,
      { primaryMessage: primaryMessage, secundaryMessage: secundaryMessage },
      { enableBackdropDismiss: true }
    );

    if (onDismiss) {
      modal.onWillDismiss(data => {
        onDismiss();
      });
    }
    modal.present();
  }

  public showError(
    primaryMessage: string,
    secundaryMessage?: string,
    onDismiss?: Function
  ) {
    let modal = this.modalCtrl.create(
      ModelErrorPage,
      { primaryMessage: primaryMessage, secundaryMessage: secundaryMessage },
      { enableBackdropDismiss: true }
    );

    if (onDismiss) {
      modal.onWillDismiss(data => {
        onDismiss();
      });
    }
    modal.present();
  }

  public showAlert(
    primaryMessage: string,
    secundaryMessage?: string,
    onConfirm?: Function,
    onCancel?: Function,
    onDismiss?: Function
  ) {
    let modal = this.modalCtrl.create(
      ModelAlertPage,
      {
        primaryMessage: primaryMessage,
        secundaryMessage: secundaryMessage,
        onConfirm: onConfirm,
        onCancel: onCancel
      },
      { enableBackdropDismiss: true }
    );

    modal.onDidDismiss(data => {
      if (onDismiss) {
        onDismiss();
      }
    });

    modal.present();
  }
}
