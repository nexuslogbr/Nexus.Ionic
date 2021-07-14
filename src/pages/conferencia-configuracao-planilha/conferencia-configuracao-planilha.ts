import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { Navio } from '../../model/navio';
import { Arquivo } from '../../model/arquivo';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaChassiResumo } from '../../model/conferencia-chassi-resumo';
import { ArquivoDataService } from '../../providers/arquivo-data-service';

@Component({
  selector: 'page-conferencia-configuracao-planilha',
  templateUrl: 'conferencia-configuracao-planilha.html'
})
export class ConferenciaConfiguracaoPlanilhaPage {
  public navio: Navio;
  public arquivo: Arquivo;
  public conferencias: Array<ConferenciaChassiResumo>;
  public lotes: any[] = [];
  public onlyShow: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public conferenciaDataService: ConferenciaDataService,
    public arquivoDataService: ArquivoDataService
  ) {
    console.log('navParams', navParams);

    if (this.navParams.data.onlyShow) {
      this.onlyShow = true;
    }

    this.arquivo = this.navParams.data.arquivo;
    console.log(this.arquivo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaConfiguracaoPlanilhaPage');

    this.authService.showLoading();
    this.conferenciaDataService
      .listarConferenciaChassiResumo(this.navParams.data.arquivo.id)
      .subscribe(
        res => {
          if (res.sucesso) {
            this.conferencias = res.retorno;
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

  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  voltar() {
    this.navCtrl.pop();
  }

  disponibilizar() {
    this.authService.showLoading();
    this.conferenciaDataService
      .atualizarDisponibilidadeArquivoConferencia(this.arquivo.id, true)
      .subscribe(
        res => {
          if (res.sucesso) {
            //this.arquivo.disponivelConferencia = true;
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
    this.conferenciaDataService
      .atualizarDisponibilidadeArquivoConferencia(this.arquivo.id, false)
      .subscribe(
        res => {
          if (res.sucesso) {
            //this.arquivo.disponivelConferencia = false;
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
    this.arquivoDataService.liberarConferencia(this.arquivo.id).subscribe(
      res => {
        if (res.sucesso) {
          //this.arquivo.conferenciaFinalizada = false;
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
