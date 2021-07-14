import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Modal
} from "ionic-angular";
import { MovimentacaoPage } from "../../pages/movimentacao/movimentacao";
import { ReceberParquearPage } from "../../pages/receber-parquear/receber-parquear";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import { FormRecebimentoComponent } from "../../components/form-recebimento/form-recebimento";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { AuthService } from "../../providers/auth-service/auth-service";
import { HttpClient } from "@angular/common/http";
import * as $ from "jquery";
import { DataService } from "../../providers/data-service";
import { Veiculo } from "../../model/veiculo";

@Component({
  selector: "page-carregamento-cancelado",
  templateUrl: "carregamento-cancelado.html"
})
export class CarregamentoCanceladoPage {
  chassis: any;
  title: string;
  private url: string;
  qrCodeText: string;
  formData = { chassi: "" };
  formParqueamentoData = {
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
  responseData2: any;
  data: any;

  constructor(
    private http: HttpClient,
    private modal: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private dataService: DataService
  ) {
    this.title = "Carregamentos Cancelados";
    this.url = this.authService.getUrl();
    console.log('data', this.data);
  }

  ionViewDidLoad() {
    console.log("CarregamentoCanceladoPage ionViewDidEnter");
  }

  ionViewWillEnter() {
    console.log("CarregamentoCanceladoPage ionViewDidEnter");
    this.data = this.navParams.get('data');
    console.log('this.data', this.data);
    this.authService.showLoading();
    this.dataService.carregarVeiculosCancelados(this.data).subscribe(
      data => {
        this.authService.hideLoading();
        //console.log("data", data);
        if (data.sucesso) {
          this.chassis = data.retorno;

          // if (!data.retorno) {
          //   var modalData = {
          //     iconClass: "icon-sucesso",
          //     message: "Não existem chasis cancelados"
          //   };
          //   this.openModalErro(modalData);
          // }
        }
      },
      error => {
        this.authService.hideLoading();
        console.log("error", error);
      }
    );
    // this.chassis = [
    //   {
    //     id: "01",
    //     chassi: "8AGBN69S0HR101133"
    //   },
    //   {
    //     id: "02",
    //     chassi: "8AGBN69S0HR101134"
    //   },
    //   {
    //     id: "03",
    //     chassi: "8AGBN69S0HR101135"
    //   },
    //   {
    //     id: "04",
    //     chassi: "8AGBN69S0HR101136"
    //   }
    // ];
  }

  voltar() {
    //this.navCtrl.push(CarregamentoPage);
    this.navCtrl.pop();
  }

  carregarChassi(event: any, veiculo: Veiculo) {
    //console.log(event.target.value);
    //console.log("veiculo", veiculo);
    //this.ConsultarChassi(event.target.value);
    this.consultarChassi(veiculo.chassi);
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

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  consultarChassi(chassi: string) {
    let url =
      this.url +
      "/Parquear/ConsultarChassi?token=" +
      this.authService.getToken() +
      "&chassi=" +
      chassi;
    this.formParqueamentoData.chassi = chassi;

    this.authService.showLoading();

    this.formParqueamentoData.token = this.authService.getToken();
    this.formParqueamentoData.local = this.authService.getLocalAtual();

    this.http.get(url).subscribe(
      res => {
        this.responseData = res;

        if (this.responseData.sucesso) {
          this.formParqueamentoData.id = this.responseData.retorno["id"];

          // let urlServico =
          //   this.url +
          //   "/Parquear/ListarLayouts?token=" +
          //   this.authService.getToken();

          // this.http.get(urlServico).subscribe(
          //   data => {
          //     this.responseData2 = data;
          //     if (this.responseData2.sucesso) {
          //       //PREENCHER O SELECT DO LAYOUT
          //       this.formParqueamentoData.layout = this.responseData2.retorno;
          //       this.authService.hideLoading();

          //       this.formParqueamentoData.local = this.authService.getLocalAtual();

          //       this.openModalRecebimento(this.formParqueamentoData);
          //     } else {
          //       this.authService.hideLoading();
          //       this.openModalErro(this.responseData2.mensagem);
          //     }
          //   },
          //   error => {
          //     this.authService.hideLoading();
          //     this.openModalErro(this.responseData.mensagem);
          //   }
          // );

          this.dataService.consultarLayoutsDisponiveis().subscribe(
            data => {
              this.responseData2 = data;
              if (this.responseData2.sucesso) {
                //PREENCHER O SELECT DO LAYOUT
                this.formParqueamentoData.layout = this.responseData2.retorno;
                this.authService.hideLoading();

                this.formParqueamentoData.local = this.authService.getLocalAtual();

                this.openModalRecebimento(this.formParqueamentoData);
              } else {
                this.authService.hideLoading();
                this.openModalErro(this.responseData2.mensagem);
              }
            },
            error => {
              this.authService.hideLoading();
              this.openModalErro(this.responseData.mensagem);
            }
          );

        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(error);
      }
    );
  }

  openModalRecebimento(data) {
    const recModal: Modal = this.modal.create(FormRecebimentoComponent, {
      data: data
    });
    recModal.present();

    recModal.onDidDismiss(data => {
      console.log(data);
    });
    recModal.onWillDismiss(data => {
      console.log("data");
      console.log(data);
    });
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      console.log("data");
      console.log(data);
    });
  }
}
