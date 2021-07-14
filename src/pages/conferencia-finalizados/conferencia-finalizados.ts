import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Navio } from '../../model/navio';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavioDataService } from '../../providers/navio-data-service';
import * as $ from 'jquery';
import { Arquivo } from '../../model/arquivo';
import { ArquivoDataService } from '../../providers/arquivo-data-service';
import { ConferenciaConfiguracaoPlanilhaPage } from '../conferencia-configuracao-planilha/conferencia-configuracao-planilha';
import { ConferenciaLoteOnlineListagemPage } from '../conferencia-lote-online-listagem/conferencia-lote-online-listagem';

@Component({
  selector: 'page-conferencia-finalizados',
  templateUrl: 'conferencia-finalizados.html'
})
export class ConferenciaFinalizadosPage {
  navios: Navio[] = [];
  arquivos: Arquivo[] = [];
  showErrorMessage: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public navioDataService: NavioDataService,
    public arquivoDataService: ArquivoDataService
  ) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter ConferenciaFinalizadosPage');

    // this.authService.showLoading();

    // forkJoin([
    //   this.navioDataService.carregarNavios(false, false, true, true),
    //   this.arquivoDataService.carregarArquivosDePlanilhasConferencia(true)
    // ]).subscribe(
    //   arrayResult => {
    //     let navios$ = arrayResult[0];
    //     let arquivos$ = arrayResult[1];

    //     console.log('navios$', navios$);
    //     if (navios$.sucesso) {
    //       this.navios = navios$.retorno;
    //     } else {
    //       this.showErrorMessage = true;
    //     }

    //     if (arquivos$.sucesso) {
    //       this.arquivos = arquivos$.retorno;
    //     } else {
    //       this.showErrorMessage = true;
    //     }
    //   },
    //   error => {
    //     console.log('error', error);
    //     this.showErrorMessage = true;
    //   },
    //   () => {
    //     this.authService.hideLoading();
    //   }
    // );
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

  continuar(navio: Navio) {
    // this.navCtrl.push(ConferenciaConfiguracaoResumoPage, {
    //   navio: navio,
    //   onlyShow: true
    // });
    this.navCtrl.push(ConferenciaLoteOnlineListagemPage,  {
      navio: navio,
      isOnline: true
    })

  }

  continuarArquivo(arquivo: Arquivo) {
    this.navCtrl.push(ConferenciaConfiguracaoPlanilhaPage, {
      arquivo: arquivo,
      onlyShow: true
    });
  }
}
