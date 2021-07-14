import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';

@Component({
  selector: 'page-recebimento-information',
  templateUrl: 'recebimento-information.html',
})
export class RecebimentoInformationPage {
  title: string;
  qrCode: string;
  local: string;
  listarLayout: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.title = 'Recebimento';
    console.log('RecebimentoInformationPage');

  }
  ionViewDidEnter() {
    
    console.log('RecebimentoInformationPage');
  }

  ArmazenamentoPosicao(){

  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
  }
}
// window.onload = () => {
//   // this.authService.showLoading();
//   // this.url = "/Parquear/ListarLayouts?token="+ this.authService.getToken();
//   this.url = "/Parquear/ListarLayouts?token="+ this.token;

//   this.authService.ParquearListarLayouts( this.url ).then((resultado)=>{  

//     this.listarLayout = resultado;
//     console.log(this.listarLayout);
//   }, (error) =>{
//     alert(error);
//     this.authService.hideLoading();
//     // this.authService.showError(this.responseData.mensagem);
//       alert(this.responseData.mensagem);
//       console.log(this.responseData.mensagem);
//   });
// };
