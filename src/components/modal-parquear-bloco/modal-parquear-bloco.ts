import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController,
  TextInput
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { ModalChassiReceberParquearComponent } from "../../components/modal-chassi-receber-parquear/modal-chassi-receber-parquear";
import { MovimentacaoPage } from "../../pages/movimentacao/movimentacao";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import { FormParquearBlocoComponent } from "../../components/form-parquear-bloco/form-parquear-bloco";
import * as $ from "jquery";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";

@Component({
  selector: "modal-parquear-bloco",
  templateUrl: "modal-parquear-bloco.html"
})
export class ModalParquearBlocoComponent {
  title: string;
  chassi: string;
  veiculoID: string;
  options: BarcodeScannerOptions;
  qrCodeText: string;
  url: string;
  responseData: any;
  response: any;
  ligado: boolean;
  dadosParquearBloco: any = {
    bolsaoID: "",
    bolsaoNome: "",
    filaID: "",
    filaNome: "",
    layoutID: "",
    layoutNome: "",
    posicaoID: "",
    posicaoNome: "",
    veiculoID: ""
  };

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
    this.title = "PARQUEAR/BLOCO";
    this.url = this.authService.getUrl();

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
    console.log("ionViewDidEnter ModalParquearBlocoComponent");
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
  }

  ionViewWillLoad() {
    if (this.navParam.get("data")) {
      this.dadosParquearBloco = this.navParam.get("data");
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

  buscarChassi(partChassi, byScanner) {
    let BuscarChassi =
      this.url +
      "/ParquearBloco/BuscarChassi?token=" +
      this.authService.getToken() +
      "&partChassi=" +
      partChassi;

    this.authService.showLoading();

    this.http.get(BuscarChassi).subscribe(
      res => {
        this.responseData = "";
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
      error => {
        this.authService.hideLoading();
        this.openModalErro(error.status + " - " + error.statusText, byScanner);
      }
    );
  }

  ConsultarChassi(chassi, byScanner: boolean) {
    this.authService.showLoading();

    let ConsultarChassi =
      this.url +
      "/ParquearBloco/ConsultarChassi?token=" +
      this.authService.getToken() +
      "&chassi=" +
      chassi;

    this.http.get(ConsultarChassi).subscribe(
      res => {
        this.responseData = "";
        this.responseData = res;

        if (this.responseData.sucesso) {
          this.dadosParquearBloco.veiculoID = this.responseData.retorno["id"];
          this.view.dismiss();

          this.openFormParquearBloco(this.dadosParquearBloco, byScanner);
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem, byScanner);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(error.status + " - " + error.statusText, byScanner);
      }
    );

    this.authService.hideLoading();
  }

  openFormParquearBloco(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(FormParquearBlocoComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.cleanInput(byScanner);
    });
  }

  openChassiReceberParquear(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(
      ModalChassiReceberParquearComponent,
      { data: data }
    );
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
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

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };
}
