import { Usuario } from './../../model/usuario';
import { Component } from '@angular/core';
import { NavController, App, ViewController, Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import { HistoricoChassiPage } from '../../pages/historico-chassi/historico-chassi';
import { RechegoPage } from '../../pages/rechego/rechego';
import { ParquearBlocoPage } from '../../pages/parquear-bloco/parquear-bloco';
import * as $ from 'jquery';
import { CarregamentoSimulacaoPage } from '../carregamento-simulacao/carregamento-simulacao';
import { CarregamentoExportOperacaoPage } from '../carregamento-export-operacao/carregamento-export-operacao';
import { ConferenciaMenuPage } from '../conferencia-menu/conferencia-menu';
import { NovaConferenciaMenuPage } from '../nova-conferencia-menu/nova-conferencia-menu';
import { BloqueioPage } from '../bloqueio/bloqueio';
import { LancamentoServicoPage } from '../lancamento-servico/lancamento-servico';
import { ObservacoesPage } from '../observacoes/observacoes';
import { Storage } from '@ionic/storage';


// 3101	mnu_mob_recebimento
// 3102	mnu_mob_parqueamento
// 3103	mnu_mob_receberparquear
// 3104	mnu_mob_conferencia
// 3105	mnu_mob_parquearbloco
// 3106	mnu_mob_movimentacao
// 3107	mnu_mob_rechego
// 3108	mnu_mob_carregamento
// 3109	mnu_mob_carregamentoexportacao
// 3110	mnu_mob_romaneio
// 3111	mnu_mob_historicochassi
// 3122	mnu_mob_bloqueio
// 3123	mnu_mob_observacao
// 3124	mnu_mob_servico


// 3142 mnu_mob_vistoria

const menus = [
  {
    texto: 'Recebimento',
    cssClass: 'reception',
    id: 3101,
  },
  {
    texto: 'Parqueamento',
    cssClass: 'storage',
    id: 3102,
  },
  {
    texto: 'Receber/Parquear',
    cssClass: 'receber-parquear',
    id: 3103,
  },
  {
    texto: 'Conferência',
    cssClass: 'conferir',
    id: 3104,
  },
  {
    texto: 'Parquear/Bloco',
    cssClass: 'parquear-bloco',
    id: 3105,
  },
  {
    texto: 'Movimentação',
    cssClass: 'movement',
    id: 3106,
  },
  {
    texto: 'Rechego',
    cssClass: 'trimming',
    id: 3107,
  },
  {
    texto: 'Carregamento',
    cssClass: 'load-truck',
    id: 3108,
  },
  {
    texto: 'Carregamento Export.',
    cssClass: 'load-export',
    id: 3109,
  },
  {
    texto: 'Romaneio',
    cssClass: 'romaneio',
    id: 3110,
  },
  {
    texto: 'Histórico de Chassi',
    cssClass: 'historico-chassi',
    id: 3111,
  },
  {
    texto: 'Bloqueio/Desbloqueio',
    cssClass: 'bloqueio',
    id: 3122,
  },
  {
    texto: 'Observações',
    cssClass: 'observacoes',
    id: 3123,
  },
  {
    texto: 'Lançamento de Serviço',
    cssClass: 'lancamento-servico',
    id: 3124,
  },
  {
    texto: 'Vistoriar',
    cssClass: 'vistoriar',
    id: 3142,
  }


];
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  title: string;
  tes: any;
  userData: Usuario;
  userMenus = [];

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public storage: Storage,
    public platform: Platform
  ) {
    this.title = 'Sistema Pátio Automotivo';
    this.userData = this.authService.getUserData();

    if (this.userData && this.userData.menus) {
      this.userMenus = menus.filter((m) =>
        this.userData.menus.some((mm) => mm == m.id)
      );
    }

    this.storage.set('parqueamento', null);


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

    // if (this.userData && this.userData.menus) {
    //   this.userMenus = menus.filter((m) =>
    //     this.userData.menus.some((mm) => mm == m.id)
    //   );
    //   this.userMenus = menus;


    // }
  }

  ionViewDidEnter() {
    this.authService.setLayout('');
    this.authService.setLayoutNome('');
    this.authService.addRomaneio('');
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  // navigateToRecebimentoPage() {
  //   this.navCtrl.setRoot(RecebimentoPage);
  // }

  // navigateToParqueamentoPage() {
  //   this.navCtrl.setRoot(ParqueamentoPage);
  // }

  // navigateToCarregamentoPage() {
  //   this.navCtrl.setRoot(CarregamentoPage);
  // }

  // navigateToMovimentacaoPage() {
  //   this.navCtrl.setRoot(MovimentacaoPage);
  // }

  // navigateToRomaneioPage() {
  //   this.authService.limparRomaneio();
  //   this.navCtrl.setRoot(RomaneioPage);
  // }

  // navigateToReceberParquearPage() {
  //   this.navCtrl.setRoot(ReceberParquearPage);
  // }

  // navigateToCarregamentoExportPage() {
  //   this.navCtrl.setRoot(CarregamentoExportOperacaoPage);
  // }

  // navigateToSimulacaoCarregamento() {
  //   this.navCtrl.setRoot(CarregamentoSimulacaoPage);
  // }

  // historicoChassiPage() {
  //   this.navCtrl.setRoot(HistoricoChassiPage);
  // }

  // navigateToRechegoPage() {
  //   this.authService.setFila('');
  //   this.navCtrl.setRoot(RechegoPage);
  // }

  // navigateToParquearEmBlocoPage() {
  //   this.authService.setFila('');
  //   this.navCtrl.setRoot(ParquearBlocoPage);
  // }

  // navigateToConferencia() {
  //   this.authService.setFila('');
  //   this.navCtrl.push(ConferenciaMenuPage);
  // }

  // navigateToNovaConferencia() {
  //   this.authService.setFila('');
  //   this.navCtrl.push(NovaConferenciaMenuPage);
  // }

  chamar(menu) {

    // 3101	mnu_mob_recebimento
    // 3102	mnu_mob_parqueamento
    // 3103	mnu_mob_receberparquear
    // 3104	mnu_mob_conferencia
    // 3105	mnu_mob_parquearbloco
    // 3106	mnu_mob_movimentacao
    // 3107	mnu_mob_rechego
    // 3108	mnu_mob_carregamento
    // 3109	mnu_mob_carregamentoexportacao
    // 3110	mnu_mob_romaneio
    // 3111	mnu_mob_historicochassi
    // 3122	mnu_mob_bloqueio
    // 3123	mnu_mob_observacao
    // 3124	mnu_mob_servico

    // 3142 mnu_mob_vistoria

    console.log(menu)
    if (menu.id == 3101) {
      this.navCtrl.setRoot(RecebimentoPage);
    } else if (menu.id == 3102) {
      this.navCtrl.setRoot(ParqueamentoPage);
    } else if (menu.id == 3103) {
      this.navCtrl.setRoot(ReceberParquearPage);
    } else if (menu.id == 3104) {
      this.authService.setFila('');
      this.navCtrl.push(NovaConferenciaMenuPage);
    } else if (menu.id == 3105) {
      this.authService.setFila('');
      this.navCtrl.setRoot(ParquearBlocoPage);
    } else if (menu.id == 3106) {
      this.navCtrl.setRoot(MovimentacaoPage);
    } else if (menu.id == 3107) {
      this.authService.setFila('');
      this.navCtrl.setRoot(RechegoPage);
    } else if (menu.id == 3108) {
      this.navCtrl.setRoot(CarregamentoPage);
    } else if (menu.id == 3109) {
      this.navCtrl.setRoot(CarregamentoExportOperacaoPage);
    } else if (menu.id == 3110) {
      this.authService.limparRomaneio();
      this.navCtrl.setRoot(RomaneioPage);
    } else if (menu.id == 3111) {
      this.navCtrl.setRoot(HistoricoChassiPage);
    } else if (menu.id == 3122) {
      this.navCtrl.setRoot(BloqueioPage);
    } else if (menu.id == 3123) {
      this.navCtrl.setRoot(ObservacoesPage);
    } else if (menu.id == 3124) {
      this.navCtrl.setRoot(ObservacoesPage);
    }else if (menu.id == 3142) {

    }

  }
}
