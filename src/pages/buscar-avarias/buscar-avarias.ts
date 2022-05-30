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
import { ListarAvariasPage } from "../listar-avarias/listar-avarias";
import { Usuario } from "../../model/usuario";
import { QualidadeMenuPage } from "../qualidade-menu/qualidade-menu";


@Component({
  selector: "page-buscar-avarias",
  templateUrl: "buscar-avarias.html",
})
export class BuscarAvariasPage {
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
    "take": 10,
    "localID": 0,
    "veiculoID": "",
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

  userData: Usuario;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  qrCodeText: string;
  options: BarcodeScannerOptions;
  responseData: any;

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    private barcodeScanner: BarcodeScanner
  ) {
    this.title = "BUSCAR AVARIAS";
    console.log("BuscarAvariasPage");
    this.url = this.authService.getUrl();
    this.userData = this.authService.getUserData();

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
    this.ListarParte();
    this.ListarModelos();
    this.ListarTipoAvaria();
    this.ListarNivelAvaria();
    this.setLocalID();
  }


  consultarChassiAvarias() { }

  onParteChange(value) {
    var item = this.partes.find(item => item['id'] === value);
    this.formData.parteAvariadaID = item.id;
    this.formData.parteAvariaDesc = item.nome;
  }

  onModeloChange(value) {
    var item = this.modelos.find(item => item['id'] === value);
    this.formData.modelo = item.nome;
  }

  onTipoAvariaChange(value) {
    var item = this.tipoAvarias.find(item => item['id'] === value);
    this.formData.tipoAvariaID = item.id;
    this.formData.tipoAvariaDesc = item.nome;
  }

  onNivelAvariaChange(value) {
    var item = this.nivelAvarias.find(item => item['id'] === value);
    this.formData.gravidadeID = item.id;
    this.formData.gravidadeDesc = item.nome;
  }

  setLocalID() {
    this.formData.localID = this.userData.localModoOperacao;
  }

  avancar() {

    if (this.inputChassi) {
      this.buscarChassi(this.inputChassi, false)
      if (this.validaCampos()) {
        this.navCtrl.push(ListarAvariasPage, this.formData);
      } else {
        this.openModalErro('Preencha os campos da busca');
      }
    } else {
      if (this.validaCampos()) {
        this.navCtrl.push(ListarAvariasPage, this.formData);
      } else {
        this.openModalErro('Preencha os campos da busca');
      }
    }



  }

  validaCampos(): Boolean {
    var check: boolean = false;
    if (this.formData.veiculoID) {
      check = true;
    }
    if (this.formData.data) {
      check = true;
    }
    if (this.formData.parteAvariadaID) {
      check = true;
    }
    if (this.formData.modelo) {
      check = true;
    }
    if (this.formData.tipoAvariaID) {
      check = true;
    }
    if (this.formData.gravidadeID) {
      check = true;
    }
    return check;
  }

  buscarChassi(partChassi, byScanner: boolean) {
    //this.formData.veiculoID = partChassi;
    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;


    this.formData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {

        this.responseData = res;
        if (this.responseData.sucesso) {
          this.formData.veiculoID = this.responseData.retorno.id;
          this.formData.chassi = this.inputChassi;
        }
        else {

          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem);
          }
          else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem);
          }
          else if (
            this.modoOperacao == 2 &&
            this.responseData.dataErro == 'CHASSI_NOT_FOUND'
          ) {
            // this.openModalLancamentoAvaria([partChassi], byScanner);
          }
          else {
            this.openModalErro(this.responseData.mensagem);
          }
        }
      },
      (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
      }
    );
  }




  ListarParte() {
    //

    this.http
      .get(
        this.url +
        "/Parte/Partes?token=" +
        this.authService.getToken()
      )
      .subscribe(
        (resultado) => {
          this.responseData = resultado;

          if (this.responseData.sucesso) {
            this.partes = this.responseData.retorno;

            console.log(this.partes)

          } else {

            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {

          this.openModalErro(
            "Erro ao carregar as partes, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }


  ListarModelos() {


    this.http
      .get(
        this.url +
        "/Modelo/Listar?token=" +
        this.authService.getToken()
      )
      .subscribe(
        (resultado) => {
          this.responseData = resultado;
          if (this.responseData.sucesso) {
            this.modelos = this.responseData.retorno;
          } else {

            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {

          this.openModalErro(
            "Erro ao carregar os modelos, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );


  }




  ListarTipoAvaria() {


    this.http
      .get(
        this.url +
        "/tipoavaria/ListarTiposAvaria?token=" +
        this.authService.getToken()
      )
      .subscribe(
        (resultado) => {
          this.responseData = resultado;

          if (this.responseData.sucesso) {

            this.tipoAvarias = this.responseData.retorno;

          } else {

            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {

          this.openModalErro(
            "Erro ao carregar o layout, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }




  ListarNivelAvaria() {


    this.http
      .get(
        this.url +
        "/nivelgravidadeavaria/ListarNivelGravidadeAvaria?token=" +
        this.authService.getToken()
      )
      .subscribe(
        (resultado) => {
          this.responseData = resultado;

          if (this.responseData.sucesso) {

            this.nivelAvarias = this.responseData.retorno;

          } else {

            this.openModalErro(this.responseData.mensagem);
          }
        },
        (error) => {

          this.openModalErro(
            "Erro ao carregar o layout, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
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
      this.inputChassi = ''; // this.cleanInput(byScanner);
    });
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        //  this.chassiInput.setFocus();
        this.inputChassi = '';
      }, 1000);
    }
    this.formData.veiculoID = '';
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
    this.navCtrl.push(QualidadeMenuPage);
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
