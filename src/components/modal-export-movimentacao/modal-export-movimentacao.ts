import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-export-movimentacao',
  templateUrl: 'modal-export-movimentacao.html'
})
export class ModalExportMovimentacaoComponent {

  urlHistMovExport: string;
  HistMovExport: any;
  mesHistMovExport: any[] = [];
  quantHistMovExport: any[] = [];
  url: string;

  constructor( public http: HttpClient, private navParam: NavParams, private view: ViewController, public authService: AuthService) {
    console.log('ModalExportMovimentacaoComponent');
    this.url = this.authService.getUrl();
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
  }
  ionViewDidLoad(){
    this.chartHistoricoMovimentacaoExport();
  }
  chartHistoricoMovimentacaoExport(){

    let urlHistMovExport = this.url+"/Monitoramento/ConsultarMovimentoExportacao?token="+ this.authService.getToken();

    this.http.get( urlHistMovExport )
    .subscribe(res => {

      this.HistMovExport = res;

      if(this.HistMovExport.sucesso){

        console.log(this.HistMovExport);

        for(var i = 0; i < this.HistMovExport.retorno.length; i++){
          this.mesHistMovExport.push(this.HistMovExport.retorno[i].mesNome);
          this.quantHistMovExport.push(this.HistMovExport.retorno[i].quantidade);
        }

        console.log(this.HistMovExport.retorno)
        var ctx = document.getElementById("modalExportVolume");
        var stackedLine = new Chart(ctx, {
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
              text: 'Volume of Export of the next ships'
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
    });
  }

  closeModal(){
    this.view.dismiss();
  }
}
