import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-modal-novo-lancamento-avaria',
  templateUrl: 'modal-novo-lancamento-avaria.html',
})
export class ModalNovoLancamentoAvariaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalNovoLancamentoAvariaPage');
  }

}
