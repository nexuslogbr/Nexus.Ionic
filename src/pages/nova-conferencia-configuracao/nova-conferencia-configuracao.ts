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

@Component({
  selector: 'page-nova-conferencia-configuracao',
  templateUrl: 'nova-conferencia-configuracao.html'
})
export class NovaConferenciaConfiguracaoPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('pageTop') pageTop: Content;
  slideLeftSelected: boolean = true;
  navios: Navio[] = [];
  arquivos: Arquivo[] = [];
  showNavioErrorMessage: boolean = false;
  showArquivoErrorMessage: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public navioDataService: NavioDataService,
    public arquivoDataService: ArquivoDataService
  ) {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter NovaConferenciaConfiguracaoPage');

    this.authService.showLoadingWhite();

    forkJoin([
      this.navioDataService.carregarNavios(false, null, null, true, null),
      this.arquivoDataService.carregarArquivosDePlanilhasConferencia(
        null,
        null,
        true,
        null
      )
    ])
      .pipe(
        finalize(() => {
          this.authService.hideLoadingWhite();
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

  voltar() {
    this.navCtrl.pop();
  }
}
