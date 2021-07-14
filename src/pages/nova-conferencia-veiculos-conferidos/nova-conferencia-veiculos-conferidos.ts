import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-nova-conferencia-veiculos-conferidos',
  templateUrl: 'nova-conferencia-veiculos-conferidos.html',
})
export class NovaConferenciaVeiculosConferidosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaVeiculosConferidosPage');
  }

}
