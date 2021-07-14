import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-error',
  templateUrl: 'modal-error.html'
})
export class ModalErrorComponent {

  message: string;
  messageTitle: string;
  iconClass: string;

  constructor(private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    this.message = "";
    this.messageTitle = "Erro!";
    this.iconClass = "icon-error";
  }

  ionViewDidEnter() {

  }

  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.message = data;
  }

  closeModal(){
    this.view.dismiss();
  }

}
