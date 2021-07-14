import { Component, Input } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { CarregamentoResumoComponent } from "../../components/carregamento-resumo/carregamento-resumo";
import { CarregamentoConsultaComponent } from "../../components/carregamento-consulta/carregamento-consulta";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { RampaFilaComponent } from "../../components/rampa-fila/rampa-fila";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { DragulaService } from "ng2-dragula";
import { HttpClient, HttpHeaders } from "@angular/common/http";
//import * as moment from "moment";
import * as $ from "jquery";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import { DataService } from "../../providers/data-service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Component({
  selector: "carregamento-list",
  templateUrl: "carregamento-list.html",
  providers: [DragulaService]
})
export class CarregamentoListComponent {
  @Input() rampaFila: any;

  title: string;
  url: string;
  tipoCarregamento: string;
  carregamentos = {
    previstos: {},
    conferidos: {},
    emCarregamento: {},
    carregados: {},
    data: ""
  };
  previstos: any;
  carregados: any;
  conferidos: any;
  emCarregamento: any;

  previstoTrue: boolean;
  carregadoTrue: boolean;
  conferidoTrue: boolean;
  emCarregamentoTrue: boolean;

  dataRomaneio: string;

  // Estrutura de dados populada durante o drag...
  RampaFila = {
    romaneioID: 0,
    romaneioDetalheID: 0,
    rampaID: 0,
    filaID: 0,
    tipoCarregamento: "",
    data: ""
  };

  constructor(
    public http: HttpClient,
    private dragulaService: DragulaService,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public authService: AuthService,
    public navCtrl: NavController,
    private dataService: DataService
  ) {
    this.title = "CARREGAMENTO";

    dragulaService.setOptions("nested-bag", {
      accepts: function(el, target, source) {
        if (!el.classList.contains("not-draggable")) {
          if (
            el.classList.contains("source-conferido") &&
            target.classList.contains("target-emCarregamento")
          ) {
            return true;
          } else if (
            el.classList.contains("source-previsto") &&
            target.classList.contains("target-conferido")
          ) {
            return true;
          } else if (
            el.classList.contains("source-emCarregamento") &&
            target.classList.contains("target-carregado")
          ) {
            return true;
          }
        }
        return false;
      }
    });

    this.url = this.authService.getUrl();

    dragulaService.drag.subscribe(value => {
      this.onDrag(value.slice(1));
    });

    dragulaService.drop.subscribe(value => {
      // console.log("---------->");
      // console.log("dragulaService.drop.subscribe chamado!!");
      // console.log("drop.this", this);
      // console.log("drop.value", value);
      console.log("this.RampaFila", this.RampaFila);

      this.onDrop(value.slice(1));

      if (this.RampaFila.tipoCarregamento == "previsto") {
        const chassiModal: Modal = this.modal.create(RampaFilaComponent, {
          data: this.RampaFila
        });
        chassiModal.present();

        chassiModal.onDidDismiss(data => {
          console.log("onDidDismiss.data", data);
          if (data == "sucesso") {
            this.salvarEmConferencia(
              this.RampaFila.romaneioID,
              this.RampaFila.romaneioDetalheID
            );
          } else {
            this.listarCarregamentosPrevistos();
          }
          this.limpaRampaFila();
        });
      } else if (this.RampaFila.tipoCarregamento == "emCarregamento") {
        //console.log("conferido");
        //console.log(this.RampaFila);
        this.CarregamentoResumo(
          this.RampaFila.romaneioDetalheID,
          this.RampaFila.romaneioID
        );
      } else if (this.RampaFila.tipoCarregamento == "conferido") {
        //console.log("conferido");
        //console.log(this.RampaFila);
        this.salvarEmCarregamento(
          this.RampaFila.romaneioID,
          this.RampaFila.romaneioDetalheID
        );
      }
    });
  }

  ionViewWillEnter() {
    console.log("find:", this.dragulaService.find("nested-bag"));
    console.log("CarregamentoListComponent ionViewWillEnter");
    //console.log("this.carregamntos", this.carregamentos);
    this.authService.hideLoading();
  }

  ionViewDidLoad() {
    console.log("CarregamentoListComponent ionViewDidLoad");
    const dados = this.navParam.get("data");
    this.carregamentos = dados;
    this.previstos = this.carregamentos.previstos;
    this.conferidos = this.carregamentos.conferidos;
    this.emCarregamento = this.carregamentos.emCarregamento;
    this.carregados = this.carregamentos.carregados;

    this.verificarCarregamentos();
  }

