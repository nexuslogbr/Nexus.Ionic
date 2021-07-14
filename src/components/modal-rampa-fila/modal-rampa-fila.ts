import { Component } from '@angular/core';
import { NavController, ViewController  } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-rampa-fila',
  templateUrl: 'modal-rampa-fila.html'
})
export class ModalRampaFilaComponent {

  text: string;

  constructor(public authService: AuthService, public navCtrl: NavController, private view: ViewController) {
    console.log('Hello ModalRampaFilaComponent Component');
    this.text = 'Hello World';
  }

  addRampaFila(){
    this.authService.hideLoading();
    this.view.dismiss(); 
  }
  cancelar(){
    this.view.dismiss();
    this.navCtrl.push(HomePage);    
  }

}
