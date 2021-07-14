import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-nova-conferencia-veiculos-pendentes',
  templateUrl: 'nova-conferencia-veiculos-pendentes.html',
})
export class NovaConferenciaVeiculosPendentesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaVeiculosPendentesPage');
  }

}
