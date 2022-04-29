import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';
import { QualidadeDashboardBuscaAvariasPage } from '../qualidade-dashboard-busca-avarias/qualidade-dashboard-busca-avarias';
import { BuscarAvariasPage } from '../buscar-avarias/buscar-avarias';
import { LancamentoAvariaPage } from '../lancamento-avaria/lancamento-avaria';

@Component({
  selector: 'page-qualidade-menu',
  templateUrl: 'qualidade-menu.html',
})
export class QualidadeMenuPage {

  userData: any;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  //naviteTransitionOptions: NativeTransitionOptions;

  constructor(public navCtrl: NavController,
    public authService: AuthService,
    public alertService: AlertService,
    //private nativePageTransitions: NativePageTransitions,
    public navParams: NavParams) {
    this.userData = this.authService.getUserData();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualidadeMenuPage');
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  voltar() {
    this.navCtrl.pop();
  }


  navigateToDashboard() {
    this.navCtrl.push(QualidadeDashboardBuscaAvariasPage);
  }

  navigateToBuscar() {
    this.navCtrl.push(BuscarAvariasPage);
  }

  navigateToLancar() {
    this.navCtrl.push(LancamentoAvariaPage);
  }
}
