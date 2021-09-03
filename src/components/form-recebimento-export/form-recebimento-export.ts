import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'form-recebimento-export',
  templateUrl: 'form-recebimento-export.html'
})
export class FormRecebimentoExportComponent {

  title: string;
  formRecebimentoData = {
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":''
  };
  layouts: any;
  private url: string;
  responseData3: any;
  responseData5: any;
  responseData4: any;
  bolsoes: any;
  filas: any;
  posicoes: any;
  dadosParqueamento: any;
  responseCarData: any;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams,private view: ViewController, public authService: AuthService) {
    this.title = "Parqueamento Exportação";
    console.log('FormRecebimentoExportComponent');
    this.url = this.authService.getUrl();
  }
  ionViewDidEnter() {

  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.formRecebimentoData = data;
    console.log(this.formRecebimentoData);
    this.layouts = this.formRecebimentoData.layout;
  }
  onLayoutChange(selectedValue) {

    this.authService.showLoading();

    this.formRecebimentoData.layout = selectedValue;
    this.formRecebimentoData.chassi = this.formRecebimentoData['chassi'];
    this.formRecebimentoData.local = this.formRecebimentoData['local'];

    let listarBolsoes = this.url+"/ParquearExportacao/ListarBolsoes?token="+ this.authService.getToken() +"&layoutID="+selectedValue;

    this.http.get( listarBolsoes)
    .subscribe(res => {

      this.responseData3 = res;
      if(this.responseData3.sucesso){

       //PREENCHER O SELECT DO BOLSAO

       this.bolsoes = this.responseData3.retorno;
       this.authService.hideLoading();
      }else{
       this.authService.hideLoading();
       this.openModalErro(this.responseData3.mensagem);
      }

    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }

  onBolsaoChange(selectedValue) {

    this.authService.showLoading();
    this.formRecebimentoData.bolsao = selectedValue;

    let listarLinhas = this.url+"/ParquearExportacao/ListarLinhas?token="+ this.authService.getToken() +"&bolsaoID="+selectedValue;

    this.http.get( listarLinhas)
    .subscribe(res => {

      this.responseData4 = res;
      if(this.responseData4.sucesso){

       //PREENCHER O SELECT DA Fila

       this.filas = this.responseData4.retorno;
       this.authService.hideLoading();

      }else{
       this.authService.hideLoading();
       this.openModalErro(this.responseData4.mensagem);
      }

    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }

  onFilaChange(selectedValue) {
    this.authService.showLoading();
    this.formRecebimentoData.fila = selectedValue;

    let listarPosicoes = this.url+"/ParquearExportacao/ListarPosicoes?token="+ this.authService.getToken() +"&linhaID="+selectedValue;

    this.http.get( listarPosicoes)
    .subscribe(res => {

      this.responseData5 = res;
      if(this.responseData5.sucesso){

       //PREENCHER O SELECT DA POSIÇÂO

       this.posicoes = this.responseData5.retorno;
       this.authService.hideLoading();
      }else{
       this.authService.hideLoading();
       this.openModalErro(this.responseData5.mensagem);
      }

    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }
  onPosicaoChange(selectedValue){
    this.authService.showLoading();
      this.formRecebimentoData.posicao = selectedValue;
    this.authService.hideLoading();
  }
  closeModal(){
    this.view.dismiss(this.formRecebimentoData);
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }

  ParquearVeiculo(){

    this.authService.showLoading();

    let parquearVeiculo = this.url+"/ParquearExportacao/ParquearVeiculo?token="+this.authService.getToken();

    this.dadosParqueamento = {
      "veiculoID": this.formRecebimentoData.id,
      "posicaoID": this.formRecebimentoData.posicao
    }

    this.http.put( parquearVeiculo, this.dadosParqueamento, httpOptions)
    .subscribe(res => {

      this.responseCarData = '';
      this.responseCarData = res;

      if(this.responseCarData.sucesso){

        this.authService.hideLoading();

        var data = {
          message : "Parqueamento realizado com",
          iconClass : "parking-green"
        }
        this.openModalSucesso(data);
      }
      else{
        this.authService.hideLoading();
        this.openModalErro(this.responseCarData.mensagem);
        console.log(this.responseCarData);
      }

    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }

  navigateToHomePage(){
    this.navCtrl.push(HomePage);
  }
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(ReceberParquearPage);
    })
  }
  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(ReceberParquearPage);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }
}
