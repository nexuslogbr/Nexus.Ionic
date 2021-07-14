import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { Navio } from '../../model/navio';
import { ConferenciaNavioResumoPage } from '../conferencia-navio-resumo/conferencia-navio-resumo';

@Component({
  selector: 'page-conferencia-navio-selecao',
  templateUrl: 'conferencia-navio-selecao.html'
})
export class ConferenciaNavioSelecaoPage {
  modoOperacao: string;
  title: string = '';
  navio: Navio;
  navios: Navio[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.modoOperacao = navParams.data.modoOperacao;

    if (this.modoOperacao === 'online') {
      this.title = 'Online';
    } else {
      this.title = 'Offline';
    }

    // this.navios = [];
    // this.navios.push(new Navio());
    // this.navios.push(new Navio());
    // this.navios.push(new Navio());
    // {
    //   this.navios[0].id = 1;
    //   this.navios[0].nome = 'Navio 01';
    //   this.navios[0].viagem = 'Viagem 01';
    // }
    // {
    //   this.navios[1].id = 2;
    //   this.navios[1].nome = 'Navio 02';
    //   this.navios[1].viagem = 'Viagem 02';
    // }
    // {
    //   this.navios[2].id = 3;
    //   this.navios[2].nome = 'Navio 03';
    //   this.navios[2].viagem = 'Viagem 03';
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaNavioSelecaoPage');
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

  continuar() {
    this.navCtrl.push(ConferenciaNavioResumoPage, {
      modoOperacao: this.modoOperacao,
      navio: this.navio
    });
  }

  setNavio(navio) {
    this.navio = navio;
    console.log('navio', this.navio);
  }
}
