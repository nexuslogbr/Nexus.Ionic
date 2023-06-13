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
  NavController,
  TextInput
} from "ionic-angular";
import { CarregamentoListComponent } from "../../components/carregamento-list/carregamento-list";
import { InputChassiComponent } from "../../components/input-chassi/input-chassi";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { ModalChassiCarregamentoComponent } from "../../components/modal-chassi-carregamento/modal-chassi-carregamento";
import * as $ from "jquery";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataService } from "../../providers/data-service";
import { Romaneio } from "../../model/romaneio";
import { RomaneioDetalhe } from "../../model/romaneiodetalhe";
import { ModalCancelarCarregamentoPage } from "../../pages/modal-cancelar-carregamento/modal-cancelar-carregamento";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Component({
  selector: "carregamento-resumo",
  templateUrl: "carregamento-resumo.html"
})
export class CarregamentoResumoComponent {
  @ViewChild("deleteChassi") deleteChassi: any;
  @ViewChild("changeChassi") changeChassi: any;

  formData = {
    romaneioID: 0,
    data: null,
    quantidadeNaoCarregados: 0
  };
  textSituacao: string;
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
  isConferencia: boolean = false;
  finalizar: string;
  ligado: boolean;
  exibirBotaoFinalizar: boolean;
  romaneioID: Number;
  romaneioDetalheID: Number;
  carregamentos = {
    previstos: {},
    conferidos: {},
    emCarregamento: {},
    carregados: {},
    data: ""
  };

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private modal: ModalController,
    private view: ViewController,
    private navParam: NavParams,
    private barcodeScanner: BarcodeScanner,
    private authService: AuthService,
    private dataService: DataService,
    private modalController: ModalController
  ) {
    this.title = "Resumo Carregamento";
    this.exibirBotaoFinalizar = false;
  }

  ionViewWillEnter() {
    this.authService.hideLoading();
    const dados = this.navParam.get("data");
    this.isConferencia =
      this.navParam.get("isConferencia") != null
        ? this.navParam.get("isConferencia")
        : false;
    if (this.isConferencia) {
      this.textSituacao = "Conferidos";
    } else {
      this.textSituacao = "Carregados";
    }

    if (!this.isEmpty(dados)) {
      this.result = dados;

      this.url = this.authService.getUrl();

      this.romaneioID = this.result.id;
      this.romaneioDetalheID = this.result.detalhes[0].id;

      this.carregarResumoCarregamento(this.result);
    }

    // this.carregarResumoCarregamento(this.result);
  }

  ///

  onChange(input: TextInput) {
    this.chassi = input.value;

    if (this.chassi.length >= 1) {
      $(".search").removeClass("hidden");
      $(".code").addClass("hidden");
    } else {
      $(".code").removeClass("hidden");
      $(".search").addClass("hidden");
    }
    if (this.chassi.length == 6 || this.chassi.length == 17) {
      this.buscaChassi(this.chassi);
    }
  }

  ///
  scan() {
    this.options = {
      showTorchButton: true,
      prompt: "",
      resultDisplayDuration: 0
    };

    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        this.qrCodeText = barcodeData.text;
        this.preCarregar(this.qrCodeText);
      },
      err => {
        var data = "Erro de qr code!";
        this.openModalErro(data);
      }
    );
  }

  ///
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
        this.authService.hideLoading();
        if (data.sucesso) {
          this.preCarregar(data.retorno);
        } else {
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(error.status + " - " + error.statusText);
      }
    );
  }

  ///
  preCarregar(chassi) {
    let precarregar =
      this.url +
      "/Carregar/PreCarregar?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      this.romaneioID +
      "&romaneioDetalheID=" +
      this.romaneioDetalheID +
      "&chassi=" +
      chassi;

    this.authService.showLoading();

    this.http.put<dataRetorno>(precarregar, {}, httpOptions).subscribe(
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
              this.authService.hideLoading();
              let data = res;
              if (data.sucesso) {
                this.chassi = "";
                this.carregarResumoCarregamento(data.retorno);
                $(".code").removeClass("hidden");
                $(".search").addClass("hidden");
              } else {
                this.openModalErro(data.mensagem);
              }
            },
            error => {
              this.authService.hideLoading();
              this.openModalErro(error.status + " - " + error.statusText);
            }
          );
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(error.status + " - " + error.statusText);
      }
    );
  }

  ///
  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  ///
  oldChassiCarregados(event) {
    // var target = event.target || event.srcElement || event.currentTarget;
    // let chassi = target.value
    // this.oldChassi = chassi.toLowerCase();
    // this.trocarChassi = {
    //   'romaneioID' : Number(this.formData.romaneioID),
    //   'chassi' : this.oldChassi,
    //   'chassiNovo' : ''
    // };
    // this.view.dismiss();
    // this.trocaCarregados(this.trocarChassi);
  }

  ///
  trocaCarregados(event, chassi) {
    // let chassi = this.changeChassi.nativeElement.id;
    // this.oldChassi = chassi.toLowerCase();
    // this.romaneioID = this.result.id;
    // this.romaneioDetalheID = this.result.detalhes[0].id;
    this.trocarChassi = {
      romaneioID: Number(this.romaneioID),
      romaneioDetalheID: Number(this.romaneioDetalheID),
      chassi: chassi,
      chassiNovo: ""
    };
    this.view.dismiss();
    this.openInputChassi(this.trocarChassi);
  }

  ///
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

  ///
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

  ///
  cancelarChassi(event, chassi) {
    let romaneio: Romaneio = {
      romaneioId: this.romaneioID.valueOf(),
      romaneioDetalheId: this.romaneioDetalheID.valueOf(),
      chassi: chassi
    };

    const modal = this.modal.create("ModalCancelarChassiPage", {
      data: romaneio
    });

    modal.onDidDismiss(data => {
      if (data.cancelar) {
        this.authService.showLoading();

        this.dataService.cancelarChassi(romaneio).subscribe(
          data => {
            if (data.sucesso) {
              this.dataService.consultarRomaneio(romaneio).subscribe(
                data => {
                  this.authService.hideLoading();
                  if (data.sucesso) {
                    data.retorno.conferido = true;
                    //this.result = data.retorno;
                    this.carregarResumoCarregamento(data.retorno);
                  } else {
                    // TODO: exibir erro.
                  }
                },
                error => {
                  this.openModalErro(error.status + " - " + error.statusText);
                  this.authService.hideLoading();
                }
              );
            } else {
              this.authService.hideLoading();
            }
          },
          err => {
            this.authService.hideLoading();
          }
        );
      }
    });

    modal.present();

    // this.dataService.cancelarChassi(this.romaneioID.valueOf(),
    //   this.romaneioDetalheID.valueOf(), chassi).subscribe(
    //     res => {
    //       let data = res;
    //     }, error => {
    //       this.openModalErro(error.status + " - " + error.statusText);
    //       this.authService.hideLoading();
    //     }
    //   );

    // var target = event.target || event.srcElement || event.currentTarget;
    // let chassi = this.deleteChassi.nativeElement.id
    // this.oldChassi = chassi.toLowerCase();

    // this.trocarChassi = {
    //   'romaneioID' : Number(this.formData.romaneioID),
    //   'chassi' : this.oldChassi,
    //   'chassiNovo' : ''
    // };
    // this.view.dismiss();
    // this.trocaCarregados(this.trocarChassi);
  }

  ///
  carregarResumoCarregamento(resultado) {
    this.result = resultado;

    if (this.result.detalhes[0].quantidadeNaoCarregados > 0) {
      this.exibirBotaoFinalizar = false;
    } else {
      this.exibirBotaoFinalizar = true;
      // if (this.result.conferido) {
      //   this.exibirBotaoFinalizar = false;
      // } else {
      //   this.exibirBotaoFinalizar = true;
      // }
    }
  }

  ///
  voltar() {
    this.authService.showLoading();
    this.listarCarregamentos();

    // this.authService.showLoading();
    // this.urlListarCarregamentos = "/Carregar/ListarCarregamentos?token="+ this.authService.getToken() +"&data="+this.formData.data;
    // this.authService.ListarCarregamentos( this.urlListarCarregamentos ).then((result)=>{

    //   this.parametros = result;

    //   if(this.parametros.sucesso){
    //     this.view.dismiss();
    //     this.openCarregamentoList(this.parametros);

    //     this.authService.hideLoading();

    //   }else{
    //     this.authService.hideLoading();
    //     this.openModalErro(this.parametros.mensagem);
    //   }
    // }, (error) =>{
    //   this.authService.hideLoading();
    //   this.openModalErro(error);
    // });
  }

  //
  cancelarCarregamento() {
    let romaneioDetalhe: RomaneioDetalhe = {
      romaneioId: this.romaneioID.valueOf(),
      romaneioDetalheId: this.romaneioDetalheID.valueOf()
    };

    const modal = this.modal.create("ModalCancelarCarregamentoPage", {
      data: romaneioDetalhe
    });

    modal.onDidDismiss(data => {
      if (data.cancelar) {
        this.authService.showLoading();

        this.dataService.cancelarCarregamento(romaneioDetalhe).subscribe(
          data => {
            this.authService.hideLoading();
            if (data.sucesso) {
              //data.retorno.conferido = true;
              this.navCtrl.setRoot(CarregamentoPage);
            } else {
              this.authService.hideLoading();
            }
          },
          err => {
            this.authService.hideLoading();
          }
        );
      }
    });

    modal.present();
  }

  ///
  openCarregamentoList(data) {
    const chassiModal: Modal = this.modal.create(CarregamentoListComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }

  ///
  openInputChassi(data) {
    const chassiModal: Modal = this.modal.create(InputChassiComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }

  ///
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
            // this.view.dismiss();
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

  finalizarConferencia() {
    this.romaneioID = this.result.id;
    this.romaneioDetalheID = this.result.detalhes[0].id;
    this.authService.showLoading();
    this.dataService
      .salvarEmCarregamento(this.romaneioID, this.romaneioDetalheID)
      .subscribe(
        res => {
          if (res.sucesso) {
            this.exibirBotaoFinalizar = false;
            this.authService.hideLoading();
            this.chassi = "";
            // this.view.dismiss();
            this.listarCarregamentos();
          } else {
            this.authService.hideLoading();
            this.openModalErro(res.mensagem);
          }
        },
        error => {
          this.openModalErro(error.status + " - " + error.statusText);
          this.authService.hideLoading();
        }
      );
  }

  ///
  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      this.resumoCarregamento(this.formData.romaneioID);
    });
    chassiModal.onWillDismiss(data => {});
  }

  ///
  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }

  ///
  closeModal() {
    this.view.dismiss();
  }

  ///
  openModalChassis(data) {
    const chassiModal: Modal = this.modal.create(
      ModalChassiCarregamentoComponent,
      { data: data }
    );
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }

  ///
  isEmpty(obj) {
    for (var x in obj) {
      if (obj.hasOwnProperty(x)) return false;
    }
    return true;
  }

  ///
  resumoCarregamento(dataId) {
    if (dataId) {
      this.url =
        "/Carregar/ConsultarRomaneio?token=" +
        this.authService.getToken() +
        "&romaneioID=" +
        dataId;

      this.authService.showLoading();

      // this.authService.CarregarConsultarRomaneio( this.url ).then((result)=>{
      //   this.responseData = '';
      //   this.responseData = result;

      //   if(this.responseData.sucesso){
      //     this.formData = this.responseData.retorno;
      //     this.authService.hideLoading();
      //   }else{
      //     this.authService.hideLoading();
      //     this.openModalErro(this.responseData.mensagem);

      //   }
      // }, (error) =>{
      //   this.authService.hideLoading();
      //   this.openModalErro(error);
      // });
    }
  }

  ///
  listarCarregamentos() {
    this.authService.showLoading();
    let carregamentosPrevistos =
      this.url +
      "/Carregar/ListarCarregamentosPrevistos?token=" +
      this.authService.getToken() +
      "&data=" +
      this.result.data;

    this.http.get<dataRetorno>(carregamentosPrevistos).subscribe(
      res => {
        let data = res;
        //console.log(data);
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
        //console.log(error);
      }
    );
  }

  ///
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
        console.log(error);
      }
    );
  }

  ///
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
        console.log(error);
      }
    );
  }

  ///
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
