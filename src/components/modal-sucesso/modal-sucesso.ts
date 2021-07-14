import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-sucesso',
  templateUrl: 'modal-sucesso.html'
})
export class ModalSucessoComponent {

  message: string;
  messageTitle: string;
  iconClass: string;

  constructor(public navCtrl: NavController, private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    this.message = "";
    this.messageTitle = "Sucesso!";
    this.iconClass = '';
    console.log('ModalSucessoComponent');
  }
  ionViewDidEnter() {

  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.message = data.message;
    this.iconClass = data.iconClass;
  }
  closeModal(){
    this.view.dismiss();
  }
}
