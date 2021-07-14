import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-nova-conferencia-veiculos-todos',
  templateUrl: 'nova-conferencia-veiculos-todos.html',
})
export class NovaConferenciaVeiculosTodosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaVeiculosTodosPage');
  }

}
