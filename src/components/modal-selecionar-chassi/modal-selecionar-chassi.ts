import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Modal, ModalController, NavController, NavParams, Select, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { LancamentoAvariaPage } from '../../pages/lancamento-avaria/lancamento-avaria';

@Component({
  selector: 'modal-selecionar-chassi',
  templateUrl: 'modal-selecionar-chassi.html'
})
export class ModalSelecionarChassiComponent {
  @ViewChild('select') select: Select;
  title: string;
  chassis: any;
  novoChassi: string;
  url: string;

  formObservacoesData = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
    veiculoID:''
  };

  bloqueioData = {
    token: '',
    id: '',
    chassi: '',
    notaFiscal: '',
    status: '',
    modelo: '',
    localAtual: '',
    layoutAtual: '',
    bolsaoAtual: '',
    posicaoAtual: '',
    conferido: '',
    conferenciaVeiculo: ''
  };

  modoOperacao: number;
  responseData:any;

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.title = 'Lançamento de Avaria';
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();

    this.responseData = Array.of(this.navParam.get('data'));
    if (this.responseData[0]) {
      this.chassis = Array.of(this.responseData[0].chassi);
      this.formObservacoesData.id = (this.responseData[0].id);
    }
  }

  ionViewDidLoad(){
    var teste =  this.navParam.get('data');
    console.log(teste);

  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.select.open();
    }, 150);
  }

  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;
    $('.login-content').css('display', 'block');
  }

  cancelar() {
    this.view.dismiss();
    this.select.close();
    // this.navCtrl.push(RecebimentoPage);
  }

  closeModal() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.select.close();
    this.view.dismiss(data);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  openModalChassis() {
    const chassiModal: Modal = this.modal.create(LancamentoAvariaPage, {
      data: this.responseData[0],
    });
    chassiModal.present();

    this.select.close();
    this.view.dismiss();
  }

  cleanInput() { setTimeout(() => { }, 1000); }

}
