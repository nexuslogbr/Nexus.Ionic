import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController,
  TextInput,
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from "@ionic-native/barcode-scanner";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { ModalChassiReceberParquearComponent } from "../../components/modal-chassi-receber-parquear/modal-chassi-receber-parquear";
import { MovimentacaoPage } from "../../pages/movimentacao/movimentacao";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import { FormReceberParquearComponent } from "../../components/form-receber-parquear/form-receber-parquear";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
import { FormControl } from "@angular/forms";

@Component({
  selector: "modal-receber-parquear",
  templateUrl: "modal-receber-parquear.html",
})
export class ModalReceberParquearComponent {
  title: string;
  chassi: string;
  veiculoID: string;
  options: BarcodeScannerOptions;
  qrCodeText: string;
  url: string;
  responseData: any;
  response: any;
  ligado: boolean;
  dadosParqueamento: any = {
    bolsaoID: "",
    bolsaoNome: "",
    filaID: "",
    filaNome: "",
    layoutID: "",
    layoutNome: "",
    posicaoID: "",
    posicaoNome: "",
    veiculoID: "",
  };

  modoOperacao: number;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  
  @ViewChild("chassiInput") chassiInput;
  formControlChassi = new FormControl("");

  constructor(
    public http: HttpClient,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.title = "RECEBER / PARQUEAR";
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
              this.buscarChassi(chassi, false);
              this.chassi = "";
            }, 500);
          }
        }
      }
    });
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter ModalReceberParquearComponent");
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
  }

  ionViewWillLoad() {
    if (this.navParam.get("data")) {
      this.dadosParqueamento = this.navParam.get("data");
    }
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        this.chassiInput.setFocus();
      }, 1000);
    }
    this.chassi = "";
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: "",
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
        let data = "Erro de qr code!";
        this.openModalErro(data, true);
      }
    );
  }

  buscarChassi(partChassi, byScanner: boolean) {
    this.authService.showLoading();

    this.http
      .get(
        this.url +
          "/ReceberParquear/BuscarChassi?token=" +
          this.authService.getToken() +
          "&partChassi=" +
          partChassi
      )
      .subscribe(
        (resultado) => {
          this.responseData = {};
          this.responseData = resultado;

          if (this.responseData.sucesso) {
            this.consultarChassi(this.responseData.retorno, byScanner);

            this.authService.hideLoading();
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
        },
        (error) => {
          this.authService.hideLoading();
          this.openModalErro(
            error.status + " - " + error.statusText,
            byScanner
          );
          console.log(error);
        }
      );
  }

  consultarChassi(chassi, byScanner: boolean) {
    this.authService.showLoading();

    this.http
      .get(
        this.url +
          "/ReceberParquear/ConsultarChassi?token=" +
          this.authService.getToken() +
          "&chassi=" +
          chassi
      )
      .subscribe(
        (resultado) => {
          this.response = resultado;

          if (this.response.sucesso) {
            this.dadosParqueamento.veiculoID = this.response.retorno["id"];
            this.view.dismiss();
            this.authService.hideLoading();

            this.openFormReceberParquear(this.dadosParqueamento, byScanner);
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.response.mensagem, byScanner);
          }
        },
        (error) => {
          this.authService.hideLoading();
          this.openModalErro(
            error.status + " - " + error.statusText,
            byScanner
          );
          console.log(error);
        }
      );
    this.authService.hideLoading();
  }

  openFormReceberParquear(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(FormReceberParquearComponent, {
      data: data,
    });
    chassiModal.present();
    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  openChassiReceberParquear(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(
      ModalChassiReceberParquearComponent,
      { data: data }
    );
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
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

  openModalSucesso(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
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

  toRecebimento() {
    this.navCtrl.push(RecebimentoPage);
  }

  toMovimentacao() {
    this.navCtrl.push(MovimentacaoPage);
  }

  toCarregamento() {
    this.navCtrl.push(CarregamentoPage);
  }

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };
}
