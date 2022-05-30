import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  Modal,
  ModalController,
  NavParams
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { HomePage } from "../home/home";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { ModalReceberParquearComponent } from "../../components/modal-receber-parquear/modal-receber-parquear";
import { RomaneioPage } from "../romaneio/romaneio";
import { MovimentacaoPage } from "../movimentacao/movimentacao";
import { ParqueamentoPage } from "../parqueamento/parqueamento";
import { CarregamentoExportPage } from "../carregamento-export/carregamento-export";
import { CarregamentoPage } from "../carregamento/carregamento";
import { RecebimentoPage } from "../recebimento/recebimento";
import { Select } from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import * as $ from "jquery";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { EditarAvariasPage } from "../editar-avarias/editar-avarias";
import { BuscarAvariasPage } from "../buscar-avarias/buscar-avarias";
import { AvariaDataService } from "../../providers/avaria-data-service";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Component({
  selector: "page-listar-avarias",
  templateUrl: "listar-avarias.html",
})
export class ListarAvariasPage {
  @ViewChild("select1") select1: Select;
  @ViewChild("select2") select2: Select;
  @ViewChild("select3") select3: Select;
  @ViewChild("select4") select4: Select;
  @ViewChild('chassiInput') chassiInput;

  title: string;
  url: string;
  inputChassi: string;
  partes: any;
  modelos: any;
  tipoAvarias: any;
  nivelAvarias: any;
  modoOperacao: number;

  formData = {
    "token": "",
    "skip": 0,
    "take": 0,
    "localID": 0,
    "veiculoID": 0,
    "chassi":"",
    "veiculoDesc": "",
    "data": "",
    "parteAvariadaID": 0,
    "parteAvariaDesc": "",
    "modelo": "",
    "tipoAvariaID": 0,
    "tipoAvariaDesc": "",
    "gravidadeID": 0,
    "gravidadeDesc": ""
  };

