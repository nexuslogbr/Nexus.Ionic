import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'substituir-chassi',
  templateUrl: 'substituir-chassi.html'
})
export class SubstituirChassiComponent {

  text: string;

  constructor(private view: ViewController, public navCtrl: NavController, public authService: AuthService) {
    console.log('SubstituirChassiComponent');
  }
  closeModal(){
    const data = {}
    this.view.dismiss(data);
    // this.navCtrl.push(RecebimentoPage);
  }
  ionViewDidEnter() {

  }
}
