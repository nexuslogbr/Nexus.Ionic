import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-volume-importacao',
  templateUrl: 'modal-volume-importacao.html'
})
export class ModalVolumeImportacaoComponent {

  url: string;
  data: any;
  meses: any[] = [];
  quantidade: any[] = [];
  classe: string;
  consultarVolume: string;

  constructor(public http: HttpClient, private navParam: NavParams, private view: ViewController, public authService: AuthService) {
    console.log('ModalVolumeImportacaoComponent');
    this.url = this.authService.getUrl();
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.classe = data;
    console.log(this.classe);
    this.chartImportVolume(this.classe);
  }
  chartImportVolume(classe){
    console.log(this.classe);
    if(classe == 'volumeImport'){
      this.consultarVolume = this.url+"/Monitoramento/ConsultarVolumeImportacao?token="+ this.authService.getToken();
    }else{
      this.consultarVolume = this.url+"/Monitoramento/ConsultarVolumeExportacao?token="+ this.authService.getToken();
    }

    this.http.get( this.consultarVolume )
    .subscribe(res => {

      this.data = res;

      console.log(this.data.retorno)

      for(var i = 0; i < this.data.retorno.length; i++){
        this.meses.push(this.data.retorno[i].mesNome);
        this.quantidade.push(this.data.retorno[i].quantidade);
      }
      console.log(this.meses);
      if(this.data.sucesso){

        var ctx = document.getElementById("modalImportVolume");
        var myChart = new Chart(ctx, {
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
                align: 'stretch',
                fontColor: '#fff',
                text: 'Volume of Import'
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
                        beginAtZero:true,
                        fontColor: '#fff',
                        fontSize: 10
                    },
                    gridLines: {
                      color: '#0e324b',
                      lineWidth: 2
                    }
                }]
            }
          },
          maintainAspectRatio: false,
        });

      }else{
        this.authService.hideLoading();
        // this.openModalErroCode(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
    });
  }

  closeModal(){
    this.view.dismiss();
  }
}
