import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  Modal,
  ModalController
} from 'ionic-angular';
import { Navio } from '../../model/navio';
import * as $ from 'jquery';
import { ConferenciaDestinoPage } from '../conferencia-destino/conferencia-destino';
import { NavioDataService } from '../../providers/navio-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavioStorageProvider } from '../../providers/storage/navio-storage-provider';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaConfiguracaoStorageProvider } from '../../providers/storage/conferencia-configuracao-storage-provider';
import { ModalConfirmacaoPage } from '../modal-confirmacao/modal-confirmacao';

@Component({
  selector: 'page-conferencia-navio-resumo',
  templateUrl: 'conferencia-navio-resumo.html'
})
export class ConferenciaNavioResumoPage {
  public navio: Navio;
  public isOnline: boolean;
  titulo: string;
  disponivelOffline: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public navioDataService: NavioDataService,
    public conferenciaDataService: ConferenciaDataService,
    public authService: AuthService,
    public navioStorageProvider: NavioStorageProvider,
    public modal: ModalController,
    public conferenciaConfiguracaoStorageProvider: ConferenciaConfiguracaoStorageProvider
  ) {
    console.log('navParams', navParams);
    this.navio = navParams.data.navio;
    this.isOnline = navParams.data.isOnline;
    if (this.isOnline) {
      this.titulo = 'ONLINE/RESUMO';
    } else {
      this.titulo = 'OFFLINE/RESUMO';
    }
  }

  async verificaSeDisponvielOnline() {
    if (!this.isOnline) {
      const ids = await this.navioStorageProvider.getNaviosIds(
        this.authService.getUserData().id
      );
      this.disponivelOffline =
        ids.find(id => id == this.navParams.data.navio.id) != null;
    }
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaNavioResumoPage');

    await this.verificaSeDisponvielOnline();

    if (!this.isOnline && this.disponivelOffline) {
      this.navioStorageProvider
        .getNavio(
          this.navParams.data.navio.id,
          this.authService.getUserData().id
        )
        .then((navio: Navio) => {
          this.navio = navio;
        })
        .catch(error => console.error(error));
    } else {
      // comentei aqui pois já tem de vir as operacoes populadas no navio da tela de seleção de lote de conferência...
      // this.authService.showLoading();
      // this.navioDataService
      //   .carregarNavioOperacoes(this.navParams.data.navio.id)
      //   .subscribe(
      //     res => {
      //       if (res.sucesso) {
      //         let navio = this.navParams.data.navio;
      //         navio.operacoes = res.retorno;
      //         this.navio = navio;
      //       } else {
      //         console.error('error', res.mensagem);
      //       }
      //     },
      //     error => {
      //       console.error('error', error);
      //     },
      //     () => {
      //       this.authService.hideLoading();
      //     }
      //   );
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
    this.navCtrl.push(ConferenciaDestinoPage, {
      isOnline: this.isOnline,
      navio: this.navio
    });
  }

  download() {
    this.authService.showLoading();
    this.navioDataService.carregarNavioComEscala(this.navio.id, true).subscribe(
      res => {
        console.log('navio-download', res);
        if (res.sucesso) {
          this.navio = res.retorno;
          this.navioStorageProvider
            .persistNavio(res.retorno, this.authService.getUserData().id)
            .then(retornoPersistenciaNavio => {
              this.conferenciaDataService.carregarConfiguracoes().subscribe(
                configRes => {
                  if (configRes.sucesso) {
                    this.conferenciaConfiguracaoStorageProvider
                      .persistConfiguracao(
                        configRes.retorno,
                        this.authService.getUserData().id
                      )
                      .then(() => {
                        this.openModalSucesso('Download realizado');
                        this.disponivelOffline = true;
                        this.authService.hideLoading();
                      })
                      .catch(error => {
                        console.error(error);
                        this.authService.hideLoading();
                      });
                  } else {
                    console.error(configRes.message);
                    this.authService.hideLoading();
                  }
                },
                error => {
                  console.error(error);
                  this.authService.hideLoading();
                }
              );
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
      },
      () => {
        //this.authService.hideLoading();
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
  }

  finalizar() {
    this.navioDataService.carregarTotais(this.navio.id).subscribe(res => {
      if (res.sucesso) {
        let totais = res.retorno;

        const chassiModal: Modal = this.modal.create(ModalConfirmacaoPage, {
          message:
            totais.totalVeiculos != totais.totalConferidos
              ? 'Ainda há veículos pendentes de conferência. Confirma a finalização?'
              : 'Confirma a finalização?'
        });
        chassiModal.present();
        chassiModal.onWillDismiss(data => {
          if (data.confirmado) {
            this.authService.showLoading();
            this.navioDataService.finalizarConferencia(this.navio.id).subscribe(
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
      } else {
        console.error('error', res.mensagem);
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
