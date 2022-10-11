import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  Modal,
  ModalController
} from 'ionic-angular';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Navio } from '../../model/navio';
import * as $ from 'jquery';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { CarregamentoExportacaoDataService } from '../../providers/carregamento-exportacao-data-service';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { Local } from '../../model/local';
import { ModalSelecaoChassiPage } from '../modal-selecao-chassi/modal-selecao-chassi';
import { NavioDataService } from '../../providers/navio-data-service';
import { ConferenciaStorageProvider } from '../../providers/storage/conferencia-storage-provider';
import { NavioStorageProvider } from '../../providers/storage/navio-storage-provider';
import { ConferenciaNavioLote } from '../../model/conferencia-navio-lote';

@Component({
  selector: 'page-conferencia-execucao',
  templateUrl: 'conferencia-execucao.html'
})
export class ConferenciaExecucaoPage {
  chassi: string;
  finalChassi: string;
  barcodeOptions: BarcodeScannerOptions;
  qrCodeText: string;
  inputChassi: string = '';
  url: string;
  responseData: any;
  tipoOperacao: any;
  totalDeVeiculos: number = 0;
  totalDeVeiculosCarregados: number = 0;
  conferenciaNavioLote: ConferenciaNavioLote;

  navio: Navio;
  destino: Local;
  isOnline: boolean;
  area: any;
  tipoConferencia: any;
  turno: any;
  usuario: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public barcodeScanner: BarcodeScanner,
    public modal: ModalController,
    public carregamentoExportacaoDataService: CarregamentoExportacaoDataService,
    public conferenciaDataService: ConferenciaDataService,
    public navioDataService: NavioDataService,
    public navioStorageProvider: NavioStorageProvider,
    public conferenciaStorageProvider: ConferenciaStorageProvider
  ) {
    console.log('this.navParams', this.navParams);

    this.navio = this.navParams.data.navio;
    console.log('navio-construtor', this.navio);
    this.isOnline = this.navParams.data.isOnline;
    this.destino = this.navParams.data.destino;

    this.area = this.navParams.data.area;
    this.tipoConferencia = this.navParams.data.tipoConferencia;
    this.turno = this.navParams.data.turno;
    this.usuario = this.navParams.data.usuario;
    this.conferenciaNavioLote = this.navParams.data.conferenciaNavioLote;

    this.chassi = '';
    this.finalChassi = '';

    this.barcodeOptions = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaExecucaoPage');

    this.carregarOperacoesCrossConferenciaLote(this.navio);
  }

  scan() {
    this.barcodeScanner.scan(this.barcodeOptions).then(
      barcodeData => {
        console.log('barcodeData', barcodeData);
        let code = barcodeData.text
          .replace('http://', '')
          .replace('https://', '');
        console.log('code', code);
        this.consultarChassi(code);
      },
      err => {
        let data = 'Erro de QR Code!';
        this.openModalErro(data);
      }
    );
  }

  onKey(event: any) {
    if (this.chassi.length == 6) {
      this.consultarChassi(this.chassi);
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

  consultarChassi(chassi) {
    if (this.isOnline) {
      this.authService.showLoading();
      this.conferenciaDataService
        .consultarChassi(
          chassi.length > 6 ? chassi : null,
          chassi.length > 6 ? null : chassi,
          this.navio.id,
          this.destino.id
        )
        .subscribe(
          res => {
            if (res.sucesso) {
              console.log(res);
              if (res.retorno && res.retorno.length) {
                this.openModalSelecaoChassi(res.retorno.map(v => v.chassi));
              } else {
                this.openModalErro('Chassi não encontrado em nenhum lote!');
              }
            } else {
              this.openModalErro(res.mensagem);
            }
          },
          err => {
            this.openModalErro(err);
          },
          () => {
            this.authService.hideLoading();
          }
        );
    } else {
      let chassis = [];

      for (let o = 0; o < this.navio.operacoes.length; o++) {
        let operacao = this.navio.operacoes[o];

        for (let l = 0; l < operacao.lotes.length; l++) {
          let lote = operacao.lotes[l];

          if (
            lote.destinoID == this.destino.id ||
            lote.destinoID == this.navio.porto.id
          ) {
            lote.invoices.forEach(loteInvoice => {
              loteInvoice.veiculos.forEach(veiculo => {
                //console.log(veiculo.chassi);
                if (
                  veiculo.chassi.toLowerCase().includes(chassi.toLowerCase())
                ) {
                  chassis.push(veiculo.chassi);
                }
              });
            });
          }
        }
      }

      if (chassis.length) {
        this.openModalSelecaoChassi(chassis);
      } else {
        this.openModalErro('Chassi não encontrado em nenhum lote!');
      }
    }
  }

  limpaChassiData() {
    this.chassi = '';
    this.inputChassi = '';
  }

  openModalSelecaoChassi(chassis) {
    const chassiModal: Modal = this.modal.create(ModalSelecaoChassiPage, {
      chassis: chassis
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.limpaChassiData();
      if (data.chassiSelecionado) {
        this.inputChassi = data.chassiSelecionado;
        this.conferirChassi();
      }
    });
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      console.log('data');
      //this.formData.chassi = '';
    });
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
    chassiModal.present();

    //chassiModal.onDidDismiss(data => {});

    if (this.isOnline) {
      //let navio = this.navio; // força a atualização do componente.
      //this.navio = null; // força a atualização do componente.
      chassiModal.onWillDismiss(data => {
        this.carregarOperacoesCrossConferenciaLote(this.navio);
      });
    } else {
      chassiModal.onWillDismiss(data => {});
    }
  }

  carregarOperacoesCrossConferenciaLote(navio) {
    this.authService.showLoading();
    this.navioDataService
      .carregarNavioOperacoesCrossConferenciaLote(
        navio.id,
        this.conferenciaNavioLote.conferenciaLoteGUI
      )
      .subscribe(
        res => {
          if (res.sucesso) {
            navio.operacoes = res.retorno;
            this.navio = {...navio};
          } else {
            this.openModalErro(res.mensagem);
          }
        },
        error => {
          this.openModalErro(error);
        },
        () => {
          this.authService.hideLoading();
        }
      );
  }

  conferirChassi() {
    let data = {
      chassi: this.inputChassi,
      navioId: this.navio.id,
      destinoId: this.destino.id,
      areaId: this.area ? this.area.id : null,
      tipoConferenciaId: this.tipoConferencia ? this.tipoConferencia.id : null,
      turnoId: this.turno ? this.turno.id : null,
      nomeUsuario: this.usuario ? this.usuario : null,
      conferenciaLoteGUI: this.conferenciaNavioLote.conferenciaLoteGUI
    };

    if (this.isOnline) {
      this.authService.showLoading();
      this.conferenciaDataService.conferirChassiNavio(data).subscribe(
        res => {
          if (res.sucesso) {
            this.limpaChassiData();
            var data = {
              message: 'Conferência realizada',
              iconClass: 'icon-load-export'
            };
            this.openModalSucesso(data);
          } else {
            this.openModalErro(res.mensagem);
          }
        },
        error => {},
        () => {
          this.authService.hideLoading();
        }
      );
    } else {
      for (let o = 0; o < this.navio.operacoes.length; o++) {
        let operacao = this.navio.operacoes[o];

        for (let l = 0; l < operacao.lotes.length; l++) {
          let lote = operacao.lotes[l];

          if (
            lote.destinoID == this.destino.id ||
            lote.destinoID == this.navio.porto.id
          ) {
            for (let i = 0; i < lote.invoices.length; i++) {
              let loteInvoice = lote.invoices[i];

              for (let v = 0; v < loteInvoice.veiculos.length; v++) {
                let veiculo = loteInvoice.veiculos[v];

                if (
                  veiculo.chassi.toLowerCase() == this.inputChassi.toLowerCase()
                ) {
                  this.conferenciaStorageProvider
                    .persistConferenciaNavio(
                      this.inputChassi,
                      this.authService.getUserData().id,
                      data
                    )
                    .then(resultConferenciaPersistence => {
                      var data = {
                        message: 'Conferência realizada',
                        iconClass: 'icon-load-export'
                      };

                      this.limpaChassiData();

                      if (!veiculo.conferido) {
                        veiculo.conferido = true;
                        lote.quantidadeConferida++;
                        loteInvoice.quantidadeConferida++;
                        this.navioStorageProvider
                          .persistNavio(
                            this.navio,
                            this.authService.getUserData().id
                          )
                          .then(resultPersistence => {
                            this.openModalSucesso(data);
                          })
                          .catch(error => {
                            console.error(error);
                            this.openModalErro(error);
                          });
                      } else {
                        this.openModalSucesso(data);
                      }
                    })
                    .catch(error => {
                      console.error(error);
                      this.openModalErro(error);
                    });
                }
              }
            }
          }
        }
      }
    }
  }
}
