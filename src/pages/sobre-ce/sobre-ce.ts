import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuCePage } from '../../pages/menu-ce/menu-ce';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-sobre-ce',
  templateUrl: 'sobre-ce.html',
})
export class SobreCePage {
  title: string;
  img: string;  

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams) {
    this.title = "Sobre";
    this.img = "../assets/images/icon-callidus.png";   
  }
  ionViewDidEnter() {
    
    console.log('ionViewDidLoad SobrePage');
  }
  homePage(){
    this.navCtrl.push(MenuCePage);
  } 
}
