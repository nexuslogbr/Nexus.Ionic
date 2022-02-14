import { Component, ViewChild } from "@angular/core";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import {
  NavController,
  NavParams,
  Modal,
  ModalController,
  TextInput
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { HttpClient } from "@angular/common/http";
import { FormMovimentacaoComponent } from "../../components/form-movimentacao/form-movimentacao";
import { ModalChassiMovimentacaoComponent } from "../../components/modal-chassi-movimentacao/modal-chassi-movimentacao";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { RomaneioPage } from "../../pages/romaneio/romaneio";
import { ReceberParquearPage } from "../../pages/receber-parquear/receber-parquear";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import * as $ from "jquery";
import { FormControl } from "@angular/forms";

@Component({
  selector: "page-movimentacao",
  templateUrl: "movimentacao.html"
})
export class MovimentacaoPage {
  title: string;
  formData = { chassi: "" };
  private url: string;
  responseData: any;
  responseCarData: any;
  options: BarcodeScannerOptions;
  formMovimentacaoData = {
    token: "",
    empresaID: "1",
    id: "",
    chassi: "",
    local: "",
    layout: "",
    bolsao: "",
    fila: "",
    posicao: ""
  };
  inputChassi: string = "";
  qrCodeText: string;
  recebimentoData = {
    token: "",
    empresaID: "1",
    id: "",
    chassi: "",
    local: "",
    layout: "",
    bolsao: "",
    fila: "",
    posicao: ""
  };
  ligado: boolean;

  primaryColor:string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  @ViewChild("chassiInput") chassiInput;
  formControlChassi = new FormControl("");

  constructor(
    private httpClient: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public authService: AuthService
  ) {
    this.title = "Movimentação";
    console.log("MovimentacaoPage");
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
      console.log("debounced", value);
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, "");
            setTimeout(() => {
              this.BuscarChassi(chassi, false);
              this.formData.chassi = '';
            }, 500);
          }
        }
      }
    });
    
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter MovimentacaoPage");
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        this.chassiInput.setFocus();
      }, 1000);
    }
    this.formData.chassi = "";
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: "",
      resultDisplayDuration: 0
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        this.qrCodeText = barcodeData.text;

        this.ConsultarChassi(this.qrCodeText, true);
      },
      err => {
        this.authService.hideLoading();
        let data = "Erro de qr code!";
        this.openModalErro(data, true);
      }
    );
  }

  BuscarChassi(text, byScanner: boolean) {
    let buscarChassi =
      this.url +
      "/Movimentar/BuscarChassi?token=" +
      this.authService.getToken() +
      "&partChassi=" +
      text;

    this.authService.showLoading();

    this.formMovimentacaoData.token = this.authService.getToken();

    this.httpClient.get(buscarChassi).subscribe(
      data => {
        this.responseData = data;

        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.openModalChassi(this.responseData.retorno, byScanner);
          this.formMovimentacaoData.id = this.responseData.retorno["id"];
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem, byScanner);
        }
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem, byScanner);
      }
    );
  }
  ConsultarChassi(text, byScanner: boolean) {
    let consultarChassi =
      this.url +
      "/Movimentar/ConsultarChassi?token=" +
      this.authService.getToken() +
      "&chassi=" +
      text;

    this.authService.showLoading();

    this.formMovimentacaoData.token = this.authService.getToken();

    this.httpClient.get(consultarChassi).subscribe(
      data => {
        this.responseData = data;

        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.openModal(this.responseData.retorno, byScanner);
          this.formMovimentacaoData.id = this.responseData.retorno["id"];
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem, byScanner);
        }
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status + " - " + err.statusText, byScanner);
        console.log(err);
      }
    );
  }
  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  openModal(data, byScanner: boolean) {
    const recModal: Modal = this.modal.create(FormMovimentacaoComponent, {
      data: data
    });
    recModal.present();

    recModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });
  }

  openModalChassi(data, byScanner: boolean) {
    const recModal: Modal = this.modal.create(
      ModalChassiMovimentacaoComponent,
      { data: data }
    );
    recModal.present();

    recModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });
  }
  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });
  }
  openModalSucesso(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
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
