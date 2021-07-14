import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NavioDataService } from '../../providers/navio-data-service';
import { Navio } from '../../model/navio';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { ConferenciaNavioResumoPage } from '../conferencia-navio-resumo/conferencia-navio-resumo';
import { NavioStorageProvider } from '../../providers/storage/navio-storage-provider';
import { Arquivo } from '../../model/arquivo';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaPlanilhaResumoPage } from '../conferencia-planilha-resumo/conferencia-planilha-resumo';
import { ArquivoStorageProvider } from '../../providers/storage/arquivo-storage-provider';
import { ArquivoDataService } from '../../providers/arquivo-data-service';
import { ConferenciaLoteOnlineListagemPage } from '../conferencia-lote-online-listagem/conferencia-lote-online-listagem';

@Component({
  selector: 'page-conferencia-navio',
  templateUrl: 'conferencia-navio.html'
})
export class ConferenciaNavioPage {
  navios: Navio[] = [];
  showErrorMessage: boolean = false;
  isOnline: string;
  titulo: string;
  planilhas: Arquivo[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public navioDataService: NavioDataService,
    public arquivoDataService: ArquivoDataService,
    public conferenciaDataService: ConferenciaDataService,
    public navioStorageProvider: NavioStorageProvider,
    public arquivoStorageProvider: ArquivoStorageProvider
  ) {
    this.isOnline = navParams.data.isOnline;
    if (this.isOnline) {
      this.titulo = 'Online';
    } else {
      this.titulo = 'Offline';
    }
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ConferenciaNavioPage');

    // this.authService.showLoading();

    // this.navioDataService.carregarNavios(false, true, true, false).subscribe(
    //   res => {
    //     if (res.sucesso) {
    //       this.navios = res.retorno;

    //       if (!this.isOnline) {
    //         this.navios.forEach((navio: Navio) => {
    //           this.navioStorageProvider
    //             .getNaviosIds(this.authService.getUserData().id)
    //             .then(ids => {
    //               navio.disponivelOffline =
    //                 ids.find(id => id == navio.id) != null;
    //             })
    //             .catch(error => console.error(error));
    //         });
    //       }

    //       // Carrega as planilhas
    //       this.conferenciaDataService.listarPlanilhas(true).subscribe(
    //         res => {
    //           if (res.sucesso) {
    //             this.planilhas = res.retorno;

    //             if (!this.isOnline) {
    //               this.planilhas.forEach((planilha: Arquivo) => {
    //                 this.arquivoStorageProvider
    //                   .getArquivoIds(this.authService.getUserData().id)
    //                   .then(ids => {
    //                     planilha.disponivelOffline =
    //                       ids.find(id => id == planilha.id) != null;
    //                   })
    //                   .catch(error => console.error(error));
    //               });
    //             }
    //           } else {
    //             console.error('error', res.mensagem);
    //             this.showErrorMessage = true;
    //           }

    //           this.authService.hideLoading();
    //         },
    //         error => {
    //           console.error('error', error);
    //           this.showErrorMessage = true;
    //           this.authService.hideLoading();
    //         }
    //       );
    //     } else {
    //       console.error('error', res.mensagem);
    //       this.showErrorMessage = true;
    //       this.authService.hideLoading();
    //     }

    //   },
    //   error => {
    //     console.error('error', error);
    //     this.showErrorMessage = true;
    //     this.authService.hideLoading();
    //   }
    // );
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

  continuar(navio: Navio) {
    this.navCtrl.push(ConferenciaLoteOnlineListagemPage, {
      navio: navio,
      isOnline: this.isOnline
    });
  }

  continuarPlanilha(planilha: Arquivo) {
    this.navCtrl.push(ConferenciaPlanilhaResumoPage, {
      planilha: planilha,
      isOnline: this.isOnline
    });
  }
}
