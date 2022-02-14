import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { ConferenciaConfiguracaoResumoPage } from '../conferencia-configuracao-resumo/conferencia-configuracao-resumo';
import { Navio } from '../../model/navio';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavioDataService } from '../../providers/navio-data-service';
import { Arquivo } from '../../model/arquivo';
import { ArquivoDataService } from '../../providers/arquivo-data-service';
import { ConferenciaConfiguracaoPlanilhaPage } from '../conferencia-configuracao-planilha/conferencia-configuracao-planilha';

@Component({
  selector: 'page-conferencia-configuracao-navio',
  templateUrl: 'conferencia-configuracao-navio.html'
})
export class ConferenciaConfiguracaoNavioPage {
  navios: Navio[] = [];
  showErrorMessage: boolean = false;
  planilhas: Arquivo[] = [];
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public navioDataService: NavioDataService,
    public arquivoDataService: ArquivoDataService
  ) {

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaConfiguracaoNavioPage');

    // this.authService.showLoading();

    // this.navioDataService.carregarNavios(false, true, false, null).subscribe(
    //   res => {
    //     console.log('res', res);
    //     if (res.sucesso) {
    //       this.navios = res.retorno;

    //       // TODO: Carregar as planilha....
    //       this.arquivoDataService.carregarArquivosDePlanilhasConferencia().subscribe((resPlanilha) => {
    //         if (resPlanilha.sucesso) {
    //           this.planilhas = resPlanilha.retorno;
    //           this.authService.hideLoading();
    //         } else {
    //           console.error(resPlanilha.mensagem);
    //           this.showErrorMessage = true;
    //           this.authService.hideLoading();
    //         }
    //       }, (error) => {
    //         console.error(error);
    //         this.showErrorMessage = true;
    //         this.authService.hideLoading();
    //       });

    //     } else {
    //       console.log('error', res.mensagem);
    //       this.showErrorMessage = true;
    //       this.authService.hideLoading();
    //     }
    //   },
    //   error => {
    //     console.log('error', error);
    //     this.showErrorMessage = true;
    //     this.authService.hideLoading();
    //   }
    // );
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

  continuar(navio: Navio) {
    this.navCtrl.push(ConferenciaConfiguracaoResumoPage, { navio: navio });
  }

  continuarPlanilha(planilha: Arquivo) {
    this.navCtrl.push(ConferenciaConfiguracaoPlanilhaPage, {arquivo: planilha})
  }
}
