import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { finalize } from 'rxjs/operators';
import * as $ from 'jquery';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaConfiguracaoADO } from '../../providers/database/conferencia-configuracao-ado';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { NovaConferenciaExecucaoPage } from '../nova-conferencia-execucao/nova-conferencia-execucao';
import { Arquivo } from '../../model/arquivo';
import { Navio } from '../../model/navio';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-nova-conferencia-listar-finalizadas',
  templateUrl: 'nova-conferencia-listar-finalizadas.html',
})
export class NovaConferenciaListarFinalizadasPage {

  @ViewChild(Slides) slides: Slides;
  slideLeftSelected: boolean = true;
  configuracoes: ConferenciaConfiguracao[] = [];
  arquivo: Arquivo;
  navio: Navio;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public alertService: AlertService,
    public conferenciaDataService: ConferenciaDataService,
    public conferenciaConfiguracaoADO: ConferenciaConfiguracaoADO
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
    this.navio = navParams.data.navio;
    this.arquivo = navParams.data.arquivo;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter NovaConferenciaListarFinalizadasPage');

    this.authService.showLoadingWhite();

    //fechamento
    this.conferenciaDataService.listarConfiguracoesFechamento(this.navio ? this.navio.id : null, this.arquivo ? this.arquivo.id : null).pipe(
      finalize(() => {
        this.authService.hideLoadingWhite();
      })
    ).subscribe(
      result => {
        console.log('result', result);
        if (result.sucesso) {
          if (result.retorno && result.retorno.length) {
            this.configuracoes = result.retorno;
          }
        } else {
          this.showErrorAlert(result.mensagem);
        }
      },
      error => {
        console.log('error', error);
        this.showErrorAlert(error.message);
      },
      () => {
        this.authService.hideLoadingWhite();
      }
    );
  }

  changeSlideToLeft() {
    this.slides.slideTo(0, 500);
  }

  changeSlideToRight() {
    this.slides.slideTo(1, 500);
  }

  consultarConfiguracacao(configuracao) {

    this.authService.showLoadingWhite();
    this.conferenciaDataService
      .carregarConfiguracao(configuracao.id)
      .subscribe(
        res => {
          if (res.sucesso) {
            this.authService.hideLoadingWhite();
            var configuracao = res.retorno;
            if (configuracao.conferenciaOperacaoLotes && configuracao.conferenciaOperacaoLotes.length) {
              this.persisteConfiguracao(configuracao);
            } else {
              this.showErrorAlert('Nenhum lote encontrado para essa configuração!');
            }
          } else {
            this.authService.hideLoadingWhite();
            this.showErrorAlert(res.mensagem);
          }
        },
        err => {
          this.authService.hideLoadingWhite();
          this.showErrorAlert('Erro de comunicação ao servidor!');
        }
      );

  }

  persisteConfiguracao(configuracao: ConferenciaConfiguracao) {
    this.authService.showLoadingWhite();
    this.conferenciaConfiguracaoADO
      .dropConferenciaConfiguracao(configuracao.id)
      .subscribe(
        res => {
          this.conferenciaConfiguracaoADO
            .saveConferenciaConfiguracao2(configuracao)
            .subscribe(
              res => {
                this.authService.hideLoadingWhite();
                this.navCtrl.push(NovaConferenciaExecucaoPage, {
                  configuracao: configuracao, fechamento: true
                });
              },
              error => {
                this.authService.hideLoadingWhite();
                console.error(error);
                this.showErrorAlert('Erro ao persistir os dados no SQL local!');
              }
            );
        },
        error => {
          console.error(error);
          this.authService.hideLoadingWhite();
          this.showErrorAlert('Erro ao persistir os dados no SQL local!');
        }
      );
  }

  slideChanged() {
    this.slideLeftSelected = !this.slideLeftSelected;
  }

  showErrorAlert(message: string) {
    this.alertService.showError(message, null, () => { this.navCtrl.pop(); });
  }

  showSucessAlert(message: string) {
    this.alertService.showInfo(message);
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

}
