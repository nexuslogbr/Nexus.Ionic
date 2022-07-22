import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Content } from 'ionic-angular';
import * as $ from 'jquery';
import { Navio } from '../../model/navio';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavioDataService } from '../../providers/navio-data-service';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ArquivoDataService } from '../../providers/arquivo-data-service';
import { Arquivo } from '../../model/arquivo';
import { NovaConferenciaConfiguracaoAreaPage } from '../nova-conferencia-configuracao-area/nova-conferencia-configuracao-area';
import { LancamentoAvariaPage } from '../lancamento-avaria/lancamento-avaria';
import { LancamentoAvariaVistoriaLancarPage } from '../lancamento-avaria-vistoria-lancar/lancamento-avaria-vistoria-lancar';

@Component({
  selector: 'page-lancamento-avaria-vistoria',
  templateUrl: 'lancamento-avaria-vistoria.html',
})
export class LancamentoAvariaVistoriaPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('pageTop') pageTop: Content;
  slideLeftSelected: boolean = true;
  navios: Navio[] = [];
  arquivos: Arquivo[] = [];
  showNavioErrorMessage: boolean = false;
  showArquivoErrorMessage: boolean = false;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public navioDataService: NavioDataService,
    public arquivoDataService: ArquivoDataService
  ) {
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

    forkJoin([
      this.navioDataService.carregarNavios(false, null, null, true, null),
      this.arquivoDataService.carregarArquivosDePlanilhasVistoria()
    ])
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        arrayResult => {
          let navios$ = arrayResult[0];
          let arquivos$ = arrayResult[1];

          console.log('navios$', navios$);
          if (navios$.sucesso) {
            this.navios = navios$.retorno;
          } else {
            this.showNavioErrorMessage = true;
          }

          console.log('arquivos$', arquivos$);
          if (arquivos$.sucesso) {
            this.arquivos = arquivos$.retorno;
          } else {
            this.showArquivoErrorMessage = true;
          }
        },
        error => {
          console.log('error', error);
          this.showNavioErrorMessage = true;
        },
        () => {
          this.authService.hideLoading();
        }
      );
  }

  changeSlideToLeft() {
    //this.slideLeftSelected = true;
    this.slides.slideTo(0, 500);
  }

  changeSlideToRight() {
    //this.slideLeftSelected = false;
    this.slides.slideTo(1, 500);
  }

  vistoriarNavio(navio: Navio) {
    this.navCtrl.push(NovaConferenciaConfiguracaoAreaPage, {
      navio: navio
    });
  }

  vistoriarArquivo(arquivo: Arquivo) {
    this.navCtrl.push(LancamentoAvariaVistoriaLancarPage, {
      arquivo: arquivo
    });
  }

  slideChanged() {
    this.slideLeftSelected = !this.slideLeftSelected;
    setTimeout(() => {
      this.pageTop.scrollToTop();
    }, 200);
  }

  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  navigateToLancar() {
    this.navCtrl.push(LancamentoAvariaPage);
  }
  voltar() {
    this.navCtrl.pop();
  }



  configurarNavio(navio: Navio) {
    this.navCtrl.push(NovaConferenciaConfiguracaoAreaPage, {
      navio: navio
    });
  }

  configurarArquivo(arquivo: Arquivo) {
    this.navCtrl.push(NovaConferenciaConfiguracaoAreaPage, {
      arquivo: arquivo
    });
  }

}