  verificarCarregamentos() {
    if (this.previstos.length > 0) {
      this.previstoTrue = false;
      //console.log(this.previstos.length);
    } else {
      this.previstoTrue = true;
      //console.log(this.previstos.length);
    }

    if (this.conferidos.length > 0) {
      this.conferidoTrue = false;
      //console.log(this.conferidos.length);
    } else {
      this.conferidoTrue = true;
      //console.log(this.conferidos.length);
    }

    if (this.emCarregamento.length > 0) {
      this.emCarregamentoTrue = false;
      //console.log(this.emCarregamento.length);
    } else {
      this.emCarregamentoTrue = true;
      //console.log(this.emCarregamento.length);
    }

    if (this.carregados.length > 0) {
      this.carregadoTrue = false;
      //console.log(this.carregados.length);
    } else {
      this.carregadoTrue = true;
      //console.log(this.carregados.length);
    }
  }

  salvarEmConferencia(romaneioID, romaneioDetalheID) {
    console.log("salvarEmConferencia");
    this.authService.showLoading();
    this.dataService
      .salvarCarregamentoEmConferencia(romaneioID, romaneioDetalheID)
      .subscribe(
        res => {
          let data = res;

          if (data.sucesso) {
            this.listarCarregamentosPrevistos();
          } else {
            this.authService.hideLoading();
            this.openModalErro(data.mensagem);
          }
        },
        error => {
          this.openModalErro(error.status + " - " + error.statusText);
          this.authService.hideLoading();
          console.log(error);
        }
      );
  }

  salvarEmCarregamento(romaneioID, romaneioDetalheID) {

    this.authService.showLoading();

    // let url =
    //   this.url +
    //   "/Carregar/EmCarregamento?token=" +
    //   this.authService.getToken() +
    //   "&romaneioID=" +
    //   romaneioID +
    //   "&romaneioDetalheID=" +
    //   romaneioDetalheID;

    this.dataService
      .salvarEmCarregamento(romaneioID, romaneioDetalheID)
      .subscribe(
        res => {
          let data = res;

          if (data.sucesso) {
            this.listarCarregamentosPrevistos();
          } else {
            this.authService.hideLoading();
            this.openModalErro(data.mensagem);
          }
        },
        error => {
          this.openModalErro(error.status + " - " + error.statusText);
          this.authService.hideLoading();
          console.log(error);
        }
      );
  }

  configuraSelecionado(indice, romaneio, tipoCarregamento) {
    //console.log('configuraSelecionado', indice, romaneio, tipoCarregamento);
    this.RampaFila.romaneioID = romaneio.romaneioID;
    this.RampaFila.romaneioDetalheID = romaneio.id;
    this.RampaFila.tipoCarregamento = tipoCarregamento;
    this.tipoCarregamento = tipoCarregamento;
  }

  // // Processa o evento de drag quando um elemento de Carregado ou Previsto é selecionado.
  // Previsto(indice, romaneio, tipoCarregamento) {
  //   this.RampaFila.romaneioID = romaneio.romaneioID;
  //   this.RampaFila.romaneioDetalheID = romaneio.id;
  //   this.RampaFila.tipoCarregamento = tipoCarregamento;
  //   this.tipoCarregamento = "previsto";
  // }

  // // Processa o evento de drag quando um elemento de EmCarregamento é selecionado.
  // EmCarregamento(indice, romaneio, tipoCarregamento) {
  //   console.log('EmCarregamento', indice, romaneio, tipoCarregamento);
  //   this.RampaFila.romaneioID = romaneio.romaneioID;
  //   this.RampaFila.romaneioDetalheID = romaneio.id;
  //   this.RampaFila.tipoCarregamento = tipoCarregamento;
  //   this.tipoCarregamento = "emCarregamento";
  // }

  // // Processa o evento de drag quando um elemento de Conferido é selecionado.
  // Conferido(indice, romaneio, tipoCarregamento) {
  //   this.RampaFila.romaneioID = romaneio.romaneioID;
  //   this.RampaFila.romaneioDetalheID = romaneio.id;
  //   this.RampaFila.tipoCarregamento = tipoCarregamento;
  //   this.tipoCarregamento = "conferido";
  // }

