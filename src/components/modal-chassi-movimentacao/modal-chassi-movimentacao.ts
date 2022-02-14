import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalRecebimentoComponent } from '../../components/modal-recebimento/modal-recebimento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { FormMovimentacaoComponent } from '../../components/form-movimentacao/form-movimentacao';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-chassi-movimentacao',
  templateUrl: 'modal-chassi-movimentacao.html'
})
export class ModalChassiMovimentacaoComponent {
  @ViewChild('movSelect') movSelect: Select;

  title: string;
  chassis: any;
  novoChassi: string;
  private url: string;
  responseData2: any;
  responseData: any;
  responseCarData: any;
  formMovimentacaoData = {
    "token":"",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":''
  };

  recebimentoData = {
    "token":"",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":''
  };

  primaryColor:string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(public http: HttpClient, private modal: ModalController, private navParam: NavParams, private view: ViewController, public navCtrl: NavController, public authService: AuthService) {
    this.title = 'Movimentação';
    console.log('ModalChassiMovimentacaoComponent');
    this.url = this.authService.getUrl();
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
    setTimeout(() => {
      this.movSelect.open();
    },150);
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.chassis = data;
  }
  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;
    $('.login-content').css('display','block');
  }
  cancelar(){
    this.navCtrl.push(RecebimentoPage);
  }
  ConsultarChassi(){

    this.view.dismiss();
    this.movSelect.close();

    let consultarChassi = this.url+"/Movimentar/ConsultarChassi?token="+ this.authService.getToken() +"&chassi="+this.novoChassi;


    this.authService.showLoading();

    this.formMovimentacaoData.token = this.authService.getToken();

    this.http.get( consultarChassi)
    .subscribe(res => {

      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        this.openModal(this.responseData.retorno);
        this.formMovimentacaoData.id = this.responseData.retorno['id'];

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);

      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
    });
  }
  openModal(data){

    const recModal: Modal = this.modal.create(FormMovimentacaoComponent, {data: data });
    recModal.present();

    recModal.onDidDismiss((data) => {
      console.log(data);
    })
    recModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })

  }

  openModalRecebimento(data){

    const recModal: Modal = this.modal.create(ModalRecebimentoComponent, {data: data });
    recModal.present();

    recModal.onDidDismiss((data) => {
      console.log(data);
    })
    recModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })

  }
  closeModal(){
    const data = {};
    this.view.dismiss(data);
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }

  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }
}
