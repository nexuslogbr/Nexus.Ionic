import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Select } from 'ionic-angular';
import { NavioDataService } from '../../providers/navio-data-service';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CarregamentoExportPage } from '../carregamento-export/carregamento-export';
import * as $ from 'jquery';

@Component({
  selector: 'page-carregamento-export-operacao',
  templateUrl: 'carregamento-export-operacao.html'
})
export class CarregamentoExportOperacaoPage {
  //@ViewChild('selectOperacao') selectOperacao: Select;
  @ViewChild('selectDestino') selectDestino: Select;
  public navios: any[];
  public operacoes: any[];
  public destinos: any[];
  public navioSelecionado: any;
  //public operacaoSelecionada: any;
  public destinoSelecionado: any;
  public title: string = 'Carregamento Exportação';
  //public isOperacoesSelectDisabled: boolean = true;
  public isDestinoSelectDisabled: boolean = true;
  public isAvancarDisabled: boolean = true;
  public tipoOperacaoCarga = 1;

  constructor(
    public navCtrl: NavController,
    public dataService: NavioDataService,
    public authService: AuthService,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarregamentoExportOperacaoPage');
    this.authService.showLoading();
    // Esse método antes a chamada era this.dataService.carregarNavios(true, true, false, false), mudou na conferência... tem de verificar...
    this.dataService.carregarNavios(true, null, null, null).subscribe(
      res => {
        console.log('res', res);
        if (res.sucesso) {
          this.navios = res.retorno;
          console.log('this.navios', this.navios);
        }
      },
      error => {
        console.log('error', error);
      },
      () => {
        this.authService.hideLoading();
      }
    );
  }

  onNavioChange(navioId) {
    //this.isOperacoesSelectDisabled = true;
    this.isDestinoSelectDisabled = true;
    //this.operacoes = [];
    //this.destinos = [];
    //this.selectOperacao.setValue('');
    this.selectDestino.setValue('');
    this.isAvancarDisabled = true;
    this.navioSelecionado = this.navios.find(n => n.id == navioId);
    //this.operacaoSelecionada = null;
    this.destinoSelecionado = null;
    this.authService.showLoading();
    // this.dataService.carregarTipoOperacoes(navioId).subscribe(
    //   res => {
    //     console.log('res', res);
    //     if (res.sucesso) {
    //       // res.retorno.forEach(element => {
    //       //   element.descricao =  (element.id === 1 ? 'Carga' : 'Descarga');
    //       // });
    //       this.operacoes = res.retorno;
    //       //this.isOperacoesSelectDisabled = false;
    //       console.log('this.operacoes', this.operacoes);
    //     }
    //   },
    //   error => {
    //     console.log('error', error);
    //   },
    //   () => {
    //     this.authService.hideLoading();
    //   }
    // );

    this.dataService
      .carregarDestinos(this.navioSelecionado.id, this.tipoOperacaoCarga)
      .subscribe(
        res => {
          console.log('res', res);
          if (res.sucesso) {
            this.destinos = res.retorno;
            this.isDestinoSelectDisabled = false;
          }
        },
        error => {
          console.log('error', error);
        },
        () => {
          this.authService.hideLoading();
        }
      );
  }

  // onNavioOperacaoChange(tipoOperacao) {
  //   if (tipoOperacao != '') {
  //     this.isAvancarDisabled = true;
  //     this.selectDestino.setValue('');
  //     //this.destinos = [];
  //     this.operacaoSelecionada = this.operacoes.find(o => o.id == tipoOperacao);
  //     this.destinoSelecionado = null;
  //     this.authService.showLoading();
  //     this.dataService
  //       .carregarDestinos(this.navioSelecionado.id, tipoOperacao)
  //       .subscribe(
  //         res => {
  //           console.log('res', res);
  //           if (res.sucesso) {
  //             this.destinos = res.retorno;
  //           }
  //         },
  //         error => {
  //           console.log('error', error);
  //         },
  //         () => {
  //           this.authService.hideLoading();
  //         }
  //       );

  //     this.isDestinoSelectDisabled = false;
  //   }
  // }

  onDestinoChange(localId) {
    if (localId != '') {
      console.log('localId', localId);
      this.isAvancarDisabled = false;
      this.destinoSelecionado = this.destinos.find(l => l.id == localId);
    }
  }

  voltar() {
    this.navCtrl.setRoot(HomePage);
  }

  avancar() {
    if (this.destinoSelecionado != null) {
      console.log('loteSelecionado', this.destinoSelecionado);
      this.navCtrl.push(CarregamentoExportPage, {
        navio: this.navioSelecionado,
        tipoOperacao: { id: this.tipoOperacaoCarga },
        destino: this.destinoSelecionado
      });
    }
  }

  ///
  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };
}
