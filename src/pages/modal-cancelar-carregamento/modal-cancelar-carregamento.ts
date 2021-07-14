import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-cancelar-carregamento',
  templateUrl: 'modal-cancelar-carregamento.html',
})
export class ModalCancelarCarregamentoPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalCancelarCarregamentoPage');
  }

  public fecharModal() {
    this.view.dismiss({ cancelar: false });
  }

  public cancelarChassi() {
    this.view.dismiss({ cancelar: true });
  }

}
