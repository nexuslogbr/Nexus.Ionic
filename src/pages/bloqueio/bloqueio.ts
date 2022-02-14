import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { BloquearPage } from '../bloquear/bloquear';
import { DesbloquearPage } from '../desbloquear/desbloquear';

@Component({
  selector: 'page-bloqueio',
  templateUrl: 'bloqueio.html',
})
export class BloqueioPage {

  title: string;
  parametros: any;
  url: string;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams,public authService: AuthService) {
    this.title = "Bloqueio";
    
    this.url = this.authService.getUrl();

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

  ionViewDidEnter() {
 
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
    $('side-menu-ce').toggleClass('show');
  }

  bloquearVeiculo(){
    this.navCtrl.push(BloquearPage);
  }
  desbloquearVeiculo(){
    this.navCtrl.push(DesbloquearPage);
 }
 
}
