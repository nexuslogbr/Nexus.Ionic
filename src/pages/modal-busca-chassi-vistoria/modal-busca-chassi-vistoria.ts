import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { HomePage } from '../home/home';
import { Momento } from '../../model/Momento';
import { Veiculo } from '../../model/veiculo';
import { finalize } from 'rxjs/operators';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { DataRetorno } from '../../model/dataretorno';
import { AlertService } from '../../providers/alert-service';
import { LancamentoAvariaVistoriaLancarPage } from '../lancamento-avaria-vistoria-lancar/lancamento-avaria-vistoria-lancar';
import { ModelLancarAvariaPage } from '../model-lancar-avaria/model-lancar-avaria';

@Component({
  selector: 'page-modal-busca-chassi-vistoria',
  templateUrl: 'modal-busca-chassi-vistoria.html',
})
export class ModalBuscaChassiVistoriaPage {
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
    posicaoAtual: '',
    veiculo: new Veiculo(),
    momento: new Momento()
  };

  @ViewChild('chassiInput') chassiInput;
  formControlChassi = new FormControl('');
  modalChassi: Modal

  constructor(
    private http: HttpClient,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    private navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private vistoriaService: VistoriaDataService,
    private view: ViewController,
    public alertService: AlertService
  ) {
    this.title = 'Vistoriar Chassi';
    this.url = this.authService.getUrl();

    this.modoOperacao = this.authService.getLocalModoOperacao();

    this.formData = this.navParams.get('data');

    this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, '');
            setTimeout(() => {
              this.buscarChassi(chassi);
              this.formData.veiculo.chassi = '';
              this.chassi = chassi;
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
    this.formData.veiculo.chassi = '';
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
          this.formData.veiculo.chassi = partChassi;
          this.buscarChassi(partChassi);
        }
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data, true);
      }
    );
  }

  buscarChassi(partChassi) {
    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;
    this.authService.showLoading();

    this.http.get(this.url + uriBuscaChassi)
    .subscribe(
      (res) => {
        this.responseData = res;
        if (this.responseData.sucesso) {
          this.vistoriarChassi(this.responseData.retorno);
        }
        else {
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem, true);
          }
          else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem, true);
          }
          else {
           this.openModalErro(this.responseData.mensagem, true);
          }
        }
      },
      (error) => {
        this.openModalErro(error.status + ' - ' + error.statusText, true);
      }
    );
  }

  vistoriarChassi(veiculo: Veiculo){
    this.vistoriaService.vistoriarChassi(veiculo.id)
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe((res:DataRetorno) => {
      if (res.sucesso) {

        this.formData.veiculo.chassi = this.chassi;
        this.view.dismiss();

        const modal: Modal = this.modal.create(ModelLancarAvariaPage, {
          data: this.formData,
        });
        modal.present();
      }
      else if (!res.sucesso) {
        this.view.dismiss();
        this.alertService.showError(res.mensagem);
      }
    });
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

  showSucessAlert(message: string, onDismiss?: Function) {
    this.alertService.showInfo(message, null, onDismiss);
  }

}
