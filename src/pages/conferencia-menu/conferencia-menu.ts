import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { ConferenciaConfiguracaoNavioPage } from '../conferencia-configuracao-navio/conferencia-configuracao-navio';
import { ConferenciaNavioPage } from '../conferencia-navio/conferencia-navio';
import { ConferenciaFinalizadosPage } from '../conferencia-finalizados/conferencia-finalizados';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-conferencia-menu',
  templateUrl: 'conferencia-menu.html'
})
export class ConferenciaMenuPage {

  userData: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
      this.userData = this.authService.getUserData();
      console.log('userData', this.userData);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaMenuPage');
  }

  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  voltar() {
    this.navCtrl.pop();
  }

  navigateToConferenciaConfiguracaoNavioPage() {
    this.navCtrl.push(ConferenciaConfiguracaoNavioPage);
  }

  navigateToConferenciaNavioSelecaoOnlinePage() {
    this.navCtrl.push(ConferenciaNavioPage, { isOnline: true });
  }

  navigateToConferenciaNavioSelecaoOfflinePage() {
    this.navCtrl.push(ConferenciaNavioPage, { isOnline: false });
  }

  navigateToConferenciaFinalizadosPage() {
    this.navCtrl.push(ConferenciaFinalizadosPage);
  }

}
