import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'modal-import-movimentacao',
  templateUrl: 'modal-import-movimentacao.html'
})
export class ModalImportMovimentacaoComponent {

  urlHistMovImport: string;
  HistMovImport: any;
  mesHistMovImport: any[] = [];
  quantHistMovImport: any[] = [];
  url: string;

  constructor(public http: HttpClient, private screenOrientation: ScreenOrientation, private navParam: NavParams, private view: ViewController, public authService: AuthService) {
    console.log('ModalImportMovimentacaoComponent');
    this.url = this.authService.getUrl();
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
  }

  ionViewDidLoad(){
    this.chartHistoricoMovimentacaoImport();
  }
  chartHistoricoMovimentacaoImport(){

    let urlHistMovImport = this.url+"/Monitoramento/ConsultarMovimentoImportacao?token="+ this.authService.getToken();

    this.http.get( urlHistMovImport )
    .subscribe(res => {

      this.HistMovImport = res;

      if(this.HistMovImport.sucesso){

        for(var i = 0; i < this.HistMovImport.retorno.length; i++){
          this.mesHistMovImport.push(this.HistMovImport.retorno[i].mesNome);
          this.quantHistMovImport.push(this.HistMovImport.retorno[i].quantidade);
        }

        var ctx = document.getElementById("modalHistoricoMovimentacaoImport");
        var stackedLine = new Chart(ctx, {
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
              text: 'Volume of Import of the next ships'
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
    });

  }
  closeModal(){
    this.view.dismiss();
  }
}
