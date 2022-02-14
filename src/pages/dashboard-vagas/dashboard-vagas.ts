import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Modal,
  ModalController
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import * as $ from "jquery";
import { DataService } from "../../providers/data-service";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { DashboardVagasBolsaoPage } from "../dashboard-vagas-bolsao/dashboard-vagas-bolsao";
import { Layout } from "../../model/Layout";

@Component({
  selector: "page-dashboard-vagas",
  templateUrl: "dashboard-vagas.html"
})
export class DashboardVagasPage {
  title: string;
  layouts: Array<Layout>;
  layoutIdSelecionado: number;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public dataService: DataService,
    private modal: ModalController
  ) {
    this.title = "STATUS DE BOLSÃO";
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
    // this.locais = [
    //   {
    //     id: 1,
    //     nome: "Rio Grande"
    //   },
    //   { id: 2, nome: "Itajaí" }
    // ];
    //console.log("this.locais", this.locais);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DashboardVagasPage");
    this.authService.showLoading();
    this.dataService.listarLayouts(true).subscribe(
      res => {
        this.layouts = res.retorno;
        console.log('res.retorno', res.retorno);
        this.authService.hideLoading();
        // this.responseData = {};
        // this.responseData = resultado;
        // if(this.responseData.sucesso){
        //   this.authService.hideLoading();
        //   //PREENCHER O SELECT DO Bolsão
        //   this.filas = this.responseData.retorno;
        //   this.authService.hideLoading();
        // }else{
        //   this.authService.hideLoading();
        //   this.openModalErro(this.responseData.mensagem);
        // }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(
          "Erro ao carregar os locais, volte ao menu e tente novamente!"
        );
        console.log(error);
      }
    );
  }

  ionViewWillEnter() {}

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  onLocalChange(event) {
    console.log('event', event);
    this.layoutIdSelecionado = event;
  }

  listarVagas() {
    //DashboardVagasBolsaoPage
    //layout.local.nome
    let layoutNome = '';
    var layoutSelecionado = this.layouts.filter(l=>l.id==this.layoutIdSelecionado)[0];
    if (layoutSelecionado!=null) {
      layoutNome =layoutSelecionado.local.nome + ' - ' + layoutSelecionado.nome;
    }

    this.navCtrl.push(DashboardVagasBolsaoPage, {layoutId: this.layoutIdSelecionado, layoutNome: layoutNome});
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();
    chassiModal.onDidDismiss(data => {
      //console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      //console.log('data');
      //console.log(data);
    });
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      //console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      //console.log('data');
      //console.log(data);
    });
  }
}
