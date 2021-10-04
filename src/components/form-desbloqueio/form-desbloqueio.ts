import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { BloqueioPage } from '../../pages/bloqueio/bloqueio';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'form-desbloqueio',
  templateUrl: 'form-desbloqueio.html'
})
export class FormDesbloqueioComponent {
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

  FormBloqueioData = {
    "id": '',
    "veiculoID": '',
    "tipoBloqueioID": '',
    "dataBloqueio": '',
    "dataDesbloqueio": '',
    "descricaoBloqueio": '',
    "observacaoDesbloqueio": '',
    "usuarioBloqueio": '',
    "usuarioDesbloqueio": '',
    "chassi":''
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
  dadosDesbloqueio: any; 
  responseData2: any; 
  responseData3: any; 
  responseData4: any; 
  responseData5: any;   
  retorno: any;
  tShow: boolean;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    // console.log('Hello FormMovimentacaoComponent Component');
    this.title = "Desbloqueio"; 
    
    console.log('FormBloqueioComponent');
    this.url = this.authService.getUrl();

  }
  ionViewDidEnter() {

    if( this.authService.getLayout() ){
      this.tShow = false;
      this.authService.showLoading();

    }else{
      this.tShow = true; 
    }     
  }
  ionViewWillLoad(){
    
     const data = this.navParam.get('data');
    
    console.log(data)
    
    debugger
      this.FormBloqueioData = data.retorno[0];
      this.FormBloqueioData.dataDesbloqueio = new Date().toLocaleDateString();
  
   
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
  //  loadTiposBloqueio(){
    
  //   this.authService.showLoading();

  //   let listarBloqueios = this.url+"/Bloqueio/TiposDesbloqueio?token="+ this.authService.getToken();

  //   this.http.get<dataRetorno>( listarBloqueios)
  //   .subscribe(res => {
      
  //     this.responseData2 = res;

  //       if(this.responseData2.sucesso){
  //         this.tipos = this.responseData2.retorno;
  //         //this.novoFormMovimentacaoData.id = this.id;
  //         //PREENCHER O SELECT DO LAYOUT    
  //       //  this.layouts = this.responseData2.retorno;
  //         this.authService.hideLoading();

  //         // console.log(this.responseData2.retorno);
  //         // console.log(this.novoFormMovimentacaoData);

  //       }else{
  //         this.authService.hideLoading();
  //         this.openModalErro(this.responseData2.mensagem);
  //       }

  //   }, (error) => {
      
  //     this.openModalErro(error.status+' - '+error.statusText);
  //     this.authService.hideLoading();
  //     console.log(error);
  //   });
  // } 


  
  Desbloquear(){

    
    this.authService.showLoading();
    let desbloquearVeiculo = this.url+"/Bloqueio/Desbloquear?token="+ this.authService.getToken();
  
    this.dadosDesbloqueio = {
      "id": this.FormBloqueioData.id,
      "observacaoDesbloqueio": this.FormBloqueioData.descricaoBloqueio
    }

    this.http.post<dataRetorno>( desbloquearVeiculo, this.dadosDesbloqueio, httpOptions)
    .subscribe(res => {

      this.retorno = '';
      this.retorno = res;

      console.log(this.retorno);

      if(this.retorno.sucesso){

        this.authService.hideLoading();
        var data = {
          message : "Desbloqueio realizada com",
          iconClass : "icon-desbloqueio"
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
      this.navCtrl.push(BloqueioPage);
      
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