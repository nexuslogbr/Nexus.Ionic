import { Component, ViewChild } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@ionic-native/barcode-scanner';
import { NavController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalRecebimentoComponent } from '../../components/modal-recebimento/modal-recebimento';
import { ModalChassisComponent } from '../../components/modal-chassis/modal-chassis';
import { ParqueamentoPage } from '../parqueamento/parqueamento';
import { RomaneioPage } from '../romaneio/romaneio';
import { MovimentacaoPage } from '../movimentacao/movimentacao';
import { HomePage } from '../home/home';
import { ReceberParquearPage } from '../receber-parquear/receber-parquear';
import { CarregamentoExportPage } from '../carregamento-export/carregamento-export';
import { CarregamentoPage } from '../carregamento/carregamento';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ModalChassisBloqueioComponent } from '../../components/modal-chassis-bloqueio/modal-chassis-bloqueio';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ModalChassisVistoriaComponent } from '../../components/modal-chassis-vistoria/modal-chassis-vistoria';

@Component({
  selector: 'page-vistoria',
  templateUrl: 'vistoria.html',
})
export class VistoriaPage {
  title: string;
  scanData: {};
  data: any;
  inputChassi: string = '';
  carData: any;
  options: BarcodeScannerOptions;
  token: string;
  chassi: string;
  erroData = {
    messageTitle: '',
    message: '',
  };

  responseData: any;
  responseCarData: any;
  url: string;
  qrCodeText: string;
  formData = { chassi: '' };
  formBloqueioData = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
  };
  bloqueioData = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
  };
  ligado: boolean;
  modoOperacao: number;

  @ViewChild('chassiInput') chassiInput;

  formControlChassi = new FormControl('');
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    private http: HttpClient,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    public navCtrl: NavController,
    public storage: Storage,
    public authService: AuthService
  ) {
    this.title = 'Vistoria';
    this.url = this.authService.getUrl();

    this.modoOperacao = this.authService.getLocalModoOperacao();
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
    // this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
    //   if (value && value.length) {
    //     {
    //       if (value.length >= 6) {
    //         let chassi = value.replace(/[\W_]+/g, '');
    //         setTimeout(() => {
    //           this.buscarChassi(chassi, false);
    //           this.formData.chassi = '';
    //         }, 500);
    //       }
    //     }
    //   }
    // });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter VistoriaPage');
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);

    this.authService.hideLoading();

  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        this.chassiInput.setFocus();
      }, 1000);
    }
    this.formData.chassi = '';
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then(
      (barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(
            this.qrCodeText.length - 17,
            17
          );
          this.formData['chassi'] = partChassi;
          this.buscarChassi(partChassi, true);
        }
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data, true);
      }
    );
  }

  buscarChassi(partChassi, byScanner: boolean) {

    this.formBloqueioData.chassi = partChassi;
    // let uriBuscaChassi =
    //   '/veiculos/ConsultarChassi?token=' +
    //   this.authService.getToken() +
    //   '&chassi=' +
    //   partChassi;

      let uriBuscaChassi =
      '/Vistoriar/ConsultarChassi?token=' +
      this.authService.getToken() +
      '&chassi=' +  this.formBloqueioData.chassi;

    this.authService.showLoading();
    this.formBloqueioData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {

        this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();

          this.openModalChassis(this.responseData.retorno, byScanner);
        } else {
          this.authService.hideLoading();
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem, byScanner);
          } else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem, byScanner);
          } else if (
            this.modoOperacao == 2 &&
            this.responseData.dataErro == 'CHASSI_NOT_FOUND'
          ) {
            this.openModalChassis([partChassi], byScanner);
          } else {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText, byScanner);
      }
    );
  }

  // consultarChassi(veiculoID, partChassi, byScanner: boolean) {


  //   this.formBloqueioData.chassi = partChassi;
  //   let uriBuscaChassi =
  //     '/Bloqueio/Bloqueios?token=' +
  //     this.authService.getToken() +
  //     '&veiculoID=' +
  //     veiculoID;

  //   this.authService.showLoading();
  //   this.formBloqueioData.token = this.authService.getToken();

  //   this.http.get(this.url + uriBuscaChassi).subscribe(
  //     (res) => {

  //       this.responseData = res;
  //       if (this.responseData.sucesso) {
  //         this.authService.hideLoading();
  //         this.openModalChassis(this.responseData.retorno, byScanner);
  //       } else {
  //         this.authService.hideLoading();
  //         if (this.modoOperacao == 1 || partChassi.length < 17) {
  //           this.openModalErro(this.responseData.mensagem, byScanner);
  //         } else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
  //           this.openModalErro(this.responseData.mensagem, byScanner);
  //         } else if (
  //           this.modoOperacao == 2 &&
  //           this.responseData.dataErro == 'CHASSI_NOT_FOUND'
  //         ) {
  //           this.openModalChassis([partChassi], byScanner);
  //         } else {
  //           this.openModalErro(this.responseData.mensagem, byScanner);
  //         }
  //       }
  //     },
  //     (error) => {
  //       this.authService.hideLoading();
  //       this.openModalErro(error.status + ' - ' + error.statusText, byScanner);
  //     }
  //   );
  // }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  openModalRecebimento(data, byScanner: boolean) {
    ;
    const recModal: Modal = this.modal.create(ModalRecebimentoComponent, {
      data: data,
    });
    recModal.present();

    recModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  openModalChassis(data, byScanner: boolean) {


    const chassiModal: Modal = this.modal.create(ModalChassisVistoriaComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }


  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
      this.navCtrl.push(MovimentacaoPage);

    })
  }
  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  toParqueamento() {
    this.navCtrl.push(ParqueamentoPage);
  }

  toMovimentacao() {
    this.navCtrl.push(MovimentacaoPage);
  }

  toCarregamento() {
    this.navCtrl.push(CarregamentoPage);
  }

  toReceberParquear() {
    this.navCtrl.push(ReceberParquearPage);
  }

  toRomaneio() {
    this.navCtrl.push(RomaneioPage);
  }

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }
}
