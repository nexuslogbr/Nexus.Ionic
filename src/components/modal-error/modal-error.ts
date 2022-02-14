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

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    this.message = "";
    this.messageTitle = "Erro!";
    this.iconClass = "icon-error";

    if (localStorage.getItem('tema') == "Cinza" || !localStorage.getItem('tema')) {
      this.primaryColor = '#595959';
      this.secondaryColor = '#484848';
      this.inputColor = '#595959';
      this.buttonColor = "#595959";
    } else {
      this.primaryColor = '#06273f';
      this.secondaryColor = '#00141b';
      this.inputColor = '#06273f';
      this.buttonColor = "#1c6381";
    }
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
