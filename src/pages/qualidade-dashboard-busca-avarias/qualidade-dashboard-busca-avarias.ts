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

  userData: Usuario;

  slideOpts = {
    initialSlide: 1
  };

  constructor(public http: HttpClient, private modal: ModalController, public authService: AuthService, public navCtrl: NavController, public navParams: NavParams) {
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

    // this.chartStatusVeiculo();
    // this.ProximosCarregamentos();
    this.CarregarAvarias();

    // this.avarias = [
    //   {
    //     modelo: 'AMAROK',
    //     chassi: '8AC907133ME989987',
    //     tipoAnomalia: 'AM - Amassados',
    //     parteAvariada: 'Calota Dianteira Esquerda',
    //     nivelAvaria: 'G1= 0 2,00 mm',
    //     data: '20/03/2022'
    //   },
    //   {
    //     modelo: 'COBALT',
    //     chassi: '8AC907133ME989993',
    //     tipoAnomalia: 'AM - Amassados',
    //     parteAvariada: 'Calota Dianteira Esquerda',
    //     nivelAvaria: 'G1= 0 2,00 mm',
    //     data: '20/03/2022'
    //   },
    //   {
    //     modelo: 'HILUX',
    //     chassi: '8AC907133ME989995',
    //     tipoAnomalia: 'AM - Amassados',
    //     parteAvariada: 'Calota Dianteira Esquerda',
    //     nivelAvaria: 'G1= 0 2,00 mm',
    //     data: '20/03/2022'
    //   }]
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
          this.authService.hideLoading();

          console.log(this.avarias);
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

  chartStatusVeiculo() {

    this.authService.showLoading();
    this.urlModelos = this.url + "/Monitoramento/ConsultarModelos?token=" + this.authService.getToken();

    this.http.get(this.urlModelos)
      .subscribe(data => {

        this.data = data;

        if (this.data.sucesso) {
          this.modelos = [{ modelo: 'AMAROK', quantidade: 9, totalVagas: 206, percentagem: 4 }];

          let parametros = this.modelos;

          // let colors = [
          //   'rgba(179, 25, 8, 0.8)',
          //   'rgba(51, 216, 56, 0.8)',
          //   'rgba(245, 218, 129, 0.8)',
          //   'rgba(216, 247, 129, 0.8)',
          //   'rgba(88, 250, 88, 0.8)',
          //   'rgba(46, 46, 254, 0.8)',
          //   'rgba(191, 0, 255, 0.8)',
          //   'rgba(255, 0, 255, 0.8)',
          //   'rgba(223, 1, 58, 0.8)',
          //   'rgba(132, 132, 132, 0.8)',
          //   'rgba(4, 180, 95, 0.8)'
          // ];

          let colors = [
            'rgba(179, 25, 8, 0.8)',
            'rgba(51, 216, 56, 0.8)'
          ];

          setTimeout(function () {

            let id = '#statusVeiculo_severo';
            let indexColor = Math.floor(Math.random() * colors.length);
            let color = colors[indexColor];
            let ctx = document.querySelector(id);
            let myChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                datasets: [{
                  data: [10, 100 - 30],
                  backgroundColor: [
                    'rgba(179, 25, 8, 0.8)',
                    'rgba(45, 53, 61, 0.8)'
                  ],
                  borderColor: [
                    'rgba(45, 53, 61, 1)',
                    'rgba(45, 53, 61, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                tooltips: {
                  enabled: false
                },
                cutoutPercentage: 80,
                legend: {
                  labels: {
                    fontColor: '#fff'
                  }
                },
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI
              }
            });

            let id_ = '#statusVeiculo_superficial';
            let ctx_ = document.querySelector(id_);
            let myChart_ = new Chart(ctx_, {
              type: 'doughnut',
              data: {
                datasets: [{
                  data: [10, 100 - 30],
                  backgroundColor: [
                    'rgba(51, 216, 56, 0.8)',
                    'rgba(45, 53, 61, 0.8)'
                  ],
                  borderColor: [
                    'rgba(45, 53, 61, 1)',
                    'rgba(45, 53, 61, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                tooltips: {
                  enabled: false
                },
                cutoutPercentage: 80,
                legend: {
                  labels: {
                    fontColor: '#fff'
                  }
                },
                rotation: 1 * Math.PI,
                circumference: 1 * Math.PI
              }
            });
          }, 1000);

          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
        }

      }, (error) => {
        this.authService.hideLoading();
      });
  }

  chartExportVolume() {

    this.volumeExport = this.url + "/Monitoramento/ConsultarVolumeExportacao?token=" + this.authService.getToken();

    this.http.get(this.volumeExport)
      .subscribe(res => {

        this.dataExport = res;

        for (let i = 0; i < this.dataExport.retorno.length; i++) {
          this.mesExport.push(this.dataExport.retorno[i].mesNome);
          this.quantexport.push(this.dataExport.retorno[i].quantidade);
        }

        if (this.dataExport.sucesso) {

          let ctx = document.getElementById("exportVolume");
          let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.mesExport,
              datasets: [{
                data: this.quantexport,
                backgroundColor: [
                  'rgba(255, 87, 34, 0.8)',
                  'rgba(255, 87, 34, 0.8)',
                  'rgba(255, 87, 34, 0.8)',
                  'rgba(255, 87, 34, 0.8)',
                  'rgba(255, 87, 34, 0.8)',
                  'rgba(255, 87, 34, 0.8)'
                ],
                borderColor: [
                  'rgba(255, 87, 34, 1)',
                  'rgba(255, 87, 34, 1)',
                  'rgba(255, 87, 34, 1)',
                  'rgba(255, 87, 34, 1)',
                  'rgba(255, 87, 34, 1)',
                  'rgba(255, 87, 34, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                fontColor: '#fff',
                text: 'Volume de Exportação'
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    fontColor: '#fff'
                  },
                  gridLines: {
                    color: '#0e324b',
                    lineWidth: 2
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontColor: '#fff',
                    fontSize: 10
                  },
                  gridLines: {
                    color: '#0e324b',
                    lineWidth: 2
                  }
                }]
              }
            }
          });

        } else {
          this.authService.hideLoading();
          // this.openModalErroCode(this.responseData.mensagem);
        }

      }, (error) => {
        this.authService.hideLoading();
        // this.openModalErroCode(error);
      });
  }

  ProximosCarregamentos() {

    this.urlNavios = this.url + "/Monitoramento/ConsultarNavios?token=" + this.authService.getToken();

    this.http.get(this.urlNavios)
      .subscribe(res => {

        this.data = res;

        console.log(res)

        if (this.data.sucesso) {

          this.navios = this.data.retorno;

        } else {
          this.authService.hideLoading();
          // this.openModalErroCode(this.responseData.mensagem);
        }

      }, (error) => {
        this.authService.hideLoading();
        // this.openModalErroCode(error);
      });
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
  modalOpenImportExport($event) {
    if (this.statusTempoClass) {
      this.statusTempoClass = false;
    } else {
      this.statusTempoClass = true;
    }
  }
  modalvolumeImport($event) {
    this.openModalVolumeImport($event.target.id);
  }

  openModalVolumeImport(dados) {

    const recModal: Modal = this.modal.create(ModalVolumeImportacaoComponent, { data: dados });
    recModal.present();

    recModal.onDidDismiss((data) => {
    })
    recModal.onWillDismiss((data) => {
    })
  }

  modalMovImport(dados) {
    const recModal: Modal = this.modal.create(ModalImportMovimentacaoComponent, { data: dados });
    recModal.present();

    recModal.onDidDismiss((data) => {
    })
    recModal.onWillDismiss((data) => {
    })
  }

  modalMovExport(dados) {
    const recModal: Modal = this.modal.create(ModalExportMovimentacaoComponent, { data: dados });
    recModal.present();

    recModal.onDidDismiss((data) => {
    })
    recModal.onWillDismiss((data) => {
    })
  }

}
