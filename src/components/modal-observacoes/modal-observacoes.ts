import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController,
} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalRecebimentoComponent } from '../modal-recebimento/modal-recebimento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { Select } from 'ionic-angular';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBloqueioComponent } from '../form-bloqueio/form-bloqueio';
import { FormObservacoesComponent } from '../form-observacoes/form-observacoes';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Component({
  selector: 'modal-observacoes',
  templateUrl: 'modal-observacoes.html',
})
export class ModalObservacoesComponent {
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
    this.title = 'Observações';
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();


    debugger
    var chassi_ = Array.of(this.navParam.get('data'));
    console.log(chassi_[0].chassi)
    this.chassis = Array.of(chassi_[0].chassi);

    this.formObservacoesData.id = (chassi_[0].id);



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
    this.navCtrl.push(RecebimentoPage);
  }




  bloquearVeiculo(res) {

    console.log(res);


    this.formObservacoesData.chassi = this.novoChassi;
   // this.openFormBloqueio(this.formObservacoesData);

   this.consultarChassi();
  }

  consultarChassi() {

    let uriBuscaChassi =
      '/Observacao/Observacoes?token=' +
      this.authService.getToken() +
      '&veiculoID=' +
      this.formObservacoesData.id;

    this.authService.showLoading();
    this.formObservacoesData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {
        
        this.responseData = res;
        // this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          //this.openModalChassis(this.responseData.retorno);
          // if(this.responseData.retorno.length > 0){
          //   this.openModalErro('Chassi já bloqueado');
          // }else{
            this.openFormObservacoes(this.formObservacoesData);
         // }

        } else {
          this.authService.hideLoading();
          if (this.modoOperacao == 1 || this.novoChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem);
          } else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem);
          } else if (
            this.modoOperacao == 2 &&
            this.responseData.dataErro == 'CHASSI_NOT_FOUND'
          ) {
         //   this.openModalChassis([this.novoChassi], byScanner);
          } else {
           this.openModalErro(this.responseData.mensagem);
          }
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText);
      }
    );
  }


  openFormObservacoes(data) {

    const recModal: Modal = this.modal.create(FormObservacoesComponent, {
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
}
