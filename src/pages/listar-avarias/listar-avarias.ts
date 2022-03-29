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
import { RomaneioPage } from "../romaneio/romaneio";
import { MovimentacaoPage } from "../movimentacao/movimentacao";
import { ParqueamentoPage } from "../parqueamento/parqueamento";
import { CarregamentoExportPage } from "../carregamento-export/carregamento-export";
import { CarregamentoPage } from "../carregamento/carregamento";
import { RecebimentoPage } from "../recebimento/recebimento";
import { Select } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import * as $ from "jquery";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { EditarAvariasPage } from "../editar-avarias/editar-avarias";


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
  modelos:any;
  tipoAvarias:any;
  nivelAvarias:any;
  modoOperacao: number;

  formData = {
    "chassi": '',
    "token":'',
    "data": '',
    "parte": '',
    "modelo": '',
    "tipoAvaria": '',
    "nivelAvaria": ''
  };
  
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  qrCodeText: string;
  options: BarcodeScannerOptions;
  responseData:any;

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    private barcodeScanner: BarcodeScanner
  ) {
    this.title = "Resultado Busca";
    console.log("ListarAvariasPage");
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

    // this.formData.valueChanges.debounceTime(500).subscribe((value) => {
    //   if (value && value.length) {
    //     {
    //       if (value.length >= 6) {
    //         let chassi = value.replace(/[\W_]+/g, '');
    //         setTimeout(() => {
    //           this.buscarChassi(chassi, false);
    //           this.formData.chassi = '';
    //         }, 500);
    //       }
    //     }
    //   }
    // });

  }
  ionViewDidEnter() {
    // this.ListarLayout();
  }

  consultarChassiAvarias() {}

  onParteChange(){}

  onModeloChange(){}

  onTipoAvariaChange(){}

  onNivelAvariaChange(){}

  editar(){

    this.navCtrl.push(EditarAvariasPage);
  }
  

  
  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then(
      (barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(
            this.qrCodeText.length - 17,
            17
          );
          this.formData['chassi'] = partChassi;
          this.buscarChassi(partChassi, true);
        }
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data, true);
      }
    );
  }

  buscarChassi(partChassi, byScanner: boolean) {
debugger
    this.formData.chassi = partChassi;
    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;

    this.authService.showLoading();
    this.formData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {

        this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();
 //         this.openModalLancamentoAvaria(this.responseData.retorno, byScanner);
        }
        else {
          this.authService.hideLoading();
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
          else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
          else if (
            this.modoOperacao == 2 &&
            this.responseData.dataErro == 'CHASSI_NOT_FOUND'
          ) {
           // this.openModalLancamentoAvaria([partChassi], byScanner);
          }
          else {
           this.openModalErro(this.responseData.mensagem, byScanner);
          }
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText, byScanner);
      }
    );
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

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

 
  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
      //  this.chassiInput.setFocus();
      this.inputChassi='';
      }, 1000);
    }
    this.formData.chassi = '';
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
