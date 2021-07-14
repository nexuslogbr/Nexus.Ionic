import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  Modal,
  ModalController,
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { HomePage } from "../home/home";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { ModalReceberParquearComponent } from "../../components/modal-receber-parquear/modal-receber-parquear";
import { RomaneioPage } from "../../pages/romaneio/romaneio";
import { MovimentacaoPage } from "../../pages/movimentacao/movimentacao";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import { Select } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import * as $ from "jquery";

@Component({
  selector: "page-receber-parquear",
  templateUrl: "receber-parquear.html",
})
export class ReceberParquearPage {
  @ViewChild("select1") select1: Select;
  @ViewChild("select2") select2: Select;
  @ViewChild("select3") select3: Select;
  @ViewChild("select4") select4: Select;

  title: string;
  url: string;
  bolsoes: any;
  filas: any;
  layouts: any;
  bolsao: string;
  fila: string;
  posicao: string;
  receberParquear: any = {
    layoutID: "",
    layoutNome: "",
    bolsaoID: "",
    bolsaoNome: "",
    filaID: "",
    filaNome: "",
    posicaoID: "",
    posicaoNome: "",
  };
  posicoes: any;
  bolsaoFila: any = {
    bolsao: "",
    fila: "",
  };
  count: number;
  layoutLoaded: string;
  responseData: any;

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.title = "RECEBER / PARQUEAR";
    console.log("ReceberParquearPage");
    this.url = this.authService.getUrl();
  }
  ionViewDidEnter() {
    this.ListarLayout();
  }
  onLayoutChange(layout) {
    this.bolsoes = null;
    this.filas = null;
    this.posicoes = null;

    this.ListarBolsao(layout);
    this.receberParquear.layoutID = layout;
    this.receberParquear.layoutNome = this.select1.text;
    console.log(this.receberParquear);
    this.count = 1;
  }
  onBolsaoChange(bolsaoId) {
    this.filas = null;
    this.posicoes = null;

    this.bolsao = bolsaoId;
    this.ListarFila(bolsaoId);
    this.receberParquear.bolsaoID = bolsaoId;
    this.receberParquear.bolsaoNome = this.select2.text;

    this.count = 2;
  }
  onFilaChange(fila) {
    this.fila = fila;
    this.receberParquear.filaID = fila;
    this.receberParquear.filaNome = this.select3.text;
    this.authService.setLayout(this.receberParquear);
    this.ListarPosicoes(this.fila);

    this.count = 3;
  }

  onPosicaoChange(posicao) {
    this.posicao = posicao;
    this.receberParquear.posicaoID = posicao;
    this.receberParquear.posicaoNome = this.select4.text;
    this.authService.setPosicao(this.posicao);
    this.count = 4;
  }

  avancar() {
    if (this.receberParquear.posicaoID != "") {
      this.count = 0;
      this.openModalQrCode(this.receberParquear);
    } else {
      this.openModalErro("Campos inválidos ou em branco.");
    }
  }

  ListarLayout() {
    this.authService.showLoading();

    this.http
      .get(
        this.url +
          "/ReceberParquear/ListarLayouts?token=" +
          this.authService.getToken()
      )
      .subscribe(
        (resultado) => {
          this.responseData = resultado;

          if (this.responseData.sucesso) {
            this.authService.hideLoading();

            //PREENCHER O SELECT DO LAYOUT
            this.layouts = this.responseData.retorno;
            this.authService.hideLoading();
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {
          this.authService.hideLoading();
          this.openModalErro(
            "Erro ao carregar o layout, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }

  ListarBolsao(layout) {
    this.authService.showLoading();

    this.http
      .get(
        this.url +
          "/ReceberParquear/ListarBolsoes?token=" +
          this.authService.getToken() +
          "&layoutID=" +
          layout
      )
      .subscribe(
        (resultado) => {
          this.responseData = {};
          this.responseData = resultado;

          if (this.responseData.sucesso) {
            this.authService.hideLoading();

            //PREENCHER O SELECT DO Bolsão
            this.bolsoes = this.responseData.retorno;
            this.authService.hideLoading();
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {
          this.authService.hideLoading();
          this.openModalErro(
            "Erro ao carregar o bolsão, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }

  ListarPosicoes(linhaID) {
    this.authService.showLoading();

    this.http
      .get(
        this.url +
          "/ReceberParquear/ListarPosicoes?token=" +
          this.authService.getToken() +
          "&linhaID=" +
          linhaID
      )
      .subscribe(
        (resultado) => {
          this.responseData = {};
          this.responseData = resultado;

          if (this.responseData.sucesso) {
            this.authService.hideLoading();

            if (this.responseData["retorno"] != "") {
              console.log("há vagas livres.");
              //PREENCHER O SELECT DO Bolsão
              this.posicoes = this.responseData.retorno;
              this.authService.hideLoading();
            } else {
              this.openModalErro("Não há vagas livres.");
              console.log("Não há vagas livres.");

              this.ListarFila(this.receberParquear.bolsaoID);
            }
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {
          this.authService.hideLoading();
          this.openModalErro(
            "Erro ao carregar as vagas, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }

  ListarFila(bolsao) {
    this.authService.showLoading();

    this.http
      .get(
        this.url +
          "/ReceberParquear/ListarLinhas?token=" +
          this.authService.getToken() +
          "&bolsaoID=" +
          bolsao
      )
      .subscribe(
        (resultado) => {
          this.responseData = {};
          this.responseData = resultado;

          if (this.responseData.sucesso) {
            this.authService.hideLoading();

            //PREENCHER O SELECT DO Bolsão
            this.filas = this.responseData.retorno;
            this.authService.hideLoading();
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {
          this.authService.hideLoading();
          this.openModalErro(
            "Erro ao carregar as filas, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }

  openModalQrCode(data) {
    const chassiModal: Modal = this.modal.create(
      ModalReceberParquearComponent,
      { data: data }
    );
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {});
    chassiModal.onWillDismiss((data) => {});
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    });
    chassiModal.onWillDismiss((data) => {
      console.log("data");
      console.log(data);
    });
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    });
    chassiModal.onWillDismiss((data) => {
      console.log("data");
      console.log(data);
    });
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
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

  toRomaneio() {
    this.navCtrl.push(RomaneioPage);
  }

  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }
  
  isEmpty(obj) {
    for (var x in obj) {
      if (obj.hasOwnProperty(x)) return false;
    }
    return true;
  }
}
