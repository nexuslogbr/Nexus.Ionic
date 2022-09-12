import { Component, ViewChild } from "@angular/core";
import { NavController, Modal, ModalController, NavParams, ViewController } from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { HomePage } from "../home/home";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { Select } from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import * as $ from "jquery";
import { AvariaDataService } from "../../providers/avaria-data-service";
import { DataRetorno } from "../../model/dataretorno";
import { AlertService } from "../../providers/alert-service";
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { Veiculo } from "../../model/veiculo";
import { Momento } from "../../model/momento";
import { GravidadeAvaria } from "../../model/gravidadeAvaria";
import { TipoAvaria } from "../../model/TipoAvaria";
import { SuperficieChassiParte } from "../../model/superficieChassiParte";
import { PosicaoSuperficieChassi } from "../../model/posicaoSuperficieChassi";


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
    token: "",
    skip: 0,
    take: 0,
    localID: 0,
    veiculoID: 0,
    chassi:"",
    data: "",
    parteAvariadaID: 0,
    modelo: "",
    tipoAvariaID: 0,
    gravidadeID: 0,
    filtro: "",
    filtroValor: ""
  };

  editData = {
    chassi: '',
    modelo: '',
    posicaoAtual: '',
    cor: '',
    observacao: '',
    momentoID: '',

    veiculo: new Veiculo(),
    momento: new Momento(),
    posicaoSuperficieChassi: new PosicaoSuperficieChassi(),
    superficieChassiParte: new SuperficieChassiParte(),
    tipoAvaria: new TipoAvaria(),
    gravidadeAvaria: new GravidadeAvaria()
  };

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  list = [];
  public disableContinuar: boolean = true;
  userData: any;

  filtro = '';
  filtroValor = '';

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    public navParams: NavParams,
    private avariaService: AvariaDataService,
    public alertService: AlertService,
    private view: ViewController
    ) {
    this.title = "Resultado Busca";
    this.url = this.authService.getUrl();
    this.userData = this.authService.getUserData();


    this.formData = this.navParams.data;
    this.formData.token = this.authService.getToken(),
    this.formData.skip = 0,
    this.formData.take = 20,
    this.formData.localID = this.userData.localID,

    this.filtro = this.formData.filtro;
    this.filtroValor = this.formData.filtroValor;

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
    this.authService.showLoading();
  }

  ionViewDidEnter(){
    this.loadAvaria();
  }

  loadAvaria(){
    this.avariaService.listarAvaria(this.formData)
    .subscribe(
      (res:DataRetorno) => {
        if (res.retorno.length != 0) {
          this.list = res.retorno;
          this.authService.hideLoading();
        }
        else {
          this.authService.hideLoading();
          this.alertService.showAlert('Nenhuma avaria para esse chassi');
          this.view.dismiss();
        }
    }, error => {
      this.openModalErro(error.status + ' - ' + error.statusText);
    });

   }

  navigateToBuscarAvariaPage() {
    this.navCtrl.pop();
    // this.navCtrl.push(BuscarAvariasPage);
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
      this.cleanInput(false);
    });
  }

  editar(item: any){
    this.editData = item;
    this.editData.chassi = item.veiculo.chassi;
    this.editData.modelo = item.veiculo.modelo;
    this.disableContinuar = false;

    const modal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage, {
      data: this.editData,
    });
    modal.present();

    modal.onDidDismiss(data => {});
    modal.onWillDismiss(data => {});
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
         this.chassiInput.setFocus();
        this.inputChassi = '';
      }, 1000);
    }
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

  toLancamentoAvaria() {
    const modal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage, {
      data: this.editData,
    });
    modal.present();

    modal.onDidDismiss(data => {});
    modal.onWillDismiss(data => {});
  }
}

