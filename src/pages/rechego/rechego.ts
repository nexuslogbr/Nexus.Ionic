import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Modal, ModalController } from 'ionic-angular';
import { Select } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { CarregamentoExportPage } from '../../pages/carregamento-export/carregamento-export';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { HomePage } from '../../pages/home/home';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ModalRechegoComponent } from '../../components/modal-rechego/modal-rechego';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'page-rechego',
  templateUrl: 'rechego.html',
})
export class RechegoPage {

  @ViewChild('select1') select1: Select;
  @ViewChild('select2') select2: Select;
  @ViewChild('select3') select3: Select;
  @ViewChild('select4') select4: Select;

  title: string;
  url: string;
  bolsoes: any;
  filas: any;
  layouts: any;
  bolsao: string;
  fila: string;
  posicao: string;
  rechego: any = {
    layoutID: "",
    layoutNome: "",
    bolsaoID:"",
    bolsaoNome: "",
    filaID: "",
    filaNome: "",
    posicaoID: "",
    posicaoNome: ""
  }
  posicoes: any;
  bolsaoFila: any = {
    bolsao: "",
    fila: ""
  };
  count: number;
  layoutLoaded: string;
  responseData: any;


  primaryColor:string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;


  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public authService: AuthService) {

    this.title = 'Rechego';
    console.log('RechegoPage');
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

  ionViewDidLoad() {
    this.ListarLayout();
  }

  onLayoutChange(layout){

    this.bolsoes = null;
    this.filas = null;
    this.posicoes = null;

    this.ListarBolsao(layout);
    this.rechego.layoutID = layout;
    this.rechego.layoutNome = this.select1.text;
    
    this.count = 1;

  }
  onBolsaoChange(bolsaoId) {

    this.filas = null;
    this.posicoes = null;

    this.bolsao = bolsaoId;
    this.ListarFila(bolsaoId);
    this.rechego.bolsaoID = bolsaoId;
    this.rechego.bolsaoNome = this.select2.text;
    
    this.count = 2;
  }
  onFilaChange(fila) {
    this.fila = fila;
    this.rechego.filaID = fila;
    this.rechego.filaNome = this.select3.text;
    this.authService.setLayout(this.rechego);
    this.ListarPosicoes(this.fila);
   
    this.count = 3;

  }
  onPosicaoChange(posicao) {
    this.posicao = posicao;
    this.rechego.posicaoID = posicao;
    this.rechego.posicaoNome = this.select4.text;
    this.authService.setPosicao(this.posicao);
    console.log(this.rechego);
    this.count = 4;
  }
  avancar(){

    if(this.rechego.posicaoID != ""){
    
      this.count = 0;
      
      this.openModalQrCode(this.rechego);
      
    }else{
      this.openModalErro("Campos inválidos ou em branco.");
    } 
  }
  ListarLayout(){
    this.authService.showLoading();
    let listarLayouts = this.url+"/Rechego/ListarLayouts?token="+ this.authService.getToken();

    this.http.get( listarLayouts )
    .subscribe(res => {
      
      this.responseData = res;
      
        if(this.responseData.sucesso){

          this.authService.hideLoading();
  
          //PREENCHER O SELECT DO LAYOUT    
          this.layouts = this.responseData.retorno;
          this.authService.hideLoading(); 

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error); 
    });
  }
  ListarBolsao(layout){
    this.authService.showLoading();
    let listarBolsoes = this.url+"/Rechego/ListarBolsoes?token="+ this.authService.getToken()+"&layoutID="+layout;

    this.http.get( listarBolsoes )
    .subscribe(res => {
      
      this.responseData = {};
      this.responseData = res;

        if(this.responseData.sucesso){

          this.authService.hideLoading();
  
          //PREENCHER O SELECT DO Bolsão    
          this.bolsoes = this.responseData.retorno;
          this.authService.hideLoading(); 

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error); 
    });    
  }
  ListarPosicoes(linhaID){
    this.authService.showLoading();
    let listarPosicoes = this.url+"/Rechego/ListarPosicoes?token="+ this.authService.getToken()+"&linhaID="+linhaID;

    this.http.get( listarPosicoes )
    .subscribe(res => {
      
      this.responseData = {};
      this.responseData = res;
      
        if(this.responseData.sucesso){
          
          this.authService.hideLoading();

          if(this.responseData['retorno'] != ""){
            
            console.log("há vagas livres.");
            //PREENCHER O SELECT DO Bolsão    
            this.posicoes = this.responseData.retorno;
            this.authService.hideLoading();            
            
          }else{
            this.openModalErro("Não há vagas livres.");
            console.log("Não há vagas livres.");

            this.ListarFila(this.rechego.bolsaoID);
          }
 
        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);  
    });
  }
  ListarFila(bolsao){

    this.authService.showLoading();
    let listarLinhas = this.url+"/Rechego/ListarLinhas?token="+ this.authService.getToken()+"&bolsaoID="+bolsao;

    this.http.get( listarLinhas )
    .subscribe(res => {
      
      this.responseData = {};
      this.responseData = res;
      
        if(this.responseData.sucesso){

          this.authService.hideLoading();
  
          //PREENCHER O SELECT DO Bolsão    
          this.filas = this.responseData.retorno;
          this.authService.hideLoading(); 

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);  
    });
  }  
  openModalQrCode(data){
    
    const chassiModal: Modal = this.modal.create(ModalRechegoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{
    })

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
  
      console.log(data);
    })
  } 
  toParqueamento(){ 
    this.navCtrl.push(ParqueamentoPage );      
  }
  toRecebimento(){ 
    this.navCtrl.push(RecebimentoPage );      
  }
  toMovimentacao(){
    this.navCtrl.push(MovimentacaoPage );       
  }  
  toCarregamento(){
    this.navCtrl.push(CarregamentoPage );    
  }       
  toRomaneio(){
    this.navCtrl.push(RomaneioPage );       
  } 
  toCarregamentoExport(){
    this.navCtrl.push(CarregamentoExportPage ); 
  }
  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    })
    chassiModal.onWillDismiss((data) =>{

      console.log(data);
    })
  } 
  navigateToHomePage(){
    this.navCtrl.push(HomePage );
  }
}
