import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
// import {
//   NativePageTransitions,
//   NativeTransitionOptions
// } from '@ionic-native/native-page-transitions';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { SobrePage } from '../../pages/sobre/sobre';
import { Flashlight } from '@ionic-native/flashlight';
import * as $ from 'jquery';
import { DashboardVagasPage } from '../../pages/dashboard-vagas/dashboard-vagas';
import { DispositivoRemoverConfirmacaoPage } from '../../pages/dispositivo-remover-confirmacao/dispositivo-remover-confirmacao';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {
  data: any;
  usuario: string = '';
  email: string = '';
  localNome: string = '';
  url: string = '';
  loginData: any;
  flashLightText: string;
  userData: any;

  // nativeTransitionOptions: NativeTransitionOptions = {
  //   direction: 'up',
  //   duration: 500,
  //   slowdownfactor: 3,
  //   slidePixels: 20,
  //   iosdelay: 100,
  //   androiddelay: 150,
  //   fixedPixelsTop: 0,
  //   fixedPixelsBottom: 60
  // };

  //
  constructor(
    public navCtrl: NavController,
    //private nativePageTransitions: NativePageTransitions,
    private flashlight: Flashlight,
    public storage: Storage,
    public authService: AuthService,
    public viewCtrl: ViewController
  ) {
    this.getData();
    this.flashLightText = 'Lanterna';
    this.userData = this.authService.getUserData();
  }

  ionViewDidEnter() {}

  getData() {
    setTimeout(() => {
      this.usuario = this.authService.getUserData().nome;
      this.email = this.authService.getUserData().email;
      this.localNome = this.authService.getUserData().localNome;
      this.url = this.authService.nomeConexao();
    }, 1000);
  }

  navigateToHomePage() {
    this.authService.setFila('');
    //this.nativePageTransitions.slide(this.nativeTransitionOptions);
    this.navCtrl.setRoot(HomePage);
  }

  Dashboard() {
    //this.nativePageTransitions.slide(this.nativeTransitionOptions);
    this.navCtrl.setRoot(DashboardPage);
  }

  Logout() {
    this.authService.removeSession().then(res => {
      //this.nativePageTransitions.slide(this.nativeTransitionOptions);
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.push(LoginPage);
    });
  }

  removeDevice() {
    this.navCtrl.push(DispositivoRemoverConfirmacaoPage);
  }

  about() {
    //this.nativePageTransitions.slide(this.nativeTransitionOptions);
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(SobrePage);
  }
  turnOnFlashLight() {
    this.flashlight.toggle();

    $('.menu-body').removeClass('show-menu');
    $('menu-inner').removeClass('show');
    $('.icon-menu').removeClass('close-menu');
    $('side-menu').removeClass('show');
  }

  statusDeBolsao() {
    //this.nativePageTransitions.slide(this.nativeTransitionOptions);
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(DashboardVagasPage);
  }

  toglleTheme(event){

  }
}
