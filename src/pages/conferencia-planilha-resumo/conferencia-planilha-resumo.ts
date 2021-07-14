import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  Modal
} from 'ionic-angular';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import * as $ from 'jquery';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ConferenciaConfiguracaoStorageProvider } from '../../providers/storage/conferencia-configuracao-storage-provider';
import { Arquivo } from '../../model/arquivo';
import { ConferenciaChassiResumo } from '../../model/conferencia-chassi-resumo';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ConferenciaPlanilhaExecucaoPage } from '../conferencia-planilha-execucao/conferencia-planilha-execucao';
import { ArquivoStorageProvider } from '../../providers/storage/arquivo-storage-provider';
import { ModalConfirmacaoPage } from '../modal-confirmacao/modal-confirmacao';
import { ArquivoDataService } from '../../providers/arquivo-data-service';

@Component({
  selector: 'page-conferencia-planilha-resumo',
  templateUrl: 'conferencia-planilha-resumo.html'
})
export class ConferenciaPlanilhaResumoPage {
  planilha: Arquivo;
  conferencias: Array<ConferenciaChassiResumo> = [];
  isOnline: boolean;
  titulo: string;
  disponivelOffline: boolean = false;

  constructor(
    public arquivoDataService: ArquivoDataService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public conferenciaDataService: ConferenciaDataService,
    public authService: AuthService,
    public arquivoStorageProvider: ArquivoStorageProvider,
    public modal: ModalController,
    public conferenciaConfiguracaoStorageProvider: ConferenciaConfiguracaoStorageProvider
  ) {
    console.log('navParams', navParams);
    this.isOnline = navParams.data.isOnline;
    this.planilha = navParams.data.planilha;
    if (this.isOnline) {
      this.titulo = 'ONLINE/RESUMO';
    } else {
      this.titulo = 'OFFLINE/RESUMO';
    }
  }

  async verificaSeDisponvielOnline() {
    if (!this.isOnline) {
      const ids = await this.arquivoStorageProvider.getArquivoIds(
        this.authService.getUserData().id
      );
      this.disponivelOffline =
        ids.find(id => id == this.navParams.data.planilha.id) != null;
    }
  }

  async ionViewDidEnter() {
    console.log('ionViewDidEnter ConferenciaPlanilhaResumoPage');


    await this.verificaSeDisponvielOnline();

    if (!this.isOnline && this.disponivelOffline) {
      this.arquivoStorageProvider
        .getArquivo(
          this.navParams.data.planilha.id,
          this.authService.getUserData().id
        )
        .then((arquivo: Arquivo) => {
          console.log('arquivo off', arquivo.resumos);
          this.planilha = arquivo;
          this.conferencias = arquivo.resumos;
        })
        .catch(error => console.error(error));
    } else {
      this.planilha = this.navParams.data.planilha;
      this.authService.showLoading();
      this.conferenciaDataService
        .listarConferenciaChassiResumo(this.navParams.data.planilha.id)
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
    this.navCtrl.push(ConferenciaPlanilhaExecucaoPage, {
      isOnline: this.isOnline,
      planilha: this.planilha
    });
  }

  download() {
    this.authService.showLoading();

    this.conferenciaDataService
      .carregarPlanilha(this.planilha.id, true)
      .subscribe(
        res => {
          if (res.sucesso) {
            this.planilha = res.retorno;

            this.arquivoStorageProvider
              .persistArquivo(res.retorno, this.authService.getUserData().id)
              .then(retornoPersistencia => {
                console.log('retornoPersistencia', retornoPersistencia);
                this.disponivelOffline = true;
                this.authService.hideLoading();
              })
              .catch(error => {
                console.error(error);
                this.authService.hideLoading();
              });
          } else {
            console.error(res.mensagem);
            this.authService.hideLoading();
          }
        },
        error => {
          console.error(error);
          this.authService.hideLoading();
        }
      );
  }

  openModalSucesso(mensagem: string) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: {
        message: mensagem,
        iconClass: 'icon-load-export'
      }
    });
    chassiModal.present();

    //chassiModal.onDidDismiss(data => {});
    //chassiModal.onWillDismiss(data => { });
  }

  finalizar() {
    const chassiModal: Modal = this.modal.create(ModalConfirmacaoPage, {
      message: 'Confirma a finalização?'
    });
    chassiModal.present();
    chassiModal.onWillDismiss(data => {
      if (data.confirmado) {
        this.authService.showLoading();
        this.arquivoDataService
          .finalizarConferencia(this.planilha.id)
          .subscribe(
            res => {
              this.authService.hideLoading();
              if (res.sucesso) {
                this.navCtrl.pop();
              }
            },
            err => {
              console.error(err);
              this.authService.hideLoading();
              this.openModalError(err);
            }
          );
      }
    });
  }

  openModalError(mensagem: string) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: {
        message: mensagem,
        iconClass: 'icon-load-export'
      }
    });
    chassiModal.present();
  }
}
