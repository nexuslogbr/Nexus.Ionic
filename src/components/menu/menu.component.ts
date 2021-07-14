import { Component } from '@angular/core';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NavController, App, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import { HistoricoChassiPage } from '../../pages/historico-chassi/historico-chassi';
import { CarregamentoExportPage } from '../../pages/carregamento-export/carregamento-export';
import * as $ from 'jquery';

@Component({
  selector: 'component-menu',
  templateUrl: 'menu.component.html'
})
export class MenuComponent {

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    //private nativePageTransitions: NativePageTransitions,
    public authService: AuthService
  ) {

  }
  ionViewDidEnter() {
    // var dragButton = document.getElementById('dragButton');
  }
  navigateToRecebimentoPage(){

    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    //  };

    //  this.nativePageTransitions.slide(options);
     this.navCtrl.setRoot(RecebimentoPage);
  }
  navigateToParqueamentoPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    //  };

    //  this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(ParqueamentoPage);
  }
  navigateToCarregamentoPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    //  };

    //  this.nativePageTransitions.slide(options);
     this.navCtrl.setRoot(CarregamentoPage);
  }
  navigateToMovimentacaoPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    //  };

    //  this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(MovimentacaoPage);
  }
  navigateToRomaneioPage(){

    this.authService.limparRomaneio();

    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    //  };

    //  this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(RomaneioPage);
  }
  navigateToReceberParquearPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(ReceberParquearPage);

  }
  navigateToCarregamentoExportPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(CarregamentoExportPage);

  }
  historicoChassiPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(HistoricoChassiPage);
  }
  navigateToRechegoPage(){
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(HistoricoChassiPage);
  }
}
