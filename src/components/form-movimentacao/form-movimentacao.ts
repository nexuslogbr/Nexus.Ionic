import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'form-movimentacao',
  templateUrl: 'form-movimentacao.html'
})
export class FormMovimentacaoComponent {
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
  chassi: string;
  bolsaoAtual: string;
  localAtual: string;
  layoutAtual: string;
  posicaoAtual: string;
  local: string;
  layout:string;
  posicao: string;
  layouts: any;
  id: string;
  parametros: any;
  private url: string;

  bolsoes: any;
  filas: any;
  posicoes: any;
  dadosParqueamento: any; 
  responseData2: any; 
  responseData3: any; 
  responseData4: any; 
  responseData5: any;   
  retorno: any;
  tShow: boolean;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    // console.log('Hello FormMovimentacaoComponent Component');
    this.title = "Movimentação"; 
    
    console.log('FormMovimentacaoComponent');
    this.url = this.authService.getUrl();
  }
  ionViewDidEnter() {

    if( this.authService.getLayout() ){
      this.tShow = false;
      this.novoFormMovimentacaoData.layout = this.authService.getLayout(); 
      this.novoFormMovimentacaoData.layoutNome = this.authService.getLayoutNome(); 
      this.authService.showLoading();
      let listarBolsoes = this.url+"/Movimentar/ListarBolsoes?token="+ this.authService.getToken() +"&layoutID="+this.novoFormMovimentacaoData.layout;
      
      this.http.get<dataRetorno>( listarBolsoes, {})
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

    }else{
      this.tShow = true; 
    }     
  }
  ionViewWillLoad(){
    
    const data = this.navParam.get('data');
    this.formMovimentacaoData = data;
    // console.log(data);
    // console.log(this.formMovimentacaoData);
    this.chassi = data.chassi;
    this.localAtual = data.localAtual;
    this.layoutAtual = data.layoutAtual;
    this.posicaoAtual = data.posicaoAtual;
    this.bolsaoAtual = data.bolsaoAtual;
    this.novoFormMovimentacaoData.local = data.localAtual;
    this.id = data.id;
    this.loadLayout();
   
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
  loadLayout(){
    
    this.authService.showLoading();

    let listarLayouts = this.url+"/Movimentar/ListarLayouts?token="+ this.authService.getToken();

    this.http.get<dataRetorno>( listarLayouts)
    .subscribe(res => {
      
      this.responseData2 = res;

        if(this.responseData2.sucesso){
          this.novoFormMovimentacaoData = this.responseData2.retorno;
          this.novoFormMovimentacaoData.id = this.id;
          //PREENCHER O SELECT DO LAYOUT    
          this.layouts = this.responseData2.retorno;
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
  onLayoutChange(selectedValue) {
    
    this.authService.showLoading();

    this.novoFormMovimentacaoData.layout = selectedValue;
    this.authService.setLayout(selectedValue);
    this.authService.setLayoutNome(this.select1.text);
    
    this.novoFormMovimentacaoData.layout = selectedValue;  

    let listarBolsoes = this.url+"/Movimentar/ListarBolsoes?token="+ this.authService.getToken() +"&layoutID="+selectedValue;
    
    this.http.get<dataRetorno>( listarBolsoes)
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
    this.novoFormMovimentacaoData.bolsao = selectedValue;
    
    let listarLinhas = this.url+"/Movimentar/ListarLinhas?token="+ this.authService.getToken() +"&bolsaoID="+selectedValue;

    this.http.get<dataRetorno>( listarLinhas)
    .subscribe(res => {

      this.responseData4 = res;
      if(this.responseData4.sucesso){

       //PREENCHER O SELECT DO BOLSAO
       
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
    this.novoFormMovimentacaoData.fila = selectedValue;

    let listarPosicoes = this.url+"/Movimentar/ListarPosicoes?token="+ this.authService.getToken() +"&linhaID="+selectedValue;

    this.http.get<dataRetorno>( listarPosicoes)
    .subscribe(res => {

      this.responseData5 = res;

      if(this.responseData5.sucesso){

       //PREENCHER O SELECT DO BOLSAO
       
       this.posicoes = this.responseData5.retorno;
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
  onPosicaoChange(selectedValue){
    this.authService.showLoading();
    this.novoFormMovimentacaoData.posicao = selectedValue;
    this.authService.hideLoading();
  }         
  MovimentarVeiculo(){

    this.authService.showLoading();
    let movimentarVeiculo = this.url+"/Movimentar/MovimentarVeiculo?token="+ this.authService.getToken();
  
    this.dadosParqueamento = {
      "veiculoID": this.novoFormMovimentacaoData.id,
      "posicaoID": this.novoFormMovimentacaoData.posicao
    }

    this.http.put<dataRetorno>( movimentarVeiculo, this.dadosParqueamento, httpOptions)
    .subscribe(res => {

      this.retorno = '';
      this.retorno = res;

      console.log(this.retorno);

      if(this.retorno.sucesso){

        this.authService.hideLoading();
        var data = {
          message : "Movimentação realizada com",
          iconClass : "icon-movement-blue"
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
      this.navCtrl.push(MovimentacaoPage);
      
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