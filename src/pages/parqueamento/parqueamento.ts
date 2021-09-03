import { Component, ViewChild } from '@angular/core';
import { NavController, Modal, ModalController, TextInput } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { ModalChassiParqueamentoComponent } from '../../components/modal-chassi-parqueamento/modal-chassi-parqueamento';
import { FormRecebimentoComponent } from '../../components/form-recebimento/form-recebimento';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { CarregamentoExportPage } from '../../pages/carregamento-export/carregamento-export';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'page-parqueamento',
  templateUrl: 'parqueamento.html',
})

export class ParqueamentoPage {
  title: string;
  scanData: {};
  data: any;
  carData: any;
  options: BarcodeScannerOptions;
  token: string;
  chassi: string;
  inputChassi: string = '';
  responseData: any;
  responseCarData: any;
  responseData2: any;
  private url: string;
  private url2: string;
  qrCodeText: string;
  formData = { "chassi": "" };
  formParqueamentoData = {
    "token": "",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao": ''
  };
  recebimentoData = {
    "token": "",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao": ''
  };

  ligado: boolean;

  @ViewChild("chassiInput") chassiInput;
  formControlChassi = new FormControl("");

  constructor(public http: HttpClient, 
    private modal: ModalController, 
    public navCtrl: NavController, 
    private barcodeScanner: BarcodeScanner, 
    public authService: AuthService) {
      this.title = 'Parqueamento';
      this.url = this.authService.getUrl();

      // this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
      //   console.log("debounced", value);
      //   if (value && value.length) {
      //     {
      //       if (value.length >= 6) {
      //         let chassi = value.replace(/[\W_]+/g, "");
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
    // console.log('ionViewDidEnter ParqueamentoPage');
    // setTimeout(() => {
    //   this.chassiInput.setFocus();
    // }, 1000);
  }

  cleanInput(byScanner: boolean) {
    console.log("byScanner", byScanner);
    // if (!byScanner) {
    //   setTimeout(() => {
    //     this.chassiInput.setFocus();
    //   }, 1000);
    //}
 //   this.formData.chassi = "";
  }


  scan() {
    this.options = {
      showTorchButton: true,
      prompt: "",
      resultDisplayDuration: 0
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then((barcodeData) => {
      this.qrCodeText = barcodeData.text;

      if (this.qrCodeText && this.qrCodeText.length) {
        let partChassi = this.qrCodeText.substr(this.qrCodeText.length - 6, 6);
        this.formData['chassi'] = partChassi;
        this.buscarChassi(partChassi, true);
      }
    }, (err) => {
      this.authService.hideLoading();
      let data = "Erro de qr code!";
      this.openModalErro(data, true);
    });
  }

  buscarChassi(partChassi, byScanner: boolean) {

    this.formParqueamentoData.chassi = this.formData['chassi'];
    let urlBuscarChassi = this.url + "/Parquear/BuscarChassi?token=" + this.authService.getToken() + "&partChassi=" + partChassi;
    this.authService.showLoading();
    this.formParqueamentoData.token = this.authService.getToken();

    this.http.get(urlBuscarChassi)
      .subscribe(res => {

        this.responseData = res;
        if (this.responseData.sucesso) {
          this.openModalChassis(this.responseData.retorno, byScanner);
        } else {
          this.openModalErro(this.responseData.mensagem, byScanner);
        }
        this.authService.hideLoading();

      }, (error) => {
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem, byScanner);
      });

  }
  
  cancelar() {
    this.navCtrl.push(ParqueamentoPage);
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }

  openModalChassis(data, byScanner: boolean) {

    const chassiModal: Modal = this.modal.create(ModalChassiParqueamentoComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });

  }

  openModalRecebimento(data, byScanner: boolean) {

    const recModal: Modal = this.modal.create(FormRecebimentoComponent, { data: data });
    recModal.present();

    recModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });
  }

  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, { data: data });
    chassiModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });
    chassiModal.present();
  }

  openModalSucesso(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });

  }

  toParqueamento() {
    this.navCtrl.push(ParqueamentoPage);
  }

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

  toRomaneio() {
    this.navCtrl.push(RomaneioPage);
  }

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }
}
