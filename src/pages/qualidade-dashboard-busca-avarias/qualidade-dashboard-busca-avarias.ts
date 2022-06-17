import { Component } from '@angular/core';
import { IonicPage, NavController, Modal, ModalController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalVolumeImportacaoComponent } from '../../components/modal-volume-importacao/modal-volume-importacao';
import { ModalImportMovimentacaoComponent } from '../../components/modal-import-movimentacao/modal-import-movimentacao';
import { ModalExportMovimentacaoComponent } from '../../components/modal-export-movimentacao/modal-export-movimentacao';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as $ from 'jquery';
import { Usuario } from '../../model/usuario';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';
import { Pagination } from '../../model/pagination';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { finalize } from 'rxjs/operators';
import { BuscarAvariasPage } from '../buscar-avarias/buscar-avarias';
import { LancamentoAvariaPage } from '../lancamento-avaria/lancamento-avaria';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Component({
  selector: 'page-qualidade-dashboard-busca-avarias',
  templateUrl: 'qualidade-dashboard-busca-avarias.html',
})
export class QualidadeDashboardBuscaAvariasPage {

  url: string;
  image = './assets/images/qualidade_dashboard_small.PNG';
  retornoData:any;
  avarias: any[] = [];
  lancamentosAvarias: any[] = [];
  totalAvarias: number = 0;
  porcentagemVeiculosAvariados: number = 0;

  title: string;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  buttonColorDark = '#1E1E1E';
  userData: Usuario;

  slideOpts = {
    initialSlide: 1
  };

  itemsPage: any = [];
  private readonly offset: number = 6;
  private index: number = 0;

  constructor(public http: HttpClient,
    private modal: ModalController,
    public authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private avariaService: AvariaDataService,
    private view: ViewController,
    ) {
    this.title = "Módulo  Qualidade";
    this.authService.showLoading();
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
  }

  ionViewDidLoad() {
    this.authService.showLoading();
    this.CarregarAvarias();
  }

  CarregarAvarias() {
    this.authService.showLoading();
    let dashboard = this.url + "/lancamentoAvaria/Dashboard";

    var dadosFiltro =
    {
      "token": this.authService.getToken(),
      "skip": 0,
      "take": 1000,
      "localID": 2
    }

    this.http.post<string>(dashboard, dadosFiltro, httpOptions)
      .subscribe(res => {
        this.retornoData = res;

        if (this.retornoData.sucesso) {
          this.avarias = this.retornoData.retorno;
          this.totalAvarias = this.retornoData.retorno.totalAvarias;
          this.porcentagemVeiculosAvariados = this.retornoData.retorno.porcentagemVeiculosAvariados;
          this.lancamentosAvarias = this.retornoData.retorno.lancamentosAvarias;

          this.itemsPage = this.lancamentosAvarias.slice(this.index, this.offset + this.index);
          this.index += this.offset;
          this.authService.hideLoading();
        }
        else {
          this.authService.hideLoading();
          this.openModalErro("Falha ao carregado dados");
          // this.navCtrl.push(HomePage);
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });
  }

  loadData(infiniteScroll){
    setTimeout(() => {
      let array = this.lancamentosAvarias.slice(this.index, this.offset + this.index);
      this.index += this.offset;

      for (let i = 0; i < array.length; i++) {
        this.itemsPage.push(array[i]);
      }

      infiniteScroll.complete();

      if (this.itemsPage.length === this.avarias.length) {
        infiniteScroll.disable = true;
        console.log('Terminou!');
      }

    }, 100)
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }

  Voltar() {
    this.view.dismiss();
    // this.navCtrl.push(QualidadeMenuPage);
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    })
    chassiModal.onWillDismiss((data) => {
      console.log('data');
      console.log(data);
    })
  }

  navigateToBuscar() {
    this.navCtrl.push(BuscarAvariasPage);
  }

  navigateToLancar() {
    this.navCtrl.push(LancamentoAvariaPage);
  }
}
