import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  Modal
} from 'ionic-angular';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from '@ionic-native/barcode-scanner';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CarregamentoExportacaoDataService } from '../../providers/carregamento-exportacao-data-service';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { NavioDataService } from '../../providers/navio-data-service';
import * as $ from 'jquery';
import { NavioStorageProvider } from '../../providers/storage/navio-storage-provider';
import { ConferenciaStorageProvider } from '../../providers/storage/conferencia-storage-provider';
import { ModalSelecaoChassiPage } from '../modal-selecao-chassi/modal-selecao-chassi';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { Arquivo } from '../../model/arquivo';
import { ConferenciaChassiResumo } from '../../model/conferencia-chassi-resumo';
import { ArquivoStorageProvider } from '../../providers/storage/arquivo-storage-provider';

@Component({
  selector: 'page-conferencia-planilha-execucao',
  templateUrl: 'conferencia-planilha-execucao.html'
})
export class ConferenciaPlanilhaExecucaoPage {
  chassi: string;
  finalChassi = '';
  options: BarcodeScannerOptions;
  qrCodeText: string;
  inputChassi: string = '';
  url: string;
  responseData: any;

  totalDeVeiculos: number = 0;
  totalDeVeiculosCarregados: number = 0;

  planilha: Arquivo;
  conferencias: Array<ConferenciaChassiResumo> = [];
  isOnline: boolean;

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
    public conferenciaStorageProvider: ConferenciaStorageProvider,
    public arquivoStorageProvider: ArquivoStorageProvider
  ) {
    console.log('this.navParams', this.navParams);
    this.planilha = this.navParams.data.planilha;
    this.isOnline = this.navParams.data.isOnline;

    this.chassi = '';
    this.finalChassi = '';

    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaPlanilhaExecucaoPage');

    if (this.isOnline) {
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
    } else {
      this.conferencias = this.planilha.resumos;
    }
  }

  ///
  scan() {
    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        this.consultarChassi(
          barcodeData.text.replace('http://', '').replace('https://', '')
        );
      },
      err => {
        let data = 'Erro de QR Code!';
        this.openModalErro(data);
      }
    );
  }

  onKey(event: any) {
    //this.inputChassi = event.target.value;
    if (this.chassi.length == 6) {
      //this.buscaChassi(this.inputChassi);
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
        .consultarChassiPlanilha(chassi, this.planilha.id)
        .subscribe(
          res => {
            if (res.sucesso) {
              console.log(res);
              if (res.retorno && res.retorno.length) {
                this.openModalSelecaoChassi(res.retorno.map(v => v.chassi));
                // if (res.retorno.length > 1) {
                //   this.openModalSelecaoChassi(res.retorno);
                // } else {
                //   this.limparChassi(res.retorno[0].chassi);
                // }
              } else {
                this.openModalErro('Chassi não encontrado na planilha!');
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

      if (this.conferencias && this.conferencias.length) {
        for (let c = 0; c < this.conferencias.length; c++) {
          let conferencia = this.conferencias[c];
          for (let v = 0; v < conferencia.veiculos.length; v++) {
            let veiculo = conferencia.veiculos[v];
            if (veiculo.chassi.toUpperCase().includes(chassi.toUpperCase())) {
              chassis.push(veiculo.chassi);
            }
          }
        }
      }

      if (chassis.length) {
        // TODO: tratar se achar mais de um...
        //this.limparChassi(chassis[0]);
        this.openModalSelecaoChassi(chassis);
      } else {
        this.openModalErro('Chassi não encontrado na planilha!');
      }
    }
  }

  limparChassiData() {
    this.chassi = '';
    this.finalChassi = '';
  }

  openModalSelecaoChassi(chassis) {
    const chassiModal: Modal = this.modal.create(ModalSelecaoChassiPage, {
      chassis: chassis
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.limparChassiData();
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
    });
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
    chassiModal.present();
  }

  async conferirChassi() {
    let data = {
      chassi: this.inputChassi,
      arquivoId: this.planilha.id
    };

    if (this.isOnline) {
      this.authService.showLoading();
      this.conferencias = null; // força a atualização do componente.
      this.conferenciaDataService.conferirChassiPlanilha(data).subscribe(
        res => {
          if (res.sucesso) {
            this.conferenciaDataService
              .listarConferenciaChassiResumo(this.navParams.data.planilha.id)
              .subscribe(
                res => {
                  if (res.sucesso) {
                    this.limparChassiData();
                    this.conferencias = res.retorno;
                    var data = {
                      message: 'Conferência realizada',
                      iconClass: 'icon-load-export'
                    };
                    this.openModalSucesso(data);
                  } else {
                    console.log('error', res.mensagem);
                    this.openModalErro(res.mensagem);
                  }
                  this.authService.hideLoading();
                },
                error => {
                  console.log('error', error);
                  this.openModalErro(res.mensagem);
                  this.authService.hideLoading();
                }
              );
          } else {
            console.log('error', res.mensagem);
            this.openModalErro(res.mensagem);
            this.authService.hideLoading();
          }
        },
        error => {
          console.log('error', error);
          this.openModalErro(error);
          this.authService.hideLoading();
        }
      );
    } else {
      if (this.conferencias && this.conferencias.length) {
        for (let c = 0; c < this.conferencias.length; c++) {
          let conferencia = this.conferencias[c];
          for (let v = 0; v < conferencia.veiculos.length; v++) {
            let veiculo = conferencia.veiculos[v];
            if (
              veiculo.chassi.toLowerCase() == this.inputChassi.toLowerCase()
            ) {
              try {
                veiculo.conferido = true;

                await this.conferenciaStorageProvider.persistConferenciaPlanilha(
                  this.inputChassi,
                  this.authService.getUserData().id,
                  data
                );

                await this.arquivoStorageProvider.persistArquivo(
                  this.planilha,
                  this.authService.getUserData().id
                );

                this.planilha = await this.arquivoStorageProvider.getArquivo(
                  this.planilha.id,
                  this.authService.getUserData().id
                );
                this.conferencias = this.planilha.resumos;

                var dataModal = {
                  message: 'Conferência realizada',
                  iconClass: 'icon-load-export'
                };
                this.limparChassiData();
                this.openModalSucesso(dataModal);
                break;
              } catch (exception) {
                console.log('error', exception);
                this.openModalErro(exception);
              }
            }
          }
        }
      }
    }
  }
}
