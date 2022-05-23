import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { BloqueioPage } from '../../pages/bloqueio/bloqueio';
import { ObservacoesPage } from '../../pages/observacoes/observacoes';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'form-observacoes',
  templateUrl: 'form-observacoes.html'
})
export class FormObservacoesComponent {
  @ViewChild('select1') select1: Select;

  title: string;
  formMovimentacaoData = {
    "id": '',
    "chassi": '',
    "localAtual": '',
    "layoutAtual": '',
    "bolsaoAtual": '',
    "fila": '',
    "posicaoAtual":'',
    "status":''
  };
  novoFormMovimentacaoData = {
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":'',
    "layoutNome":''
  };

  FormObservacaoData = {
    'id':'',
    'chassi':'',
    'veiculoID': '',
    'tipoObservacaoID': '',
    'descricao': ''
  };
  chassi: string;
  data_hora:string;
  bolsaoAtual: string;
  localAtual: string;
  layoutAtual: string;
  posicaoAtual: string;
 // chassi: string;
  tipos:any;
  posicao: string;
  id: string;
  parametros: any;
  private url: string;

  bolsoes: any;
  filas: any;
  posicoes: any;
  dadosObservacao: any;
  responseData2: any;
  responseData3: any;
  responseData4: any;
  responseData5: any;
  retorno: any;
  tShow: boolean;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    // console.log('Hello FormMovimentacaoComponent Component');
    this.title = "Observações";

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

    console.log('FormBloqueioComponent');
    this.url = this.authService.getUrl();


    this.loadTiposBloqueio();
  }
  ionViewDidEnter() {

    if( this.authService.getLayout() ){
      this.tShow = false;
      //this.novoFormMovimentacaoData.layout = this.authService.getLayout();
      //this.novoFormMovimentacaoData.layoutNome = this.authService.getLayoutNome();
      this.authService.showLoading();
      // let listarBolsoes = this.url+"/Movimentar/ListarBolsoes?token="+ this.authService.getToken() +"&layoutID="+this.novoFormMovimentacaoData.layout;

      // this.http.get<dataRetorno>( listarBolsoes, {})
      // .subscribe(res => {

      //   this.responseData3 = res;
      //   if(this.responseData3.sucesso){

      //   //PREENCHER O SELECT DO BOLSAO

      //   this.bolsoes = this.responseData3.retorno;
      //   this.authService.hideLoading();
      //   }else{
      //   this.authService.hideLoading();
      //   this.openModalErro(this.responseData3.mensagem);
      //   }

      // }, (error) => {

      //   this.openModalErro(error.status+' - '+error.statusText);
      //   this.authService.hideLoading();
      //   console.log(error);
      // });

    }else{
      this.tShow = true;
    }
  }
  ionViewWillLoad(){

     const data = this.navParam.get('data');

    console.log(data)


      this.FormObservacaoData = data;



     // this.FormBloqueioData.data_hora = new Date().toLocaleDateString();
    // // console.log(data);
    // // console.log(this.formMovimentacaoData);
    // this.chassi = data.chassi;
    // this.localAtual = data.localAtual;
    // this.layoutAtual = data.layoutAtual;
    // this.posicaoAtual = data.posicaoAtual;
    // this.bolsaoAtual = data.bolsaoAtual;
    // this.novoFormMovimentacaoData.local = data.localAtual;
    // this.id = data.id;
    // this.loadLayout();

  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
  closeModal(){

    this.view.dismiss();
  }
  cancelar(){
    this.navCtrl.push(MovimentacaoPage);
  }
   loadTiposBloqueio(){

    this.authService.showLoading();

    let listarBloqueios = this.url+"/Observacao/TiposObservacao?token="+ this.authService.getToken();

    this.http.get<dataRetorno>( listarBloqueios)
    .subscribe(res => {

      this.responseData2 = res;

        if(this.responseData2.sucesso){
          this.tipos = this.responseData2.retorno;
          //this.novoFormMovimentacaoData.id = this.id;
          //PREENCHER O SELECT DO LAYOUT
        //  this.layouts = this.responseData2.retorno;
          this.authService.hideLoading();

          // console.log(this.responseData2.retorno);
          // console.log(this.novoFormMovimentacaoData);

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData2.mensagem);
        }

    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }


onTipoChange(selectedValue){
  this.FormObservacaoData.tipoObservacaoID = selectedValue;


}

  Bloquear(){


    this.authService.showLoading();
    let observacaoVeiculo = this.url+"/Observacao/Incluir?token="+ this.authService.getToken();



    this.dadosObservacao = {
      "veiculoID": this.FormObservacaoData.id,
      "tipoObservacaoID":this.FormObservacaoData.tipoObservacaoID,
      "descricao": this.FormObservacaoData.descricao
    }

    this.http.post<dataRetorno>( observacaoVeiculo, this.dadosObservacao, httpOptions)
    .subscribe(res => {

      this.retorno = '';
      this.retorno = res;

      console.log(this.retorno);

      if(this.retorno.sucesso){

        this.authService.hideLoading();
        var data = {
          message : "Observação realizada com",
          iconClass : "icon-observacao"
        }
        this.openModalSucesso(data);

      }
      else{
        this.authService.hideLoading();
        this.openModalErro(this.retorno.mensagem);
        // this.navCtrl.push(HomePage);
      }

    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });

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
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
      this.navCtrl.push(ObservacoesPage);

    })
  }

}
interface dataRetorno{
  dataErro: string;
  mensagem: string;
  retorno: any;
  sucesso: boolean;
  tipo: number;
  urlRedirect: string
}
