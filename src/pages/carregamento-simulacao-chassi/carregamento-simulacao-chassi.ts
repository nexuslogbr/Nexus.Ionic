import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Modal,
  ModalController
} from "ionic-angular";
import * as $ from "jquery";
import { AuthService } from "../../providers/auth-service/auth-service";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { HttpClient } from "@angular/common/http";
import { ModalRecebimentoComponent } from "../../components/modal-recebimento/modal-recebimento";
import { CarregamentoSimulacaoLeituraPage } from "../carregamento-simulacao-leitura/carregamento-simulacao-leitura";

@Component({
  selector: "page-carregamento-simulacao-chassi",
  templateUrl: "carregamento-simulacao-chassi.html"
})
export class CarregamentoSimulacaoChassiPage {
  title: string;
  qrCodeText: string;
  formRecebimentoData = {
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
  responseData: any;
  responseCarData: any;
  formData = { chassi: "" };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    private navParams: NavParams,
    private http: HttpClient
  ) {
    this.title = "Simulacação";
    this.formData.chassi = '';
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CarregamentoSimulacaoChassiPage");
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  scan() {
    let options: BarcodeScannerOptions = {
      showTorchButton: true,
      prompt: "",
      resultDisplayDuration: 0
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(options).then(
      barcodeData => {
        this.qrCodeText = barcodeData.text;
        this.consultarChassi(this.qrCodeText);
      },
      err => {
        this.authService.hideLoading();
        let data = "Erro de QRCode!";

        const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
          data: err
        });
        chassiModal.present();

        chassiModal.onDidDismiss(data => {
          console.log("data", data);
        });

        chassiModal.onWillDismiss(data => {
          console.log("data", data);
        });
      }
    );
  }

  consultarChassi(chassi) {
    let consultarChassi =
      "/Receber/ConsultarChassi?token=" +
      this.authService.getToken() +
      "&chassi=" +
      chassi;

    console.log("chassi", chassi);
    this.formRecebimentoData.chassi = chassi;
    this.authService.showLoading();
    this.formRecebimentoData.token = this.authService.getToken();
    this.http.get(this.authService.getUrl() + consultarChassi).subscribe(
      res => {
        this.responseData = res;
        console.log(this.responseData);

        if (this.responseData.sucesso) {
          // this.authService.getChassiData(this.responseData);
          // alert(this.responseData.mensagem);
          console.log(this.responseData.retorno);
          this.formRecebimentoData.id = this.responseData.retorno["id"];
          let receberVeiculo =
            "/Receber/ReceberVeiculo?token=" +
            this.authService.getToken() +
            "&veiculoID=" +
            this.responseData.retorno["id"];
          this.http.get(this.authService.getUrl() + receberVeiculo).subscribe(
            res => {
              this.responseCarData = res;
              console.log(this.responseCarData)


              if (this.responseCarData.sucesso) {


                // this.authService.getChassiData(this.responseCarData.retorno);
                console.log(this.responseCarData);
                this.authService.hideLoading();
                this.openModalRecebimento(this.formRecebimentoData);
              } else {
                this.authService.hideLoading();
console.log('mostra erro')
console.log(this.responseData.mensagem)
                this.openModalErro(this.responseData.mensagem);
              }
            },
            error => {
              this.authService.hideLoading();
              this.openModalErro(error.status + " - " + error.statusText);
              console.log(error);
            }
          );
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(error.status + " - " + error.statusText);
        console.log(error);
      }
    );
  }

  openModalRecebimento(data) {
    const recModal: Modal = this.modal.create(ModalRecebimentoComponent, {
      data: data
    });
    recModal.present();

    recModal.onDidDismiss(data => {
      console.log("data", data);
    });

    recModal.onWillDismiss(data => {
      console.log("data", data);
    });
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();
    chassiModal.onDidDismiss(data => {
      console.log("data", data);
    });
    chassiModal.onWillDismiss(data => {
      console.log("data", data);
    });
  }

  inserirChassi() {
    this.navCtrl.push(CarregamentoSimulacaoLeituraPage);
  }
}
