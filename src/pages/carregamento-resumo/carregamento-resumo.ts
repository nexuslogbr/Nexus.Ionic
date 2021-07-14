import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';

@Component({
  selector: 'page-carregamento-resumo',
  templateUrl: 'carregamento-resumo.html',
})
export class CarregamentoResumoPage {

  urlTipos: string;
  urlTransportadoras: string;  
  formData = {
    "romaneio":'',
    "fila" :"",
    "chassis":[
      {chassi: "01929872391823"},
      {chassi: "01929872391823"},
      {chassi: "01929872391823"},
      {chassi: "01929872391823"}
    ]
  };
  responseData: any;
  dataTransportadoras: any;
  title: string;
  transportadoras: any;
  qrCodeText: string;
  inputChassi: string;
  veiculos = new Array();
  veiculoTemp = {
    'chassi' : '',
    'modelo' : '',
    'nfe' : '',
    'posicao' : ''
  };
  url: string;
  url2: string;    

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.title = "Resumo Carregamento";
    console.log('CarregamentoResumoPage');

  }

  ionViewDidEnter() {
    
  }

  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }    

}
