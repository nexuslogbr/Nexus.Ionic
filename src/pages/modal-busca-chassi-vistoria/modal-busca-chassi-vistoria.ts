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
import { ModelLancarAvariaPage } from '../model-lancar-avaria/model-lancar-avaria';
import { Arquivo } from '../../model/arquivo';
import { Navio } from '../../model/navio';

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
  url: string;
  qrCodeText: string;
  modoOperacao: number;
  formData = {
    veiculo: new Veiculo(),
    momento: new Momento(),
    arquivo: new Arquivo(),
    navio: new Navio(),
    veiculos: new Array<Veiculo>()
  };

  @ViewChild('chassiInput') chassiInput;
  formControlChassi = new FormControl('');
  modalChassi: Modal

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

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

    if (localStorage.getItem('tema') == "Cinza" || !localStorage.getItem('tema')) {
      this.primaryColor = '#595959';
      this.secondaryColor = '#484848';
      this.inputColor = '#595959';
      this.buttonColor = "#595959";
    }
    else {
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
              this.buscarChassi(chassi);
              this.chassi = '';
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
    this.chassi = '';
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };

    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(this.qrCodeText.length - 17, 17);
          this.buscarChassi(partChassi);
        }
      },
      (err) => {
        let data = 'Erro de qr code!';
        this.openModalErro(data);
      }
    );
  }

  buscarChassi(chassi) {
    this.authService.showLoading();

    let veiculo = this.formData.veiculos.filter(x => x.chassi == chassi).map(x => x)[0];

    if (veiculo && chassi.length == 17) {
      this.formData.veiculo = veiculo;
      this.vistoriarChassi(veiculo)
    }
    else {
      this.alertService.showError('CHASSI INVÀLIDO');
      this.authService.hideLoading();
    }
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
        const modal: Modal = this.modal.create(ModelLancarAvariaPage, {
          data: this.formData,
        });
        modal.present();

        this.view.dismiss();
      }
      else {
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

  openModalErro(data) {
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
