import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-modal-confirmacao',
  templateUrl: 'modal-confirmacao.html'
})
export class ModalConfirmacaoPage {
  message: string;
  messageTitle: string;
  iconClass: string;

  constructor(
    private navParam: NavParams,
    public authService: AuthService,
    private view: ViewController
  ) {
    this.message = this.navParam.data.message;
    this.messageTitle = 'Atenção!';
    this.iconClass = 'icon-sucesso';
  }

  ionViewWillLoad() {
    console.log('ionViewWillLoad ModalConfirmacaoPage');
  }

  closeModal() {
    this.view.dismiss({ confirmado: false });
  }

  confirmar() {
    this.view.dismiss({ confirmado: true });
  }

  cancelar() {
    this.view.dismiss({ confirmado: false });
  }
}
