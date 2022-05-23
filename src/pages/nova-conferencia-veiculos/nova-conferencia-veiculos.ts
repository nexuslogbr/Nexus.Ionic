import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import * as $ from 'jquery';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { ConferenciaConfiguracaoADO } from '../../providers/database/conferencia-configuracao-ado';
import { Veiculo } from '../../model/veiculo';
import { Local } from '../../model/local';
import { AlertService } from '../../providers/alert-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NovaConferenciaJustificativaPage } from '../nova-conferencia-justificativa/nova-conferencia-justificativa';
import { Pagination } from '../../model/pagination';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-nova-conferencia-veiculos',
  templateUrl: 'nova-conferencia-veiculos.html',
})
export class NovaConferenciaVeiculosPage {
  @ViewChild('pageTop') pageTop: Content;

  slideLeftSelected: boolean = true;
  slideCenterSelected: boolean = false;
  slideRightSelected: boolean = false;
  forceRefresh: boolean = false;

  public configuracao: ConferenciaConfiguracao;
  public veiculos: Array<Veiculo>;

  public filtroChassi: string = '';
  public destino: Local = null;
  public destinos: Array<Local>;
  public fechamento: boolean = false;
  public resetarSelecao: boolean = false;
  public totalVeiculos: number = 0;
  public totalConferidos: number = 0;
  canGoBack: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public alertService: AlertService,
    public ado: ConferenciaConfiguracaoADO
  ) {
    this.fechamento = navParams.data.fechamento;
    this.configuracao = navParams.data.configuracao;
    this.destinos = navParams.data.destinos;
    this.ado.alterarStatusSelecaoVeiculo(false, this.configuracao.id);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter NovaConferenciaVeiculosPage');
    this.atualizarContadores();
  }

  atualizarContadores() {
    this.ado
      .loadVeiculosPaginado(
        this.configuracao.id,
        new Pagination(),
        this.destino ? this.destino.id : null
      )
      .subscribe((res) => {
        this.totalVeiculos = res.totalRecords;
      });

    this.ado
      .loadVeiculosPaginado(
        this.configuracao.id,
        new Pagination(),
        this.destino ? this.destino.id : null,
        null,
        true
      )
      .subscribe((res) => {
        this.totalConferidos = res.totalRecords;
      });
  }

  changeSlideToLeft() {
    this.slideLeftSelected = true;
    this.slideCenterSelected = false;
    this.slideRightSelected = false;
  }

  changeSlideToCenter() {
    this.slideLeftSelected = false;
    this.slideCenterSelected = true;
    this.slideRightSelected = false;
  }

  changeSlideToRight() {
    this.slideLeftSelected = false;
    this.slideCenterSelected = false;
    this.slideRightSelected = true;
  }

  onDestinoChange(destinoId: number) {
    if (destinoId > 0) {
      this.destino = this.destinos.find((d) => d.id == destinoId);
      //this.carregarVeiculos();
    } else {
      this.destino = null;
      //this.carregarTodosVeiculos();
    }
    this.atualizarContadores();
  }

  onChassiScannedChanged(chassi) {
    if (chassi && chassi.length) {
      this.changeBackBehavior(true);
      this.onChassiChanged(chassi);
    }
  }

  onChassiChanged(chassi) {
    this.filtroChassi = chassi;
  }

  limparFiltro() {
    this.filtroChassi = '';
  }

  justificar() {
    this.ado
      .loadVeiculosPaginado(
        this.configuracao.id,
        new Pagination<Veiculo>(),
        null,
        null,
        this.slideLeftSelected,
        true
      )
      .subscribe((pagination) => {
        if (pagination.totalRecords) {
          this.navCtrl.push(NovaConferenciaJustificativaPage, {
            configuracao: this.configuracao,
            somenteConferidos: this.slideLeftSelected,
            callback: (justificado) => {
              if (justificado) {
                this.authService.showLoadingWhite();
                this.ado
                  .alterarStatusSelecaoVeiculo(false, this.configuracao.id)
                  .pipe(
                    finalize(() => {
                      this.authService.hideLoadingWhite();
                    })
                  )
                  .subscribe((res) => {
                    this.forceRefresh = !this.forceRefresh;
                  });
              }
            },
          });
        } else {
          this.alertService.showError('Selecione um ou mais chassis!');
        }
      });
  }

  showErrorAlert(message: string) {
    this.alertService.showError(message, null, () => {
      this.navCtrl.pop();
    });
  }

  showInfoAlert(message: string) {
    this.alertService.showInfo(message);
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

  ionViewCanLeave() {
    if (!this.canGoBack) {
      this.canGoBack = !this.canGoBack;
      return false;
    }

    return true;
  }

  changeBackBehavior(value: boolean) {
    this.canGoBack = value;
  }
}
