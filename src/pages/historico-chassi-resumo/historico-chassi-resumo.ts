import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HistoricoChassiPage } from '../../pages/historico-chassi/historico-chassi';
import * as $ from 'jquery';

@Component({
  selector: 'page-historico-chassi-resumo',
  templateUrl: 'historico-chassi-resumo.html',
})
export class HistoricoChassiResumoPage {
  formData = {
    chassi: '',
    modelo: '',
    local: '',
    lote: '',
  };

  title: string;
  qrCodeText: string;
  url: string;
  historicos: any[] = new Array();
  parqueamento: any[] = new Array();

  constructor(public navCtrl: NavController, public navParam: NavParams) {
    this.title = 'Histórico de Chassi';
  }

  ionViewDidLoad() {
    console.log('HistoricoChassiResumoPage');
    const data = this.navParam.get('data');
    console.log(data);

    if (data && data.length) {
      this.formData.chassi = data[0].chassi;
      this.formData.modelo = data[0].modelo;
      this.formData.local = data[0].local;
      this.formData.lote = data[0].lote;
    }

    this.historicos = data;
  }

  voltar() {
    this.navCtrl.push(HistoricoChassiPage);
    //this.navCtrl.pop();
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };
}
