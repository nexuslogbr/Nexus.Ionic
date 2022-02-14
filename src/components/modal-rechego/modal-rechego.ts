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
import { FormRechegoComponent } from "../../components/form-rechego/form-rechego";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
import { FormControl } from "@angular/forms";

@Component({
  selector: "modal-rechego",
  templateUrl: "modal-rechego.html",
})
export class ModalRechegoComponent {
  title: string;
  chassi: string;
  veiculoID: string;
  options: BarcodeScannerOptions;
  qrCodeText: string;
  url: string;
  responseData: any;
  response: any;
  ligado: boolean;
  dadosRechego: any = {
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
    this.title = "RECHEGO";
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
    console.log("ionViewDidEnter ModalRechegoComponent");
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
  }

  ionViewWillLoad() {
    if (this.navParam.get("data")) {
      this.dadosRechego = this.navParam.get("data");
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

        this.ConsultarChassi(this.qrCodeText, true);
      },
      (err) => {
        this.authService.hideLoading();
        let data = "Erro de qr code!";
        this.openModalErro(data, true);
      }
    );
  }

  buscarChassi(partChassi, byScanner: boolean) {
    let buscarChassi =
      this.url +
      "/Rechego/BuscarChassi?token=" +
      this.authService.getToken() +
      "&partChassi=" +
      partChassi;

    this.authService.showLoading();

    this.http.get(buscarChassi).subscribe(
      (res) => {
        this.responseData = res;

        console.log(this.responseData);

        if (this.responseData.sucesso) {
          // this.view.dismiss();

          this.ConsultarChassi(this.responseData.retorno, byScanner);

          // this.openChassiReceberParquear(this.responseData.retorno);

          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem, byScanner);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem, byScanner);
      }
    );
  }
  ConsultarChassi(chassi, byScanner: boolean) {
    this.authService.showLoading();

    let consultarChassi =
      this.url +
      "/Rechego/ConsultarChassi?token=" +
      this.authService.getToken() +
      "&chassi=" +
      chassi;

    this.http.get(consultarChassi).subscribe(
      (res) => {
        this.response = res;

        if (this.response.sucesso) {
          this.dadosRechego.veiculoID = this.response.retorno["id"];
          this.view.dismiss();

          this.openFormReceberParquear(this.dadosRechego, byScanner);
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.response.mensagem, byScanner);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(this.response.mensagem, byScanner);
      }
    );
    this.authService.hideLoading();
  }

  openFormReceberParquear(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(FormRechegoComponent, {
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
