import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'alert',
  templateUrl: 'alert.html'
})
export class AlertComponent {

  message: string;
  messageTitle: string;
  iconClass: string;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  constructor(public navCtrl: NavController, private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    this.message = "";
    this.messageTitle = "Sucesso!";
    this.iconClass = '';

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
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.message = data.message;
    this.iconClass = data.iconClass;
  }
  closeModal(){
    this.view.dismiss();
  } 
}
