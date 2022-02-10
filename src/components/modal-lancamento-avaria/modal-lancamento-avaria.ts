import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Modal, ModalController, NavController, NavParams, Select, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { FormLancamentoAvariaComponent } from '../form-lancamento-avaria/form-lancamento-avaria';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { LancamentoAvariaPage } from '../../pages/lancamento-avaria/lancamento-avaria';

@Component({
  selector: 'modal-lancamento-avaria',
  templateUrl: 'modal-lancamento-avaria.html'
})
export class ModalLancamentoAvariaComponent {
  @ViewChild('select') select: Select;
  title: string;
  chassis: any;
  novoChassi: string;
  url: string;

  formLancamentoServico = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
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

    var chassi_ = Array.of(this.navParam.get('data'));
    console.log(chassi_[0].chassi)
    this.chassis = Array.of(chassi_[0].chassi);

    this.formLancamentoServico.id = (chassi_[0].id);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.select.open();
    }, 150);
  }

  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;

    console.log('novo chassi', this.novoChassi)
    $('.login-content').css('display', 'block');
  }

  cancelar() {
    this.view.dismiss();
    this.select.close();
  }

  bloquearVeiculo(res) {
    this.formLancamentoServico.chassi = this.novoChassi;
    this.consultarLancamentoServico();
  }

  consultarLancamentoServico() {

    let uriBuscaChassi =
      '/Servico/Servicos?token=' +
      this.authService.getToken() +
      '&veiculoID=' +
      this.formLancamentoServico.id;

    this.authService.showLoading();
    this.formLancamentoServico.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {
        
        this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.openFormLancamentoAvaria(this.formLancamentoServico);
        } else {
          this.authService.hideLoading();
           this.openModalErro(this.responseData.mensagem);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText);
      }
    );
  }

  openFormLancamentoAvaria(data) {
    const recModal: Modal = this.modal.create(FormLancamentoAvariaComponent, {
      data: data,
    });
    recModal.present();

    recModal.onDidDismiss((data) => {
      console.log(data);
    });
    recModal.onWillDismiss((data) => {
      console.log('data');
      console.log(data);
    });
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();
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

  onMomentoChange($event){}

  busca(){}

  voltar(){
    const data = {};
    this.view.dismiss();
    this.navCtrl.push(LancamentoAvariaPage);
  }
}
