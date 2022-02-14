import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { NovaConferenciaConfiguracaoPage } from '../nova-conferencia-configuracao/nova-conferencia-configuracao';
import { NovaConferenciaListarConfiguracoesPage } from '../nova-conferencia-listar-configuracoes/nova-conferencia-listar-configuracoes';
import { NovaConferenciaListarConcluirPage } from '../nova-conferencia-listar-concluir/nova-conferencia-listar-concluir';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-nova-conferencia-menu',
  templateUrl: 'nova-conferencia-menu.html',
})
export class NovaConferenciaMenuPage {

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
    // this.naviteTransitionOptions = {
    //   direction: "up",
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaMenuPage');
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


  navigateToConfiguracao() {
    //this.nativePageTransitions.slide(this.naviteTransitionOptions);
    this.navCtrl.push(NovaConferenciaConfiguracaoPage);
  }

  navigateToRealizar() {
    //this.nativePageTransitions.slide(this.naviteTransitionOptions);
    this.navCtrl.push(NovaConferenciaListarConfiguracoesPage);
  }

  navigateToFinalizar() {
    //this.nativePageTransitions.slide(this.naviteTransitionOptions);
    this.navCtrl.push(NovaConferenciaListarConcluirPage);
  }

}
