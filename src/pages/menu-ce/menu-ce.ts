import { Component } from '@angular/core';
import { IonicPage, NavController, App, ViewController } from 'ionic-angular';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { RomaneioCePage } from '../../pages/romaneio-ce/romaneio-ce';
import * as $ from 'jquery';
import { RomaneioPage } from '../romaneio/romaneio';

@Component({
  selector: 'page-menu-ce',
  templateUrl: 'menu-ce.html',
})
export class MenuCePage {

  title: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    //private nativePageTransitions: NativePageTransitions
    ) {

      this.title = "Sistema pátio automotivo";
      console.log('MenuCePage');
  }

  navigateToRomaneioPageCE(){
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
    this.navCtrl.setRoot(RomaneioPage);

  }

  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu-ce').toggleClass('show');
  }
}
