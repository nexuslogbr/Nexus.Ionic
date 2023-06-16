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
import { VistoriaPage } from '../vistoria/vistoria';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';


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
// 3141 mnu_mob_avaria
// 3145 mnu_mob_buscaravaria


const menus = [
  {
    texto: 'Recebimento',
    cssClass: 'reception',
    id: 3101,
    nome: 'mnu_mob_recebimento'
  },
  {
    texto: 'Parqueamento',
    cssClass: 'storage',
    id: 3102,
    nome: 'mnu_mob_parqueamento'
  },
  {
    texto: 'Receber/Parquear',
    cssClass: 'receber-parquear',
    id: 3103,
    nome: 'mnu_mob_receberparquear'
  },
  {
    texto: 'Conferência',
    cssClass: 'conferir',
    id: 3104,
    nome: 'mnu_mob_conferencia'
  },
  {
    texto: 'Parquear/Bloco',
    cssClass: 'parquear-bloco',
    id: 3105,
    nome: 'mnu_mob_parquearbloco'
  },
  {
    texto: 'Movimentação',
    cssClass: 'movement',
    id: 3106,
    nome: 'mnu_mob_movimentacao'
  },
  {
    texto: 'Rechego',
    cssClass: 'trimming',
    id: 3107,
    nome: 'mnu_mob_rechego'
  },
  {
    texto: 'Carregamento',
    cssClass: 'load-truck',
    id: 3108,
    nome: 'mnu_mob_carregamento'
  },
  {
    texto: 'Carregamento Export.',
    cssClass: 'load-export',
    id: 3109,
    nome: 'mnu_mob_carregamentoexportacao'
  },
  {
    texto: 'Romaneio',
    cssClass: 'romaneio',
    id: 3110,
    nome: 'mnu_mob_romaneio'
  },

  {
    texto: 'Bloqueio/Desbloqueio',
    cssClass: 'bloqueio',
    id: 3119,
    nome: 'mnu_mob_bloqueio'
  },
  {
    texto: 'Observações',
    cssClass: 'observacoes',
    id: 3120,
    nome: 'mnu_mob_observacao'
  },
  {
    texto: 'Lançamento de Serviço',
    cssClass: 'lancamento-servico',
    id: 3111,
    nome: 'mnu_mob_servico'
  },

  {
    texto: 'Histórico de Chassi',
    cssClass: 'historico-chassi',
    id: 3118,
    nome: 'mnu_mob_historicochassi'
  },

  {
    texto: 'Módulo de Qualidade',
    cssClass: 'vistoriar',
    id: 3118,
    nome: 'mnu_mob_qualidade'
  },

  {
    texto: 'Vistoriar',
    cssClass: 'vistoriar',
    id: 3142,
    nome: 'mnu_mob_vistoria'
  },

  // {
  //   texto: 'Buscar Avaria',
  //   cssClass: 'vistoriar',
  //   id: 3145,
  //   nome: 'mnu_mob_buscaravaria'
  // },

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

    console.log(this.userData)

    if (this.userData && this.userData.nomesMenus) {
      this.userMenus = menus.filter((m) =>
        this.userData.nomesMenus.some((mm) => mm == m['nome'])
      );

      // console.log(this.userData.nomesMenus)

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
    // 0000	mnu_mob_qualidade

    console.log(menu)
    // if (menu.id == 3101) {
    //   this.navCtrl.setRoot(RecebimentoPage);
    // } else if (menu.id == 3102) {
    //   this.navCtrl.setRoot(ParqueamentoPage);
    // } else if (menu.id == 3103) {
    //   this.navCtrl.setRoot(ReceberParquearPage);
    // } else if (menu.id == 3104) {
    //   this.authService.setFila('');
    //   this.navCtrl.push(NovaConferenciaMenuPage);
    // } else if (menu.id == 3105) {
    //   this.authService.setFila('');
    //   this.navCtrl.setRoot(ParquearBlocoPage);
    // } else if (menu.id == 3106) {
    //   this.navCtrl.setRoot(MovimentacaoPage);
    // } else if (menu.id == 3107) {
    //   this.authService.setFila('');
    //   this.navCtrl.setRoot(RechegoPage);
    // } else if (menu.id == 3108) {
    //   this.navCtrl.setRoot(CarregamentoPage);
    // } else if (menu.id == 3109) {
    //   this.navCtrl.setRoot(CarregamentoExportOperacaoPage);
    // } else if (menu.id == 3110) {
    //   this.authService.limparRomaneio();
    //   this.navCtrl.setRoot(RomaneioPage);
    // } else if (menu.id == 3118) {
    //   this.navCtrl.setRoot(HistoricoChassiPage);
    // } else if (menu.id == 3119) {
    //   this.navCtrl.setRoot(BloqueioPage);
    // } else if (menu.id == 3120) {
    //   this.navCtrl.setRoot(ObservacoesPage);
    // } else if (menu.id == 3111) {
    //   this.navCtrl.setRoot(LancamentoServicoPage);
    // } else if (menu.id == 3142) {
    //   this.navCtrl.setRoot(VistoriaPage);
    // }


    if (menu.nome == 'mnu_mob_recebimento') {
      this.navCtrl.setRoot(RecebimentoPage);
    } else if (menu.nome == 'mnu_mob_parqueamento') {
      this.navCtrl.setRoot(ParqueamentoPage);
    } else if (menu.nome == 'mnu_mob_receberparquear') {
      this.navCtrl.setRoot(ReceberParquearPage);
    } else if (menu.nome == 'mnu_mob_conferencia') {
      this.authService.setFila('');
      this.navCtrl.push(NovaConferenciaMenuPage);
    } else if (menu.nome == 'mnu_mob_parquearbloco') {
      this.authService.setFila('');
      this.navCtrl.setRoot(ParquearBlocoPage);
    } else if (menu.nome == 'mnu_mob_movimentacao') {
      this.navCtrl.setRoot(MovimentacaoPage);
    } else if (menu.nome == 'mnu_mob_rechego') {
      this.authService.setFila('');
      this.navCtrl.setRoot(RechegoPage);
    } else if (menu.nome == 'mnu_mob_carregamento') {
      this.navCtrl.setRoot(CarregamentoPage);
    } else if (menu.nome == 'mnu_mob_carregamentoexportacao') {
      this.navCtrl.setRoot(CarregamentoExportOperacaoPage);
    } else if (menu.nome == 'mnu_mob_romaneio') {
      this.authService.limparRomaneio();
      this.navCtrl.setRoot(RomaneioPage);
    } else if (menu.nome == 'mnu_mob_historicochassi') {
      this.navCtrl.setRoot(HistoricoChassiPage);
    } else if (menu.nome == 'mnu_mob_bloqueio') {
      this.navCtrl.setRoot(BloqueioPage);
    } else if (menu.nome == 'mnu_mob_observacao') {
      this.navCtrl.setRoot(ObservacoesPage);
    } else if (menu.nome == 'mnu_mob_servico') {
      this.navCtrl.setRoot(LancamentoServicoPage);
    } else if (menu.nome == 'mnu_mob_vistoria') {
      this.navCtrl.setRoot(VistoriaPage);
    } else if (menu.nome == 'mnu_mob_qualidade') {
      this.navCtrl.setRoot(QualidadeMenuPage);
    }
    // else if (menu.nome == 'mnu_mob_vistoria') {
    //   this.navCtrl.setRoot(VistoriaPage);
    // }
    // else if (menu.nome == 'mnu_mob_buscaravaria') {
    //   this.navCtrl.setRoot(BuscarAvariasPage);
    // }
  }
}
