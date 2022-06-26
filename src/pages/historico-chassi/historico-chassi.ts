import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  Modal,
  ModalController,
  ViewController,
} from 'ionic-angular';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@ionic-native/barcode-scanner';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { CarregamentoExportPage } from '../../pages/carregamento-export/carregamento-export';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ModalHistoricoChassiComponent } from '../../components/modal-historico-chassi/modal-historico-chassi';
import { HistoricoChassiResumoPage } from '../historico-chassi-resumo/historico-chassi-resumo';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'page-historico-chassi',
  templateUrl: 'historico-chassi.html',
})
export class HistoricoChassiPage {
  title: string;
  scanData: {};
  data: any;
  carData: any;
  options: BarcodeScannerOptions;
  token: string;
  chassi: string;
  responseData: any;
  responseCarData: any;
  responseData2: any;
  url: string;
  qrCodeText: string;
  formData = { chassi: '' };
  formParqueamentoData = {
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
  recebimentoData = {
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

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  @ViewChild('chassiInput') chassiInput;
  formControlChassi = new FormControl('');

  constructor(
    public httpClient: HttpClient,
    private view: ViewController,
    private barcodeScanner: BarcodeScanner,
    public authService: AuthService,
    private modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.title = 'Histórico de Chassi';


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

    this.url = this.authService.getUrl();

    this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
      console.log('debounced', value);
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, '');
            setTimeout(() => {
              this.buscarChassi();
              this.formData.chassi = '';
            }, 500);
          }
       }
     }
    });
  }

  ionViewDidEnter() {
    console.log('HistoricoChassiPage');
    // setTimeout(() => {
    //   this.chassiInput.setFocus();
    // }, 1000);
  }

  cleanInput(byScanner: boolean) {
  //  if (!byScanner) {
  //    setTimeout(() => {
  //      this.chassiInput.setFocus();
  //    }, 1000);
  //  }
  //  this.formData.chassi = '';
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
        this.consultarChassi(this.qrCodeText, true);
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data, true);
      }
    );
  }

  consultarChassi(chassi: string, byScanner: boolean) {
   // this.view.dismiss();

    let urlConsultarChassi =
      this.url +
      '/VeiculoHistorico/ConsultarChassi?token=' +
      this.authService.getToken() +
      '&chassi=' +
      chassi;

    this.formParqueamentoData.chassi = chassi;
    this.formParqueamentoData.token = this.authService.getToken();
    this.formParqueamentoData.local = this.authService.getLocalAtual();

    this.authService.showLoading();

    this.httpClient.get<dataRetorno>(urlConsultarChassi).subscribe(
      (res) => {
        let data = res;

        if (data.sucesso) {
          this.authService.hideLoading();
          this.navCtrl.push(HistoricoChassiResumoPage, { data: data.retorno });
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem, byScanner);
        }
      },
      (err) => {
        this.authService.hideLoading();
        this.openModalErro(err.status + ' - ' + err.statusText, byScanner);
        console.log(err);
      }
    );
  }

  buscarChassi() {
      this.authService.showLoading();

      this.qrCodeText = this.formData['chassi'];
      this.consultarChassi(this.qrCodeText, true);
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  openModalChassis(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(
      ModalHistoricoChassiComponent,
      { data: data }
    );

    chassiModal.onDidDismiss((data) => {
      if (data && data.cancelado) {
        this.cleanInput(byScanner);
      }
    });

    chassiModal.present();
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  toRecebimento() {
    this.navCtrl.push(RecebimentoPage);
  }

  toMovimentacao() {
    this.navCtrl.push(MovimentacaoPage);
  }

  toCarregamento() {
    this.navCtrl.push(CarregamentoPage);
  }

  toParqueamentoExport() {
    this.navCtrl.push(ReceberParquearPage);
  }

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }

  openModalSucesso(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data,
    });

    chassiModal.present();

    chassiModal.onDidDismiss(() => {
      this.cleanInput(byScanner);
    });
  }

  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss(() => {
      this.cleanInput(byScanner);
    });
  }
}
interface dataRetorno {
  dataErro: string;
  mensagem: string;
  retorno: any;
  sucesso: boolean;
  tipo: number;
  urlRedirect: string;
}
