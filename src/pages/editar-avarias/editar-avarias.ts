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
import { ListarAvariasPage } from "../listar-avarias/listar-avarias";
import { BuscarAvariasPage } from "../buscar-avarias/buscar-avarias";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Component({
  selector: "page-editar-avarias",
  templateUrl: "editar-avarias.html",
})
export class EditarAvariasPage {
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
  retorno: any;

  formData = {
    "token": "string",
    "id": 0,
    "veiculoID": 0,
    "momentoID": 0,
    "posicaoSuperficieChassiID": 0,
    "tipoAvariaID": 0,
    "avariaID": 0,
    "parteID": 0,
    "superficieChassiParteID": 0,
    "nivelGravidadeAvariaID": 0,
    "observacao": "string",
    "quadrante": 0,
    "bloqueado": true
  };

  dadosAvaria = {
    "token": "",
    "id": 0,
    "veiculoID": 0,
    "momentoID": 0,
    "posicaoSuperficieChassiID": 0,
    "tipoAvariaID": 0,
    "avariaID": 0,
    "parteID": 0,
    "superficieChassiParteID": 0,
    "nivelGravidadeAvariaID": 0,
    "observacao": "",
    "quadrante": 0,
    "bloqueado": ''
  }



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
    private barcodeScanner: BarcodeScanner,
    public navParams: NavParams
  ) {
    this.title = "EDITAR AVARIAS";
    console.log("EditarAvariasPage");
    this.url = this.authService.getUrl();


    this.formData = this.navParams.data;

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
  ionViewDidEnter() {
    this.ListarParte();
    this.ListarModelos();
    this.ListarTipoAvaria();
    this.ListarNivelAvaria();
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
  onParteChange(value) {
    this.formData.parteID = value;
  }

  // onModeloChange(value) {
  //   var item = this.modelos.find(item => item['id'] === value);
  //   this.formData.modelo = item.nome;
  // }

  onTipoAvariaChange(value) {

    this.formData.tipoAvariaID = value;
  }

  onNivelAvariaChange(value) {
    this.formData.nivelGravidadeAvariaID = value;
  }



  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        //  this.chassiInput.setFocus();
        this.inputChassi = '';
      }, 1000);
    }
    this.formData.veiculoID = 0;
  }


  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

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


  salvar() {


    this.authService.showLoading();
    let bloquearVeiculo = this.url + "/lancamentoAvaria/LancamentoAvaria?token=" + this.authService.getToken();

    this.dadosAvaria = {
      "token": this.authService.getToken(),
      "id": this.formData.id,
      "veiculoID": this.formData.veiculoID,
      "momentoID": 0,
      "posicaoSuperficieChassiID": 0,
      "tipoAvariaID": this.formData.tipoAvariaID,
      "avariaID": 0,
      "parteID": this.formData.tipoAvariaID,
      "superficieChassiParteID": 0,
      "nivelGravidadeAvariaID": this.formData.nivelGravidadeAvariaID,
      "observacao": "string",
      "quadrante": 0,
      "bloqueado": ''
    }

    this.http.post<string>(bloquearVeiculo, this.dadosAvaria, httpOptions)
      .subscribe(res => {

        this.retorno = '';
        this.retorno = res;

        console.log(this.retorno);

        if (this.retorno.sucesso) {

          this.authService.hideLoading();
          var data = {
            message: "Avaria salva",
            iconClass: "icon-bloqueio"
          }
          this.openModalSucesso(data);

        }
        else {
          this.authService.hideLoading();
          this.openModalErro(this.retorno.mensagem);
          // this.navCtrl.push(HomePage);         
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });

  }

  voltar() {
    this.navCtrl.push(BuscarAvariasPage);
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
