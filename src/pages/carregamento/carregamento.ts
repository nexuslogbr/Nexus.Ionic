import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController
} from "ionic-angular";
import { CarregamentoListComponent } from "../../components/carregamento-list/carregamento-list";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { RomaneioPage } from "../../pages/romaneio/romaneio";
import { MovimentacaoPage } from "../../pages/movimentacao/movimentacao";
import { ReceberParquearPage } from "../../pages/receber-parquear/receber-parquear";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";
import { CarregamentoCanceladoPage } from "../../pages/carregamento-cancelado/carregamento-cancelado";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import * as $ from "jquery";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "page-carregamento",
  templateUrl: "carregamento.html"
})
export class CarregamentoPage {
  formData = {
    data: ""
  };
  responseData: any;
  url: string;
  urlListarCarregamentos: string;
  title: string;
  parametros: any;
  retorno: any;

  carregamentos: any;


  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;


  // dataRetorno =  {
  //   dataErro: "",
  //   mensagem: "",
  //   retorno: {},
  //   sucesso: false,
  //   tipo: 0,
  //   urlRedirect: ""
  // }
  constructor(
    public httpClient: HttpClient,
    private modal: ModalController,
    public authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.title = "CARREGAMENTO";


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
  }

  ionViewWillEnter() {
    // Limpa a informação dos carregamentos.
    this.carregamentos = {
      previstos: [],
      conferidos: [],
      emCarregamento: [],
      carregados: [],
      dados: "",
      data: ""
    };

    this.formData.data = null;

    //this.formData.data = new Date().toISOString();
    this.url = this.authService.getUrl();
    console.log("CarregamentoPage ionViewWillEnter");
  }

  gotoCarregamentosCancelados() {
    this.navCtrl.push(CarregamentoCanceladoPage, { data: this.formData.data });
  }

  ///
  listarCarregamentos() {
    this.authService.showLoading();
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosPrevistos?token=" +
      this.authService.getToken() +
      "&data=" +
      this.formData.data;

    this.httpClient.get<dataRetorno>(carregamentosPrevistos).subscribe(
      res => {
        let data = res;

        //console.log(res);
        if (data.sucesso) {
          this.carregamentos.previstos = data.retorno;
          this.carregamentos.data = this.formData.data;
        }
        this.listarCarregamentosConferidos();
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status + " - " + err.statusText);
        console.log(err);
      }
    );
  }

  listarCarregamentosConferidos() {
    let carregamentosConferidos =
      this.url +
      "/Carregar/ListarCarregamentosConferidos?token=" +
      this.authService.getToken() +
      "&data=" +
      this.formData.data;

    this.httpClient.get<dataRetorno>(carregamentosConferidos).subscribe(
      res => {
        let data = res;
        //console.log(res);
        if (data.sucesso) {
          this.carregamentos.conferidos = data.retorno;
        }
        this.listarCarregamentosEmCarregamento();
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status + " - " + err.statusText);
        console.log(err);
      }
    );
  }

  listarCarregamentosEmCarregamento() {
    let emCarregamento =
      this.url +
      "/Carregar/ListarCarregamentosEmCarregamento?token=" +
      this.authService.getToken() +
      "&data=" +
      this.formData.data;

    this.httpClient.get<dataRetorno>(emCarregamento).subscribe(
      res => {
        let data = res;
        //console.log(res);
        if (data.sucesso) {
          this.carregamentos.emCarregamento = data.retorno;
        }
        this.listarCarregamentosCarregados();
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status + " - " + err.statusText);
        console.log(err);
      }
    );
  }

  listarCarregamentosCarregados() {
    this.authService.showLoading();
    let carregados =
      this.url +
      "/Carregar/ListarCarregamentosCarregados?token=" +
      this.authService.getToken() +
      "&data=" +
      this.formData.data;

    this.httpClient.get<dataRetorno>(carregados).subscribe(
      res => {
        let data = res;
        //console.log(res);
        if (data.sucesso) {
          this.carregamentos.carregados = data.retorno;
        }
        this.authService.hideLoading();

        this.navCtrl.push(CarregamentoListComponent, {
          data: this.carregamentos
        });
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status + " - " + err.statusText);
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

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      //console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      //console.log("data");
      //console.log(data);
    });
  }

  toParqueamento() {
    //this.navCtrl.push(ParqueamentoPage);
    this.navCtrl.setRoot(ParqueamentoPage);
  }

  toRecebimento() {
    this.navCtrl.setRoot(RecebimentoPage);
    //this.navCtrl.push(RecebimentoPage);
  }

  toMovimentacao() {
    this.navCtrl.setRoot(MovimentacaoPage);
    //this.navCtrl.push(MovimentacaoPage);
  }

  toCarregamento() {
    this.navCtrl.setRoot(CarregamentoPage);
    //this.navCtrl.push(CarregamentoPage);
  }

  toParqueamentoExport() {
    this.navCtrl.setRoot(ReceberParquearPage);
    //this.navCtrl.push(ReceberParquearPage);
  }

  toRomaneio() {
    this.navCtrl.setRoot(RomaneioPage);
    //this.navCtrl.push(RomaneioPage);
  }

  toCarregamentoExport() {
    this.navCtrl.setRoot(CarregamentoExportPage);
    //this.navCtrl.push(CarregamentoExportPage);
  }
}

interface dataRetorno {
  dataErro: string;
  mensagem: string;
  retorno: any;
  sucesso: boolean;
  tipo: number;
  urlRedirect: string;
}
