import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalObservacoesComponent } from '../../components/modal-observacoes/modal-observacoes';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { ModalSelecionarChassiComponent } from '../../components/modal-selecionar-chassi/modal-selecionar-chassi';
import { ModalSelecionarChassiBuscaComponent } from '../../components/modal-selecionar-chassi-busca/modal-selecionar-chassi-busca';
import { Momento } from '../../model/Momento';

@Component({
  selector: 'modal-busca-chassi',
  templateUrl: 'modal-busca-chassi.html'
})
export class ModalBuscaChassiComponent {
  title: string;
  data: any;
  options: BarcodeScannerOptions;
  token: string;
  chassi: string;
  responseData: any;
  url: string;
  qrCodeText: string;
  modoOperacao: number;
  formData = {
    chassi: '',
    observacao: '',
    buscaAvaria: false,
    momento: new Momento()
  };

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

  @ViewChild('chassiInput') chassiInput;
  formControlChassi = new FormControl('');
  modalChassi: Modal

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    private navCtrl: NavController,
    private storage: Storage,
    private view: ViewController,
    public navParams: NavParams,
    private authService: AuthService
  ) {
    this.title = 'Observações';
    this.url = this.authService.getUrl();

    this.modoOperacao = this.authService.getLocalModoOperacao();

    this.formData = this.navParams.get('data');

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


  ionViewDidEnter() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);

    this.authService.hideLoading();
  }

  cleanInput() {
      setTimeout(() => {
        this.chassiInput.setFocus();
      }, 1000);
    this.formData.chassi = '';
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };

    this.authService.showLoading();
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(this.qrCodeText.length - 17, 17);
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
    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;
    this.authService.showLoading();
    this.formBloqueioData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {
        this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.openModal(this.responseData.retorno, byScanner);
        }
        else {
          this.authService.hideLoading();
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
          else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
          else if (
            this.modoOperacao == 2 &&
            this.responseData.dataErro == 'CHASSI_NOT_FOUND'
          ) {
            this.openModal([partChassi], byScanner);
          }
          else {
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

  openModal(data, byScanner: boolean) {
    data['momento'] = this.formData.observacao;
    if (this.formData.buscaAvaria) {
      this.modalChassi = this.modal.create(ModalSelecionarChassiBuscaComponent, {
        data: data,
      });
      this.modalChassi.present();
      this.view.dismiss();
    }
    else{
      data.momentoID = this.formData.momento.id;
      this.modalChassi = this.modal.create(ModalSelecionarChassiComponent, {
        data: data,
      });
      this.modalChassi.present();
      this.view.dismiss();
    }
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss(() => { this.cleanInput(); });
  }
}
