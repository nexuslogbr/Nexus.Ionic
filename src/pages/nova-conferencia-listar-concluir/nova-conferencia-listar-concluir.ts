import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { Navio } from '../../model/navio';
import { Arquivo } from '../../model/arquivo';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavioDataService } from '../../providers/navio-data-service';
import { ArquivoDataService } from '../../providers/arquivo-data-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';
import { NovaConferenciaConfiguracaoAreaPage } from '../nova-conferencia-configuracao-area/nova-conferencia-configuracao-area';
import * as $ from 'jquery';
import { NovaConferenciaListarFinalizadasPage } from '../nova-conferencia-listar-finalizadas/nova-conferencia-listar-finalizadas';

@Component({
  selector: 'page-nova-conferencia-listar-concluir',
  templateUrl: 'nova-conferencia-listar-concluir.html',
})
export class NovaConferenciaListarConcluirPage {
  @ViewChild(Slides) slides: Slides;
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
    console.log('ionViewWillEnter NovaConferenciaListarConcluirPage');

    this.authService.showLoadingWhite();

    forkJoin([
      this.navioDataService.carregarNavios(null, null, null, null, true),
      this.arquivoDataService.carregarArquivosDePlanilhasConferencia(
        null,
        null,
        null, true
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
          this.authService.hideLoadingWhite();
        }
      );
  }

  changeSlideToLeft() {
    this.slides.slideTo(0, 500);
  }

  changeSlideToRight() {
    this.slides.slideTo(1, 500);
  }

  configurarNavio(navio: Navio) {
    this.navCtrl.push(NovaConferenciaListarFinalizadasPage, {
      navio: navio
    });
  }

  configurarArquivo(arquivo: Arquivo) {
    // this.navCtrl.push(NovaConferenciaConfiguracaoAreaPage, {
    //   arquivo: arquivo
    // });
    this.navCtrl.push(NovaConferenciaListarFinalizadasPage, {
      arquivo: arquivo
    });
  }

  slideChanged() {
    this.slideLeftSelected = !this.slideLeftSelected;
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
