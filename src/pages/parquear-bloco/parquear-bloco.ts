import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Modal, ModalController, NavParams } from 'ionic-angular';
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
import { ModalParquearBlocoComponent } from '../../components/modal-parquear-bloco/modal-parquear-bloco';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'page-parquear-bloco',
  templateUrl: 'parquear-bloco.html',
})
export class ParquearBlocoPage {

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
  parquearBloco: any = {
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
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;



  constructor(public http: HttpClient, public navParams: NavParams, private modal: ModalController, public navCtrl: NavController, public authService: AuthService) {
    this.url = this.authService.getUrl();
    this.title = 'Parquear/Bloco';
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
    console.log('ParquearBlocoPage');
    this.ListarLayout();
  }

  ListarLayout(){

    this.authService.showLoading();

    let ListarLayouts = this.url+"/ParquearBloco/ListarLayouts?token="+ this.authService.getToken();

    this.http.get(ListarLayouts)
    .subscribe(res => {
      this.responseData = "";
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
      this.openModalErro(error.status+' - '+error.statusText);
    });     
  }

  onLayoutChange(layout){

    this.bolsoes = null;
    this.filas = null;
    this.posicoes = null;

    this.ListarBolsao(layout);
    this.parquearBloco.layoutID = layout;
    this.parquearBloco.layoutNome = this.select1.text;
    
    this.count = 1;

  }

  ListarBolsao(layout){

    this.authService.showLoading();
    let ListarBolsoes = this.url+"/ParquearBloco/ListarBolsoes?token="+ this.authService.getToken()+"&layoutID="+layout;

    this.http.get(ListarBolsoes)
    .subscribe(res => {
      this.responseData = "";
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
      this.openModalErro(error.status+' - '+error.statusText);
    });  
  }

  onBolsaoChange(bolsaoId) {

    this.filas = null;
    this.posicoes = null;

    this.bolsao = bolsaoId;
    this.ListarFila(bolsaoId);
    this.parquearBloco.bolsaoID = bolsaoId;
    this.parquearBloco.bolsaoNome = this.select2.text;
    
    this.count = 2;
  }

  ListarFila(bolsao){

    this.authService.showLoading();
    let ListarLinhas = this.url+"/ParquearBloco/ListarLinhas?token="+ this.authService.getToken()+"&bolsaoID="+bolsao;

    this.http.get(ListarLinhas)
    .subscribe(res => {
      this.responseData = "";
      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
  
        //PREENCHER O SELECT das filas    
        this.filas = this.responseData.retorno;
        this.authService.hideLoading(); 

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }
    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error.status+' - '+error.statusText);
    });      
    
  } 

  onFilaChange(fila) {
    this.fila = fila;
    this.parquearBloco.filaID = fila;
    this.parquearBloco.filaNome = this.select3.text;
    this.authService.setLayout(this.parquearBloco);
    this.ListarPosicoes(this.fila);
   
    this.count = 3;

  }

  ListarPosicoes(linhaID){
    this.authService.showLoading();
    let ListarPosicoes = this.url+"/ParquearBloco/ListarPosicoes?token="+ this.authService.getToken()+"&linhaID="+linhaID;

    this.http.get(ListarPosicoes)
    .subscribe(res => {
      this.responseData = "";
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

          this.ListarFila(this.parquearBloco.bolsaoID);
        }

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }
    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error.status+' - '+error.statusText);
    }); 
  }

  onPosicaoChange(posicao) {
    this.posicao = posicao;
    this.parquearBloco.posicaoID = posicao;
    this.parquearBloco.posicaoNome = this.select4.text;
    this.authService.setPosicao(this.posicao);
    console.log(this.parquearBloco);
    this.count = 4;
  }

  avancar(){

    if(this.parquearBloco.posicaoID != ""){
    
      this.count = 0;
      
      this.openModalQrCode(this.parquearBloco);
      
    }else{
      this.openModalErro("Campos inválidos ou em branco.");
    } 
  }

  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      
    })
    chassiModal.onWillDismiss((data) =>{

    })
  } 

  openModalQrCode(data){
    
    const chassiModal: Modal = this.modal.create(ModalParquearBlocoComponent, {data: data });
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
  navigateToHomePage(){
    this.navCtrl.push(HomePage );
  }
}
