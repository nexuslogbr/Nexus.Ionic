import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-model-alert',
  templateUrl: 'model-alert.html',
})
export class ModelAlertPage implements OnInit {
  ngOnInit(): void {
    if (this.onConfirm == null && this.onCancel == null) {
      setTimeout(() => {
        this.viewCtrl.dismiss();
      }, 1000);
    }
  }

  public primaryMessage: string;
  public secundaryMessage: string;
  public onConfirm?: Function;
  public onCancel?: Function;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.primaryMessage = navParams.data.primaryMessage;

    if (navParams.data.secundaryMessage) {
      this.secundaryMessage = navParams.data.secundaryMessage;
    }

    if (navParams.data.onConfirm) {
      this.onConfirm = navParams.data.onConfirm;
    }

    if (navParams.data.onCancel) {
      this.onCancel = navParams.data.onCancel;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelAlertPage');
  }

  onConfirmClick() {
    this.viewCtrl.dismiss();
    this.onConfirm();
  }

  onCancelClick() {
    this.viewCtrl.dismiss();
    this.onCancel();
  }

  dismiss() {
    if (!this.onCancel && !this.onConfirm) {
      this.viewCtrl.dismiss();
    }
  }
}
