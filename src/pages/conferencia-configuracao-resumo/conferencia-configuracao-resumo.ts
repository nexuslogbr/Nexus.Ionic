import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Navio } from '../../model/navio';
import * as $ from 'jquery';
import { NavioDataService } from '../../providers/navio-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-conferencia-configuracao-resumo',
  templateUrl: 'conferencia-configuracao-resumo.html'
})
export class ConferenciaConfiguracaoResumoPage {
  public navio: Navio;
  public lotes: any[] = [];
  public onlyShow: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navioDataService: NavioDataService,
    public authService: AuthService,
  ) {
    console.log('navParams', navParams);

    if (this.navParams.data.onlyShow) {
      this.onlyShow = true;
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaConfiguracaoResumoPage');

    this.authService.showLoading();
    this.navioDataService.carregarNavioOperacoes(this.navParams.data.navio.id).subscribe(
      res => {
        if (res.sucesso) {
          let navio = this.navParams.data.navio;
          navio.operacoes = res.retorno;
          this.navio = navio;
          console.log('res.retorno', res.retorno);
          console.log('this.navio.operacoes', this.navio.operacoes);
        } else {
          console.log('error', res.mensagem);
        }
        this.authService.hideLoading();
      },
      error => {
        console.log('error', error);
        this.authService.hideLoading();
      }
    );
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

  continuar() {
    this.navCtrl.push(ConferenciaConfiguracaoResumoPage);
  }

  toggleSection(index) {
    this.lotes[index].opened = !this.lotes[index].opened;
  }

  disponibilizar() {
    this.authService.showLoading();
    this.navioDataService
      .atualizarDisponibilidadeConferencia(this.navio.id, true)
      .subscribe(
        res => {
          if (res.sucesso) {
            //this.navio.disponivelConferencia = true;
          }
          this.authService.hideLoading();
        },
        error => {
          console.log('error', error);
          this.authService.hideLoading();
        }
      );
  }

  remover() {
    this.authService.showLoading();
    this.navioDataService
      .atualizarDisponibilidadeConferencia(this.navio.id, false)
      .subscribe(
        res => {
          if (res.sucesso) {
            //this.navio.disponivelConferencia = false;
          }
          this.authService.hideLoading();
        },
        error => {
          console.log('error', error);
          this.authService.hideLoading();
        }
      );
  }

  liberar() {
    this.authService.showLoading();
    this.navioDataService
      .liberarConferencia(this.navio.id)
      .subscribe(
        res => {
          if (res.sucesso) {
            //this.navio.conferenciaFinalizada = false;
          }
          this.authService.hideLoading();
        },
        error => {
          console.log('error', error);
          this.authService.hideLoading();
        }
      );
  }
}
