import { Component, OnInit } from '@angular/core';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Momento } from '../../model/Momento';
import { Veiculo } from '../../model/veiculo';
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';

@Component({
  selector: 'page-model-lancar-avaria',
  templateUrl: 'model-lancar-avaria.html',
})
export class ModelLancarAvariaPage implements OnInit {

  public primaryMessage: string;
  public secundaryMessage: string;
  public onConfirm?: Function;
  public onCancel?: Function;

  formData = {
    veiculo: new Veiculo(),
    momento: new Momento()
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modal: ModalController,
    public viewCtrl: ViewController
  ) {
    this.primaryMessage = 'Chassi vistoriado';
    this.secundaryMessage = 'Lançar avaria?';

    this.formData = this.navParams.get('data');
  }

  ngOnInit(): void {
    // if (this.onConfirm == null && this.onCancel == null) {
    //   setTimeout(() => {
    //     this.viewCtrl.dismiss();
    //   }, 1000);
    // }
  }

  onConfirmAvariaClick() {
    this.viewCtrl.dismiss();

    const modal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage, {
      data: this.formData,
    });
    modal.present();

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
