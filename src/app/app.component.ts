import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
// import { NovoRomaneioPage } from '../pages/novo-romaneio/novo-romaneio';

import * as $ from 'jquery';
//import { ModalCancelarChassiPage } from '../pages/modal-cancelar-chassi/modal-cancelar-chassi';
import { ConferenciaStorageProvider } from '../providers/storage/conferencia-storage-provider';
import { AuthService } from '../providers/auth-service/auth-service';
import { ConferenciaDataService } from '../providers/conferencia-data-service';
import { DatabaseProvider } from '../providers/database/database';

@Component({
  templateUrl: 'app.html'
})
export class PatioAutomotivo {
  rootPage: any = LoginPage;
  //private executandoSincronizacao: boolean = false;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private conferenciaStorageProvider: ConferenciaStorageProvider,
    private authService: AuthService,
    private conferenciaDataService: ConferenciaDataService,
    db: DatabaseProvider,
    public app: App,
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      db.init();
    });

    platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNavs()[0];
      console.log('nav', nav);
      console.log('cangoback', nav.canGoBack());
      if (nav.canGoBack()) {
        nav.pop();
      } else {
        nav.popToRoot();
      }
    });
    //this.iniciarThreadSincronizacao();
  }

  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
  };

  // iniciarThreadSincronizacao() {
  //   console.log('iniciando a Thread de sincronização...')
  //   setInterval(async () => {
  //     try {
  //       await this.sicronizaConferenicaNavio();
  //       await this.sicronizaConferenicaPlanilha();
  //     } catch (exception) {
  //       console.error(exception);
  //       this.executandoSincronizacao = false;
  //     }
  //   }, 60000);
  // }

  // async sicronizaConferenicaNavio() {
  //   if (
  //     this.authService.getUserData() &&
  //     !this.executandoSincronizacao &&
  //     this.conferenciaStorageProvider.contemConferenciaNavioPendente()
  //   ) {
  //     this.executandoSincronizacao = true;
  //     let usuarioId = this.authService.getUserData().id;

  //     let conferenciasPendentes: any[] = await this.conferenciaStorageProvider.getAllNavioConferencias();
  //     if (conferenciasPendentes && conferenciasPendentes.length) {
  //       for (let i = 0; i < conferenciasPendentes.length; i++) {
  //         let conferencia = conferenciasPendentes[i];
  //         console.log('conferencia', conferencia);
  //         try {
  //           let result = await this.conferenciaDataService
  //             .conferirChassiNavio(conferencia)
  //             .toPromise();
  //           console.log('result', result);
  //           if (result.sucesso) {
  //             let deleteSucesso = await this.conferenciaStorageProvider.deleteConferenciaByKey(
  //               conferencia.key
  //             );
  //             if (deleteSucesso) {
  //               console.log('sucesso ao exluir: ' + conferencia.key);
  //             }
  //           } else {
  //             console.error(result.mensagem);
  //           }
  //         } catch (exSync) {
  //           throw exSync;
  //         }
  //       }
  //     }
  //     this.executandoSincronizacao = false;
  //   }
  // }

  // async sicronizaConferenicaPlanilha() {
  //   if (
  //     this.authService.getUserData() &&
  //     !this.executandoSincronizacao &&
  //     this.conferenciaStorageProvider.contemConferenciaPlanilhaPendente(
  //       this.authService.getUserData().id
  //     )
  //   ) {
  //     this.executandoSincronizacao = true;
  //     let usuarioId = this.authService.getUserData().id;

  //     let conferenciasPendentes: any[] = await this.conferenciaStorageProvider.getAllPlanilhaConferencias(
  //       usuarioId
  //     );
  //     if (conferenciasPendentes && conferenciasPendentes.length) {
  //       for (let i = 0; i < conferenciasPendentes.length; i++) {
  //         let conferencia = conferenciasPendentes[i];
  //         console.log('conferencia', conferencia);
  //         try {
  //           let result = await this.conferenciaDataService
  //             .conferirChassiPlanilha(conferencia)
  //             .toPromise();
  //           console.log('result', result);
  //           if (result.sucesso) {
  //             let deleteSucesso = await this.conferenciaStorageProvider.deleteConferenciaByKey(
  //               conferencia.key
  //             );
  //             if (deleteSucesso) {
  //               console.log('sucesso ao exluir: ' + conferencia.key);
  //             }
  //           } else {
  //             console.error(result.mensagem);
  //           }
  //         } catch (exSync) {
  //           throw exSync;
  //         }
  //       }
  //     }
  //     this.executandoSincronizacao = false;
  //   }
  // }
}