  insertData = {
    "token": "",
    "skip": 0,
    "take": 0,
    "localID": 0,
    "veiculoID": 0,
    "data": "",
    "parteAvariadaID": 0,
    "modelo": "",
    "tipoAvariaID": 0,
    "gravidadeID": 0
  }

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  qrCodeText: string;
  options: BarcodeScannerOptions;
  listaAvarias:any;

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    public navParams: NavParams,
    private avariaService: AvariaDataService
  ) {
    this.authService.showLoading();
    this.title = "Resultado Busca";
    this.url = this.authService.getUrl();
    this.formData = this.navParams.data;

    let model = {
      token: this.authService.getToken(),
      skip: 0,
      take: 20,
      localID: 2,
      veiculoID: this.formData.veiculoID > 0 ? this.formData.veiculoID : 0,
      data: this.formData.data != '' && this.formData.data != null ? this.formData.data : '' ,
      parteAvariadaID: this.formData.parteAvariadaID > 0 ? this.formData.parteAvariadaID : 0,
      modelo: this.formData.modelo != '' && this.formData.modelo != null ? this.formData.modelo : '' ,
      tipoAvariaID: this.formData.tipoAvariaID > 0 ? this.formData.tipoAvariaID : 0,
      gravidadeID: this.formData.gravidadeID > 0 ? this.formData.gravidadeID : 0
    }

    this.avariaService.listarAvaria(model).subscribe(res => {

      if (res.sucesso) {
        this.authService.hideLoading();
        this.listaAvarias = res.retorno;
      }
      else {
        this.authService.hideLoading();
        // this.openModalErro(this.retorno.mensagem);
        // this.navCtrl.push(HomePage);
      }
    }, (error) => {
      this.openModalErro(error.status + ' - ' + error.statusText);
      this.authService.hideLoading();
    });

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
  ionViewDidEnter() { }

  navigateToBuscarAvariaPage() {
    this.navCtrl.push(BuscarAvariasPage);
  }
  // onLayoutChange(layout) {
  //   this.bolsoes = null;
  //   this.filas = null;
  //   this.posicoes = null;

  //   this.ListarBolsao(layout);
  //   this.receberParquear.layoutID = layout;
  //   this.receberParquear.layoutNome = this.select1.text;
  //   console.log(this.receberParquear);
  //   this.count = 1;
  // }
  // onBolsaoChange(bolsaoId) {
  //   this.filas = null;
  //   this.posicoes = null;

  //   this.bolsao = bolsaoId;
  //   this.ListarFila(bolsaoId);
  //   this.receberParquear.bolsaoID = bolsaoId;
  //   this.receberParquear.bolsaoNome = this.select2.text;

  //   this.count = 2;
  // }
  // onFilaChange(fila) {
  //   this.fila = fila;
  //   this.receberParquear.filaID = fila;
  //   this.receberParquear.filaNome = this.select3.text;
  //   this.authService.setLayout(this.receberParquear);
  //   this.ListarPosicoes(this.fila);

  //   this.count = 3;
  // }

  // onPosicaoChange(posicao) {
  //   this.posicao = posicao;
  //   this.receberParquear.posicaoID = posicao;
  //   this.receberParquear.posicaoNome = this.select4.text;
  //   this.authService.setPosicao(this.posicao);
  //   this.count = 4;
  // }

  // avancar() {
  //   if (this.receberParquear.posicaoID != "") {
  //     this.count = 0;
  //     this.openModalQrCode(this.receberParquear);
  //   } else {
  //     this.openModalErro("Campos inválidos ou em branco.");
  //   }
  // }

  // ListarLayout() {
  //   this.authService.showLoading();

  //   this.http
  //     .get(
  //       this.url +
  //         "/ReceberParquear/ListarLayouts?token=" +
  //         this.authService.getToken()
  //     )
  //     .subscribe(
  //       (resultado) => {
  //         this.responseData = resultado;

  //         if (this.responseData.sucesso) {
  //           this.authService.hideLoading();

  //           //PREENCHER O SELECT DO LAYOUT
  //           this.layouts = this.responseData.retorno;
  //           this.authService.hideLoading();
  //         } else {
  //           this.authService.hideLoading();
  //           this.openModalErro(this.responseData.mensagem);
  //         }
  //       },
  //       (error) => {
  //         this.authService.hideLoading();
  //         this.openModalErro(
  //           "Erro ao carregar o layout, volte ao menu e tente novamente!"
  //         );
  //         console.log(error);
  //       }
  //     );
  // }

  // ListarBolsao(layout) {
  //   this.authService.showLoading();

  //   this.http
  //     .get(
  //       this.url +
  //         "/ReceberParquear/ListarBolsoes?token=" +
  //         this.authService.getToken() +
  //         "&layoutID=" +
  //         layout
  //     )
  //     .subscribe(
  //       (resultado) => {
  //         this.responseData = {};
  //         this.responseData = resultado;

  //         if (this.responseData.sucesso) {
  //           this.authService.hideLoading();

  //           //PREENCHER O SELECT DO Bolsão
  //           this.bolsoes = this.responseData.retorno;
  //           this.authService.hideLoading();
  //         } else {
  //           this.authService.hideLoading();
  //           this.openModalErro(this.responseData.mensagem);
  //         }
  //       },
  //       (error) => {
  //         this.authService.hideLoading();
  //         this.openModalErro(
  //           "Erro ao carregar o bolsão, volte ao menu e tente novamente!"
  //         );
  //         console.log(error);
  //       }
  //     );
  // }

  // ListarPosicoes(linhaID) {
  //   this.authService.showLoading();

  //   this.http
  //     .get(
  //       this.url +
  //         "/ReceberParquear/ListarPosicoes?token=" +
  //         this.authService.getToken() +
  //         "&linhaID=" +
  //         linhaID
  //     )
  //     .subscribe(
  //       (resultado) => {
  //         this.responseData = {};
  //         this.responseData = resultado;

  //         if (this.responseData.sucesso) {
  //           this.authService.hideLoading();

  //           if (this.responseData["retorno"] != "") {
  //             console.log("há vagas livres.");
  //             //PREENCHER O SELECT DO Bolsão
  //             this.posicoes = this.responseData.retorno;
  //             this.authService.hideLoading();
  //           } else {
  //             this.openModalErro("Não há vagas livres.");
  //             console.log("Não há vagas livres.");

  //             this.ListarFila(this.receberParquear.bolsaoID);
  //           }
  //         } else {
  //           this.authService.hideLoading();
  //           this.openModalErro(this.responseData.mensagem);
  //         }
  //       },
  //       (error) => {
  //         this.authService.hideLoading();
  //         this.openModalErro(
  //           "Erro ao carregar as vagas, volte ao menu e tente novamente!"
  //         );
  //         console.log(error);
  //       }
  //     );
  // }

  // ListarFila(bolsao) {
  //   this.authService.showLoading();

  //   this.http
  //     .get(
  //       this.url +
  //         "/ReceberParquear/ListarLinhas?token=" +
  //         this.authService.getToken() +
  //         "&bolsaoID=" +
  //         bolsao
  //     )
  //     .subscribe(
  //       (resultado) => {
  //         this.responseData = {};
  //         this.responseData = resultado;

  //         if (this.responseData.sucesso) {
  //           this.authService.hideLoading();

  //           //PREENCHER O SELECT DO Bolsão
  //           this.filas = this.responseData.retorno;
  //           this.authService.hideLoading();
  //         } else {
  //           this.authService.hideLoading();
  //           this.openModalErro(this.responseData.mensagem);
  //         }
  //       },
  //       (error) => {
  //         this.authService.hideLoading();
  //         this.openModalErro(
  //           "Erro ao carregar as filas, volte ao menu e tente novamente!"
  //         );
  //         console.log(error);
  //       }
  //     );
  // }

  // openModalQrCode(data) {
  //   const chassiModal: Modal = this.modal.create(
  //     ModalReceberParquearComponent,
  //     { data: data }
  //   );
  //   chassiModal.present();

  //   chassiModal.onDidDismiss((data) => {});
  //   chassiModal.onWillDismiss((data) => {});
  // }

  editar(){

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

    // chassiModal.onDidDismiss((data) => {
    //   this.cleanInput(false);
    // });
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
         this.chassiInput.setFocus();
        this.inputChassi = '';
      }, 1000);
    }
    // this.formData.veiculoID = '';
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

