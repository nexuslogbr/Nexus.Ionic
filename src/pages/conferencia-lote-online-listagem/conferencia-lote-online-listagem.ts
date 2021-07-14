import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Modal, ModalController } from 'ionic-angular';
import { Navio } from '../../model/navio';
import * as $ from 'jquery';
import { AuthService } from '../../providers/auth-service/auth-service';
import { finalize } from 'rxjs/operators';
import { ConferenciaNavioLoteDataService } from '../../providers/conferencia-navio-lote-data-service';
import { ConferenciaNavioLote } from '../../model/conferencia-navio-lote';
import { ConferenciaDestinoPage } from '../conferencia-destino/conferencia-destino';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NavioDataService } from '../../providers/navio-data-service';
import { ConferenciaLoteResumoPage } from '../conferencia-lote-resumo/conferencia-lote-resumo';
import { NavioStorageProvider } from '../../providers/storage/navio-storage-provider';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaConfiguracaoStorageProvider } from '../../providers/storage/conferencia-configuracao-storage-provider';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';

@Component({
  selector: 'page-conferencia-listagem',
  templateUrl: 'conferencia-lote-online-listagem.html'
})
export class ConferenciaLoteOnlineListagemPage {
  public navio: Navio;
  public isOnline: boolean;
  public disponivelOffline: boolean = false;
  public titulo: string;
  public conferencias: Array<ConferenciaNavioLote>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public conferenciaNavioLoteDataService: ConferenciaNavioLoteDataService,
    public navioDataService: NavioDataService,
    public conferenciaDataService: ConferenciaDataService,
    public navioStorageProvider: NavioStorageProvider,
    public conferenciaConfiguracaoStorageProvider: ConferenciaConfiguracaoStorageProvider,
    public alertCtrl: AlertController,
    public modal: ModalController
  ) {
    this.navio = this.navParams.data.navio;
    this.isOnline = this.navParams.data.isOnline;
    this.titulo = 'CONFERÊNCIAS ' + (this.isOnline? 'ONLINE': 'OFFLINE') ;

    if (!this.isOnline) {
      this.navioStorageProvider
        .getNavio(this.navio.id, this.authService.getUserData().id)
        .then(res => {
          console.log('getNavio', res);
          if (res) {
            this.navio = res;
            this.disponivelOffline = true;
          }
        });
    }
    console.log(this.navParams);
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad ConferenciaLoteOnlineListagemPage');

    if (this.isOnline) {
      this.authService.showLoading();
      forkJoin([
        this.navioDataService.carregarNavioOperacoes(
          this.navParams.data.navio.id
        ),
        this.conferenciaNavioLoteDataService.listarLotes(this.navio.id)
      ])
        .pipe(
          finalize(() => {
            this.authService.hideLoading();
          })
        )
        .subscribe(
          arrayResult => {
            let operacoesResult = arrayResult[0];
            let lotesResult = arrayResult[1];

            console.log('operacoesResult', operacoesResult);
            if (operacoesResult.sucesso) {
              this.navio.operacoes = operacoesResult.retorno;
            } else {
              console.error(operacoesResult.mensagem);
              this.showError();
            }

            console.log('lotesResult', lotesResult);
            if (lotesResult.sucesso) {
              this.conferencias = lotesResult.retorno;
            } else {
              console.error(lotesResult.mensagem);
              this.showError();
            }
          },
          error => {
            console.log('error', error);
            console.error(error);
            this.showError();
          }
        );
    }
  }

  showError() {
    this.alertCtrl
      .create({
        title: 'Atenção',
        subTitle: 'Erro de comunicação',
        message: 'Ocorreu um erro ao carregar os dados!',
        buttons: ['Continuar']
      })
      .present();
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

  novaConferencia() {
    this.navCtrl.push(ConferenciaDestinoPage, {
      isOnline: this.isOnline,
      navio: this.navio
    });
  }

  continuar(conferencia: ConferenciaNavioLote) {
    if (conferencia.finalizada) {
      this.navCtrl.push(ConferenciaLoteResumoPage, {
        isOnline: this.isOnline,
        navio: this.navio,
        conferenciaNavioLote: conferencia
      });
    } else {
      this.navCtrl.push(ConferenciaDestinoPage, {
        isOnline: this.isOnline,
        navio: this.navio,
        conferenciaNavioLote: conferencia
      });
    }
  }

  finalizar() {
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Confirma a finalização de todas as conferências?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.fecharNavioConferencia();
          }
        }
      ]
    });
    alert.present();
  }

  public reabrir() {
    this.authService.showLoading();
    this.navioDataService
      .reabrirConferencia(this.navio.id)
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        res => {
          if (res.sucesso) {
            this.navCtrl.pop();
          } else {
            this.showError();
          }
        },
        err => {
          console.error(err);
          this.showError();
        }
      );
  }

  public dataFormatada(dateString: string) {
    let date = new Date(dateString);
    let dia = date.getDate().toString();
    let mes = (date.getMonth() + 1).toString();

    dia = dia.length == 1 ? '0' + dia : dia;
    mes = mes.length == 1 ? '0' + mes : mes;

    return `${dia}/${mes}`;
  }

  fecharNavioConferencia() {
    this.authService.showLoading();
    this.navioDataService
      .finalizarConferencia(this.navio.id)
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        res => {
          if (res.sucesso) {
            this.navCtrl.pop();
          } else {
            this.showError();
          }
        },
        err => {
          console.error(err);
          this.showError();
        }
      );
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
}