  CarregamentoResumoConferido(id, romaneioID, conferido) {
    // console.log(id);
    // console.log(romaneioID);
    // console.log(status);
    this.authService.showLoading();
    let consultarRomaneio =
      this.url +
      "/Carregar/ConsultarRomaneio?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      romaneioID +
      "&romaneioDetalheID=" +
      id;

    this.http.get<dataRetorno>(consultarRomaneio, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          data.retorno.conferido = true;
          console.log(data.retorno);
          this.navCtrl.push(CarregamentoResumoComponent, {
            data: data.retorno,
            isConferencia: true
          });
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  CarregamentoConsultaResumo(id, romaneioID) {
    console.log(id);
    console.log(romaneioID);
    console.log(status);
    this.authService.showLoading();
    let consultarRomaneio =
      this.url +
      "/Carregar/ConsultarRomaneio?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      romaneioID +
      "&romaneioDetalheID=" +
      id;

    this.http.get<dataRetorno>(consultarRomaneio, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.navCtrl.push(CarregamentoConsultaComponent, {
            data: data.retorno
          });
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  CarregamentoResumo(romaneioDetalheId, romaneioID) {
    console.log(romaneioDetalheId);
    console.log(romaneioID);
    this.authService.showLoading();
    let consultarRomaneio =
      this.url +
      "/Carregar/ConsultarRomaneio?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      romaneioID +
      "&romaneioDetalheID=" +
      romaneioDetalheId;

    this.http.get<dataRetorno>(consultarRomaneio, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.navCtrl.push(CarregamentoResumoComponent, {
            data: data.retorno
          });
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  private onDrag(args) {
    console.log("onDrag.args", args);
  }
  private onDrop(args) {
    console.log("onDrop.args", args);
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  voltar() {
    //this.dragulaService.find('nested-bag').drake.destroy();
    const data = {};
    this.view.dismiss();
    this.navCtrl.push(CarregamentoPage);
  }

  openCarregamentoResumo(data) {
    const chassiModal: Modal = this.modal.create(CarregamentoResumoComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.listarCarregamentosPrevistos();
    });
    chassiModal.onWillDismiss(data => {});
  }

  openRampaFila(id, romaneioID) {
    //console.log(id + " - " + romaneioID);
    this.RampaFila.romaneioID = romaneioID;
    this.RampaFila.romaneioDetalheID = id;
    const chassiModal: Modal = this.modal.create(RampaFilaComponent, {
      data: this.RampaFila
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      //console.log('onDidDismiss.data', data);
      // if (data != "cancelado") {
      //   this.listarCarregamentosPrevistos();
      // }

      if (data == "sucesso") {
        this.salvarEmConferencia(
          this.RampaFila.romaneioID,
          this.RampaFila.romaneioDetalheID
        );
      } else {
        this.listarCarregamentosPrevistos();
      }
      this.limpaRampaFila();
    });
  }

  limpaRampaFila() {
    this.RampaFila = {
      romaneioID: 0,
      romaneioDetalheID: 0,
      rampaID: 0,
      filaID: 0,
      tipoCarregamento: "",
      data: ""
    };
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

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }

  listarCarregamentosPrevistos() {
    console.log(
      "listarCarregamentos.carregamentos.data",
      this.carregamentos.data
    );

    $(".temporary-wrapper")
      .find(".line-item")
      .remove();

    this.authService.showLoading();

    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosPrevistos?token=" +
      this.authService.getToken() +
      "&data=" +
      this.carregamentos.data;

    this.http.get<dataRetorno>(carregamentosPrevistos, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.previstos = data.retorno;

          this.verificarCarregamentos();
        } else {
          this.previstos = [];
        }
        this.listarCarregamentosConferidos();
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  listarCarregamentosConferidos() {
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosConferidos?token=" +
      this.authService.getToken() +
      "&data=" +
      this.carregamentos.data;

    this.http.get<dataRetorno>(carregamentosPrevistos, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.conferidos = data.retorno;

          this.verificarCarregamentos();
        } else {
          this.conferidos = [];
          this.verificarCarregamentos();
        }
        this.listarCarregamentosEmCarregamento();
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  listarCarregamentosEmCarregamento() {
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosEmCarregamento?token=" +
      this.authService.getToken() +
      "&data=" +
      this.carregamentos.data;

    this.http.get<dataRetorno>(carregamentosPrevistos, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.emCarregamento = data.retorno;

          this.verificarCarregamentos();
        } else {
          this.emCarregamento = [];

          this.verificarCarregamentos();
        }
        this.listarCarregamentosCarregados();
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  listarCarregamentosCarregados() {
    this.authService.showLoading();
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosCarregados?token=" +
      this.authService.getToken() +
      "&data=" +
      this.carregamentos.data;

    this.http.get<dataRetorno>(carregamentosPrevistos, {}).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.carregados = data.retorno;
          this.verificarCarregamentos();

          this.authService.hideLoading();
        } else {
          this.carregados = [];
          this.verificarCarregamentos();
          this.authService.hideLoading();
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
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
