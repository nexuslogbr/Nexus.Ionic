import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Modal, ModalController, NavController, NavParams, Select, ViewController } from 'ionic-angular';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { ModalChassisComponent } from '../../components/modal-chassis/modal-chassis';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Component({
  selector: 'page-vistoriar',
  templateUrl: 'vistoriar.html',
})
export class VistoriarPage {

  options: BarcodeScannerOptions;
  qrCodeText: string;
  formData = { chassi: '' };
  formRecebimentoData = {
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
  url: string;
  responseData: any;
  modoOperacao: number;
  @ViewChild('chassiInput') chassiInput;
  formControlChassi = new FormControl('');
  @ViewChild('select') select: Select;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  title: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    private view: ViewController,
    private http: HttpClient,
    public authService: AuthService
  )
  {

    this.title = 'Vistoriar';
    this.modoOperacao = this.authService.getLocalModoOperacao();
      this.url = this.authService.getUrl();
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

    this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, '');
            setTimeout(() => {
              this.buscarChassi(chassi, false);
              this.formData.chassi = '';
            }, 500);
          }
        }
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VistoriarPage');
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

    this.formRecebimentoData.chassi = partChassi;
    let uriBuscaChassi = '/Vistoriar/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;

    this.authService.showLoading();
    this.formRecebimentoData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {

        this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.VistoriaVeiculo(this.responseData.retorno);
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
            this.VistoriaVeiculo([partChassi]);
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

  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  cleanInput(byScanner: boolean) {
    this.formData.chassi = '';
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  VistoriaVeiculo(responseData: any) {
    this.formRecebimentoData.id = responseData['id'];
    let uriReceberVeiculo = this.url + '/Vistoriar/VistoriarVeiculo?token=' + this.authService.getToken() + '&veiculoID=' + responseData['id'];
    this.http.put(uriReceberVeiculo, {}, httpOptions).subscribe(
      (res: any) => {
        if (res.sucesso) {
          this.authService.hideLoading();
          this.select.close();
          this.view.dismiss();
        } else {
          this.authService.hideLoading();
          // this.openModalErro(res.mensagem);
          this.select.close();
          this.view.dismiss();
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.select.close();
        this.view.dismiss();
      }
    );
  }

}
