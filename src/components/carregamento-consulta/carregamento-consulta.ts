import { Component, ViewChild } from "@angular/core";
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from "@ionic-native/barcode-scanner";
import {
  NavParams,
  ViewController,
  Modal,
  ModalController,
  NavController
} from "ionic-angular";
import { CarregamentoListComponent } from "../../components/carregamento-list/carregamento-list";
import { InputChassiComponent } from "../../components/input-chassi/input-chassi";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { ModalChassiCarregamentoComponent } from "../../components/modal-chassi-carregamento/modal-chassi-carregamento";
import * as $ from "jquery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Component({
  selector: "carregamento-consulta",
  templateUrl: "carregamento-consulta.html"
})
export class CarregamentoConsultaComponent {
  @ViewChild("deleteChassi") deleteChassi: any;
  @ViewChild("changeChassi") changeChassi: any;

  formData = {
    romaneioID: 0,
    data: null,
    quantidadeNaoCarregados: 0
  };
  title: string;
  result = {
    conferido: false,
    data: "",
    detalhes: [
      {
        chassisCarregados: [],
        chassisNaoCarregados: [],
        quantidadeCarregados: 0,
        quantidadeNaoCarregados: 0,
        fila: "",
        filaID: 0,
        frota: "",
        id: 0,
        ordem: 0,
        placa: "",
        rampa: "",
        rampaID: 0,
        transportadora: "",
        transportadoraCNPJID: 0
      }
    ],
    id: 0,
    local: null,
    numero: "",
    status: 0,
    tipo: null,
    tipoID: 0
  };
  responseData: any;
  qrCodeText: string;
  options: BarcodeScannerOptions;
  url: string;
  chassi: string;
  urlListarCarregamentos: string;
  parametros: any;
  RemoverPreCarregamento: string;
  trocarChassi = {
    romaneioID: 0,
    romaneioDetalheID: 0,
    chassi: "",
    chassiNovo: ""
  };
  oldChassi: string;
  finalizar: string;
  ligado: boolean;
  tShow: boolean;
  romaneioID: Number;
  romaneioDetalheID: Number;
  carregamentos = {
    previstos: {},
    conferidos: {},
    emCarregamento: {},
    carregados: {},
    data: ""
  };
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private modal: ModalController,
    private view: ViewController,
    private navParam: NavParams,
    private barcodeScanner: BarcodeScanner,
    public authService: AuthService
  ) {
    this.title = "Resumo Carregamento";
    this.tShow = false;

    const dados = this.navParam.get("data");
    
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

  ionViewDidLoad() {
  }


  ionViewWillEnter() {
    const dados = this.navParam.get("data");
    if (!this.isEmpty(dados)) {
      this.result = dados;

      this.url = this.authService.getUrl();

      this.romaneioID = this.result.id;
      this.romaneioDetalheID = this.result.detalhes[0].id;

      this.carregarResumoCarregamento(this.result);
    }
  }  

  buscaChassi(chassi) {
    this.authService.showLoading();
    let consultarRomaneio =
      this.url +
      "/Carregar/BuscarChassi?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      this.romaneioID +
      "&romaneioDetalheID=" +
      this.romaneioDetalheID +
      "&partChassi=" +
      this.chassi;

    this.http.get<dataRetorno>(consultarRomaneio).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.PreCarregar(data.retorno);
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
      }
    );
  }

  PreCarregar(text) {
    let precarregar =
      this.url +
      "/Carregar/PreCarregar?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      this.romaneioID +
      "&romaneioDetalheID=" +
      this.romaneioDetalheID +
      "&chassi=" +
      text;

    this.authService.showLoading();

    this.http
      .put<dataRetorno>(precarregar, {}, httpOptions)

      .subscribe(
        res => {
          let data = res;

          if (data.sucesso) {
            let consultarRomaneio =
              this.url +
              "/Carregar/ConsultarRomaneio?token=" +
              this.authService.getToken() +
              "&romaneioID=" +
              this.romaneioID +
              "&romaneioDetalheID=" +
              this.romaneioDetalheID;

            this.http.get<dataRetorno>(consultarRomaneio).subscribe(
              res => {
                let data = res;

                if (data.sucesso) {
                  this.chassi = "";

                  this.carregarResumoCarregamento(data.retorno);
                  $(".code").removeClass("hidden");
                  $(".search").addClass("hidden");
                } else {
                  this.authService.hideLoading();
                  this.openModalErro(data.mensagem);
                }
              },
              error => {
                this.openModalErro(error.status + " - " + error.statusText);
                this.authService.hideLoading();
              }
            );
          } else {
            this.authService.hideLoading();
            this.openModalErro(data.mensagem);
          }
        },
        error => {
          this.openModalErro(error.status + " - " + error.statusText);
          this.authService.hideLoading();
        }
      );
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  trocaCarregados(event, chassi) {
    this.trocarChassi = {
      romaneioID: Number(this.romaneioID),
      romaneioDetalheID: Number(this.romaneioDetalheID),
      chassi: chassi,
      chassiNovo: ""
    };
    this.view.dismiss();
    this.openInputChassi(this.trocarChassi);
  }

  removeCarregados(event, chassi) {
    let removerPreCarregamento =
      this.url +
      "/Carregar/RemoverPreCarregamento?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      this.romaneioID +
      "&romaneioDetalheID=" +
      this.romaneioDetalheID +
      "&chassi=" +
      chassi;

    this.authService.showLoading();

    this.http
      .put<dataRetorno>(removerPreCarregamento, {}, httpOptions)
      .subscribe(
        res => {
          let data = res;

          if (data.sucesso) {
            this.CarregamentoResumo(this.romaneioID, this.romaneioDetalheID);
          } else {
            this.authService.hideLoading();
            this.openModalErro(data.mensagem);
          }
        },
        error => {
          this.openModalErro(error.status + " - " + error.statusText);
          this.authService.hideLoading();
        }
      );
  }

  CarregamentoResumo(id, romaneioID) {
    this.authService.showLoading();
    let consultarRomaneio =
      this.url +
      "/Carregar/ConsultarRomaneio?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      id +
      "&romaneioDetalheID=" +
      romaneioID;

    this.http.get<dataRetorno>(consultarRomaneio).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.result = data.retorno;
          this.carregarResumoCarregamento(this.result);
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
      }
    );
  }

  carregarResumoCarregamento(resultado) {
    this.result = resultado;
  }

  voltar() {
    //this.authService.showLoading();
    this.listarCarregamentos();
  }

  openCarregamentoList(data) {
    const chassiModal: Modal = this.modal.create(CarregamentoListComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }
  openInputChassi(data) {
    const chassiModal: Modal = this.modal.create(InputChassiComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }
  finalizarCarregamento() {
    this.authService.showLoading();

    this.romaneioID = this.result.id;
    this.romaneioDetalheID = this.result.detalhes[0].id;

    let finalizarCarregamento =
      this.url +
      "/Carregar/FinalizarCarregamento?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      this.romaneioID +
      "&romaneioDetalheID=" +
      this.romaneioDetalheID;
    this.http
      .put<dataRetorno>(finalizarCarregamento, {}, httpOptions)
      .subscribe(
        res => {
          let data = res;

          if (data.sucesso) {
            this.authService.hideLoading();
            this.chassi = "";

            this.listarCarregamentos();
          } else {
            this.authService.hideLoading();
            this.openModalErro(data.mensagem);
          }
        },
        error => {
          this.openModalErro(error.status + " - " + error.statusText);
          this.authService.hideLoading();
        }
      );
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
  closeModal() {
    this.view.dismiss();
  }
  openModalChassis(data) {
    const chassiModal: Modal = this.modal.create(
      ModalChassiCarregamentoComponent,
      { data: data }
    );
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }
  isEmpty(obj) {
    for (var x in obj) {
      if (obj.hasOwnProperty(x)) return false;
    }
    return true;
  }

  listarCarregamentos() {

    this.authService.showLoading();
    let carregamentosPrevistos = this.url + "/Carregar/ListarCarregamentosPrevistos?token=" + this.authService.getToken() + "&data=" +  this.result.data;

    this.http.get<dataRetorno>(carregamentosPrevistos).subscribe(
      res => {
        let data = res;
        if (data.sucesso) {
          this.carregamentos.previstos = data.retorno;
          this.carregamentos.data = this.result.data;
        } else {
          this.carregamentos.previstos = [];
          this.carregamentos.data = this.result.data;
        }
        this.listarCarregamentosConferidos();
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
      }
    );
  }

  listarCarregamentosConferidos() {
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosConferidos?token=" +
      this.authService.getToken() +
      "&data=" +
      this.result.data;

    this.http.get<dataRetorno>(carregamentosPrevistos).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.carregamentos.conferidos = data.retorno;
        } else {
          this.carregamentos.conferidos = [];
        }
        this.listarCarregamentosEmCarregamento();
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
      }
    );
  }

  listarCarregamentosEmCarregamento() {
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosEmCarregamento?token=" +
      this.authService.getToken() +
      "&data=" +
      this.result.data;

    this.http.get<dataRetorno>(carregamentosPrevistos).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.carregamentos.emCarregamento = data.retorno;
        } else {
          this.carregamentos.emCarregamento = [];
        }
        this.listarCarregamentosCarregados();
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
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
      this.result.data;

    this.http.get<dataRetorno>(carregamentosPrevistos).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.carregamentos.carregados = data.retorno;


          // this.view.dismiss(this.carregamentos);
          this.view.dismiss();
          this.navCtrl.push(CarregamentoListComponent, {
            data: this.carregamentos
          });
          this.authService.hideLoading();
        } else {
          this.carregamentos.carregados = [];
          this.navCtrl.push(CarregamentoListComponent, {
            data: this.carregamentos
          });
          this.authService.hideLoading();
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
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
