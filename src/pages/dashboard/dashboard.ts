import { Component} from '@angular/core';
import { IonicPage, NavController, Modal, ModalController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalVolumeImportacaoComponent } from '../../components/modal-volume-importacao/modal-volume-importacao';
import { ModalImportMovimentacaoComponent } from '../../components/modal-import-movimentacao/modal-import-movimentacao';
import { ModalExportMovimentacaoComponent } from '../../components/modal-export-movimentacao/modal-export-movimentacao';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as $ from 'jquery';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

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

  constructor(public http: HttpClient, private modal: ModalController, public authService: AuthService, public navCtrl: NavController, public navParams: NavParams) {
    this.title = "Dashboard";
    this.authService.showLoading();
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
  }

  ionViewDidLoad() {
    console.log('DashboardPage');

    this.chartStatusVagas();
    this.chartTempoPatio();
    this.chartStatusVeiculo();
    this.chartImportVolume();
    this.chartExportVolume();
    this.chartHistoricoMovimentacaoImport();
    this.chartHistoricoMovimentacaoExport();
    this.ProximosCarregamentos();
    this.authService.hideLoading();
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
  chartStatusVagas(){

    let urlStatus = this.url+"/Monitoramento/ConsultarPosicoes?token="+ this.authService.getToken();

    this.http.get( urlStatus )
    .subscribe(res => {

      this.data = res;

      if(this.data.sucesso){

        this.posisoesTotal = this.data.retorno['posisoesTotal']
        this.posicoesOcupadas = this.data.retorno['posicoesOcupadas']
        this.posicoesNaoOcupadas = this.posisoesTotal - this.posicoesOcupadas;

        let ctx = document.getElementById("statusVagas");
        let myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Vagas Disponíveis", "Vagas Ocupadas"],

            datasets: [{
                data: [this.posicoesNaoOcupadas, this.posicoesOcupadas],
                backgroundColor: [
                    'rgba(120, 189, 93, 1)',
                    'rgba(198, 70, 72, 1)'
                ],
                borderColor: [
                  'rgba(120, 189, 93, 1)',
                  'rgba(198, 70, 72, 1)'
                ],
                borderWidth: 1
            }]
          },
          options:{
            cutoutPercentage: 80,
            legend: {
              display: true,
              position: 'bottom',
              align: 'start',
              labels: {
                  fontColor: '#fff'
              }
            }
          }
        });

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
    });

  }
  chartTempoPatio(){

    this.urlTempoPermanencia = this.url+"/Monitoramento/ConsultarTempoPermanencia?token="+ this.authService.getToken();

    this.http.get( this.urlTempoPermanencia )
    .subscribe(res => {

      this.data = res;

      if(this.data.sucesso){

        let ctx = document.getElementById("tempoPatio");
        let myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Até 30 dias", "Até 60 dias", "Até 90 dias", "Mais de 90 dias"],
            datasets: [{
                data: [this.data.retorno['ateTrinta'], this.data.retorno['entreTrintaSessenta'], this.data.retorno['entreSessentaNoventa'], this.data.retorno['maisNoventa']],
                backgroundColor: [
                    'rgba(120, 189, 93, 0.8)',
                    'rgba(51, 165, 199, 0.8)',
                    'rgba(215, 167, 20, 0.8)',
                    'rgba(198, 70, 72, 0.8)'
                ],
                borderColor: [
                  'rgba(120, 189, 93, 1)',
                  'rgba(51, 165, 199, 1)',
                  'rgba(215, 167, 20, 1)',
                  'rgba(198, 70, 72, 1)'
                ],
                borderWidth: 1
            }]
          },
          options:{
            cutoutPercentage: 80,
            legend: {
              position: 'bottom',
              align: 'left',
              labels: {
                  fontColor: '#fff'
              }
            }
          }
        });


      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }

  //falta terminar

  chartStatusVeiculo(){

    this.authService.showLoading();

    this.urlModelos = this.url+"/Monitoramento/ConsultarModelos?token="+ this.authService.getToken();

    this.http.get( this.urlModelos )
    .subscribe(data => {

      this.data = data;

      if(this.data.sucesso){
        this.modelos = this.data.retorno;

        let parametros = this.modelos;
        let colors = [
          'rgba(245, 169, 169, 0.8)',
          'rgba(250, 130, 88, 0.8)',
          'rgba(245, 218, 129, 0.8)',
          'rgba(216, 247, 129, 0.8)',
          'rgba(88, 250, 88, 0.8)',
          'rgba(46, 46, 254, 0.8)',
          'rgba(191, 0, 255, 0.8)',
          'rgba(255, 0, 255, 0.8)',
          'rgba(223, 1, 58, 0.8)',
          'rgba(132, 132, 132, 0.8)',
          'rgba(4, 180, 95, 0.8)'
        ];

        setTimeout(function(){

          for(let i = 0; i < parametros.length; i++){

            let id = '#statusVeiculo'+i+'';

            let indexColor = Math.floor(Math.random() * colors.length);

            let color = colors[indexColor];

            let ctx = document.querySelector(id);
            let myChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                datasets: [{
                    data: [parametros[i].percentagem, 100 - parametros[i].percentagem],
                    backgroundColor: [
                      color,
                      'rgba(45, 53, 61, 0.8)'
                    ],
                    borderColor: [
                      color,
                      'rgba(45, 53, 61, 1)'
                    ],
                    borderWidth: 1
                }]
              },
              options:{
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
          }
        }, 1000);

        this.authService.hideLoading();
      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }
  chartImportVolume(){

    this.volumeImport = this.url+"/Monitoramento/ConsultarVolumeImportacao?token="+ this.authService.getToken();

    this.http.get( this.volumeImport )
    .subscribe(res => {

      this.data = res;

      for(let i = 0; i < this.data.retorno.length; i++){
        this.meses.push(this.data.retorno[i].mesNome);
        this.quantidade.push(this.data.retorno[i].quantidade);
      }

      if(this.data.sucesso){

        let ctx = document.getElementById("importVolume");
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.meses,
                datasets: [{
                    data: this.quantidade,
                    backgroundColor: [
                        'rgba(211, 161, 15, 0.9)',
                        'rgba(211, 161, 15, 0.9)',
                        'rgba(211, 161, 15, 0.9)',
                        'rgba(211, 161, 15, 0.9)',
                        'rgba(211, 161, 15, 0.9)',
                        'rgba(211, 161, 15, 0.9)'
                    ],
                    borderColor: [
                        'rgba(211, 161, 15, 1)',
                        'rgba(211, 161, 15, 1)',
                        'rgba(211, 161, 15, 1)',
                        'rgba(211, 161, 15, 1)',
                        'rgba(211, 161, 15, 1)',
                        'rgba(211, 161, 15, 1)'
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
                    // position: 'top',
                    align: 'stretch',
                    fontColor: '#fff',
                    text: 'Volume de Importação'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
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

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }
  chartExportVolume(){

    this.volumeExport = this.url+"/Monitoramento/ConsultarVolumeExportacao?token="+ this.authService.getToken();

    this.http.get( this.volumeExport )
    .subscribe(res => {

      this.dataExport = res;

      for(let i = 0; i < this.dataExport.retorno.length; i++){
        this.mesExport.push(this.dataExport.retorno[i].mesNome);
        this.quantexport.push(this.dataExport.retorno[i].quantidade);
      }

      if(this.dataExport.sucesso){

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
                            beginAtZero:true,
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

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }

  ProximosCarregamentos(){

    this.urlNavios = this.url+"/Monitoramento/ConsultarNavios?token="+ this.authService.getToken();

    this.http.get( this.urlNavios )
    .subscribe(res => {

      this.data = res;

      if(this.data.sucesso){

        this.navios = this.data.retorno;

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }

  chartHistoricoMovimentacaoImport(){

    this.urlHistMovImport = this.url+"/Monitoramento/ConsultarMovimentoImportacao?token="+ this.authService.getToken();

    this.http.get( this.urlHistMovImport )
    .subscribe(res => {

      this.HistMovImport = res;

      if(this.HistMovImport.sucesso){

        for(let i = 0; i < this.HistMovImport.retorno.length; i++){
          this.mesHistMovImport.push(this.HistMovImport.retorno[i].mesNome);
          this.quantHistMovImport.push(this.HistMovImport.retorno[i].quantidade);
        }

        let ctx = document.getElementById("historicoMovimentacaoImport");
        let stackedLine = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.mesHistMovImport,
            datasets: [{
                data: this.quantHistMovImport,
                borderColor: "#3cba9f",
                fill: false
              }
            ]
          },
          options: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              fontColor: '#fff',
              fontSize: 12,
              text: 'Volume de Importação dos próximos navios'
            },
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
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

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }

  chartHistoricoMovimentacaoExport(){

    this.urlHistMovExport = this.url+"/Monitoramento/ConsultarMovimentoExportacao?token="+ this.authService.getToken();

    this.http.get( this.urlHistMovExport )
    .subscribe(res => {

      this.HistMovExport = res;

      if(this.HistMovExport.sucesso){

        for(let i = 0; i < this.HistMovExport.retorno.length; i++){
          this.mesHistMovExport.push(this.HistMovExport.retorno[i].mesNome);
          this.quantHistMovExport.push(this.HistMovExport.retorno[i].quantidade);
        }

        let ctx = document.getElementById("historicoMovimentacaoExport");
        let stackedLine = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.mesHistMovExport,
            datasets: [{
                data: this.quantHistMovExport,
                borderColor: "#33a5c7",
                fill: false
              }
            ]
          },
          options: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              fontColor: '#fff',
              fontSize: 12,
              text: 'Volume de Exportação dos próximos navios'
            },
            scales: {
              yAxes: [{
                  ticks: {
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

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      // this.openModalErroCode(error);
    });
  }

  Voltar(){
    this.navCtrl.push(HomePage);
  }
  modalOpen(event){

    if(this.statusVagasClass){
      this.statusVagasClass = false;
    }else{
      this.statusVagasClass = true;
    }
    // this.statusVagasClass = !this.statusVagasClass;

  }
  modalOpenImportExport($event){
    if(this.statusTempoClass){
      this.statusTempoClass = false;
    }else{
      this.statusTempoClass = true;
    }
  }
  modalvolumeImport($event){
    this.openModalVolumeImport($event.target.id);
  }

  openModalVolumeImport(dados){

    const recModal: Modal = this.modal.create(ModalVolumeImportacaoComponent, {data: dados});
    recModal.present();

    recModal.onDidDismiss((data) => {
    })
    recModal.onWillDismiss((data) =>{
    })
  }

  modalMovImport(dados){
    const recModal: Modal = this.modal.create(ModalImportMovimentacaoComponent, {data: dados});
    recModal.present();

    recModal.onDidDismiss((data) => {
    })
    recModal.onWillDismiss((data) =>{
    })
  }

  modalMovExport(dados){
    const recModal: Modal = this.modal.create(ModalExportMovimentacaoComponent, {data: dados});
    recModal.present();

    recModal.onDidDismiss((data) => {
    })
    recModal.onWillDismiss((data) =>{
    })
  }

}
