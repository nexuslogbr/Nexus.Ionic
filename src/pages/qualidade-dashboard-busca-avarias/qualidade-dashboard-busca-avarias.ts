import { Component } from '@angular/core';
import { IonicPage, NavController, Modal, ModalController, NavParams } from 'ionic-angular';
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
  data: any;
  dataExport: any;
  posisoesTotal: any;
  posicoesOcupadas: any;
  posicoesNaoOcupadas: any;
  urlTempoPermanencia: string;
  urlModelos: string;
  modelo: any;
  retorno: any;
  retornoData:any;
  modelos: any;
  modelo1: string;
  modelo2: string;
  modelo3: string;
  modelo4: string;
  nome1: string;
  nome2: string;
  nome3: string;
  nome4: string;
  urlNavios: string;
  navios: any;
  avarias: any[] = [];
  avariasLoading: any[] = [];

  volumeImport: string;
  volumeExport: string;
  hide1: boolean;
  hide2: boolean;
  hide3: boolean;
  hide4: boolean;
  i: any;
  modeloPercentagem: any;
  meses: any[] = [];
  quantidade: any[] = [];
  mesExport: any[] = [];
  quantexport: any[] = [];
  mesHistMovImport: any[] = [];
  quantHistMovImport: any[] = [];
  mesHistMovExport: any[] = [];
  quantHistMovExport: any[] = [];
  urlHistMovImport: string;
  HistMovImport: any;
  urlHistMovExport: string;
  HistMovExport: any;
  statusVagasClass: boolean = false;
  statusTempoClass: boolean = false;
  volumeImportExport: boolean = false;
  title: string;
  percentagem1: string;
  percentagem2: string;
  percentagem3: string;
  percentagem4: string;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  buttonColorDark = '#1E1E1E';
  userData: Usuario;
  pagination: Pagination<any> = new Pagination<any>();

  slideOpts = {
    initialSlide: 1
  };

  skip = 0;
  take = 5;
  localID: 2

  constructor(public http: HttpClient, private modal: ModalController, public authService: AuthService, public navCtrl: NavController, public navParams: NavParams, private avariaService: AvariaDataService) {
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
    this.CarregarAvariasAll();
    this.carregarAvariasScroll(null, true);
  }


  carregarAvariasScroll(infiniteScroll?: any, reset: boolean = false) {
    if (reset) {
      this.pagination.page = 0;
    }

    var dadosFiltro = {
      token: this.authService.getToken(),
      skip: this.skip,
      take: this.take,
      localID: this.localID
    }

    this.avariaService.carregarAvarias(dadosFiltro)
      .pipe(
        finalize(() => {
          if (infiniteScroll) {
            infiniteScroll.complete();
          }
        })
      )
      .subscribe((res:any) => {
        this.pagination = res.retorno.lancamentosAvarias;
        if (!reset) {
          this.skip += 5;
          this.take += 5;
          this.avarias = [...this.avarias, ...res.data];
        } else {
          this.avarias = res.retorno.lancamentosAvarias;
        }
      });
  }

  doInfinit(infiniteScroll) {
    if (this.pagination.hasMoreData) {
      this.pagination.page += 1;
      this.carregarAvariasScroll(infiniteScroll);
    }
  }

  CarregarAvariasAll() {
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
          this.avariasLoading = this.retornoData.retorno;
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

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }

  Voltar() {
    this.navCtrl.push(QualidadeMenuPage);
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

  modalOpen(event) {

    if (this.statusVagasClass) {
      this.statusVagasClass = false;
    } else {
      this.statusVagasClass = true;
    }
  }

}
