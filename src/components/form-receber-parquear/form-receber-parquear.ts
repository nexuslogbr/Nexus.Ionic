import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../../pages/home/home';
import { AlertComponent } from '../../components/alert/alert';
import { ModalReceberParquearComponent } from '../../components/modal-receber-parquear/modal-receber-parquear';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'form-receber-parquear',
  templateUrl: 'form-receber-parquear.html'
})
export class FormReceberParquearComponent {

  title: string;
  formData: any = {
    "id": 0,
    "chassi": "",
    "notaFiscal": "",
    "status": "",
    "modelo": "",
    "localAtual": "",
    "layoutAtual": "",
    "bolsaoAtual": "",
    "posicaoAtual": ""
  }; 
  bolsaoFila: any = {
    bolsao: "",
    fila: ""
  };
  url: string;
  posicoes: any;
  responseData: any;
  chassi: any;
  responseCarData: any = {
    "id": 0,
    "chassi": "",
    "notaFiscal": "",
    "status": "",
    "modelo": "",
    "localAtual": "",
    "layoutAtual": "",
    "bolsaoAtual": "",
    "posicaoAtual": ""
  };
  parametros: any = {
    veiculoID: 0,
    posicaoID: 0,
    movimentar: false
  };
  dadosVeiculo: any;
  proximo: any = {
    "fimLinha": false,
    "fimBolsao": false,
    "fimLayout": false,
    "proximaPosicaoID": 0,
    "proximoLinhaID": 0,
    "proximoBolsaoID": 0,
    "proximaPosicaoNome": "",
    "proximoLinhaNome": "",
    "proximoBolsaoNome": "",
    "layoutNome": ""
  };
  dados: any = {
    "message" : "",
    "fila" : false,
    "layout" : true,
    "messageTitle" : ""
  };
  forcarPosicao: boolean = false;
  forcarText: string = "Forçar";
  modoOperacao: number;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  
  constructor(public http: HttpClient, private modal: ModalController, private navParam: NavParams, private view: ViewController, public navCtrl: NavController, public authService: AuthService) {
    this.title = 'Receber / Parquear';

    console.log('FormReceberParquearComponent');
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
  ionViewWillEnter(){
    this.authService.showLoading();
  }
  ionViewDidEnter() {

    this.dadosVeiculo = this.navParam.get('data');

    if(this.dadosVeiculo.filaID !== ""){
      this.authService.setFila(this.dadosVeiculo.filaID);
    }
    
    this.ParquearVeiculo();
    
  }
  forcarNovaPosicao(){
    if(this.forcarPosicao == true){
      this.forcarPosicao = false;
      this.forcarText = "Forçar";

    }else{
      this.forcarPosicao = true;
      this.forcarText = "Cancelar";

      if(this.dadosVeiculo.filaID !== ""){
        this.ListarPosicoes(this.dadosVeiculo.filaID);
        this.authService.setFila(this.dadosVeiculo.filaID);
      }else{
        if(this.authService.getFila() !== ""){
          this.ListarPosicoes(this.authService.getFila());
        }
      }
    }
  }
  ParquearVeiculo(){

    if(this.dadosVeiculo.posicaoID){

      this.parametros.veiculoID = this.dadosVeiculo.veiculoID;
      this.parametros.posicaoID = this.dadosVeiculo.posicaoID;

    }else{

      this.parametros.veiculoID = this.dadosVeiculo.veiculoID;
      this.parametros.posicaoID = this.authService.getProximaPosicao();
    }

    let parquearVeiculo = this.url+"/ReceberParquear/ParquearVeiculo?token="+this.authService.getToken();

    this.http.put( parquearVeiculo, this.parametros,httpOptions)
    .subscribe(res => {
      
      this.responseCarData = '';
      this.responseCarData = res;
      
      if(this.responseCarData.sucesso){
        
        this.authService.hideLoading();
        this.formData = this.responseCarData.retorno;
        this.proximo = this.responseCarData.extra;

        this.authService.setProximaPosicao(this.proximo.proximaPosicaoID);

        if(this.proximo.fimLinha){

          if(this.proximo.fimBolsao){

            if(this.proximo.fimLayout){

              this.dados = {
                "message" : "O layout "+this.proximo.layoutNome,
                "fila" : true,
                "layout" : false,
                "messageTitle" : "está completo"
              }

            }else{

              this.dados = {
                "message" : "Deseja utilizar a Próxima Fila?",
                "fila" : true,
                "layout" : true,
                "messageTitle" : "Bolsão: "+this.proximo.proximoBolsaoNome+' - Posição: '+this.proximo.proximaPosicaoNome
              }
            }
          }else{

            this.dados = {
              "message" : "Deseja utilizar a Próxima Fila?",
              "fila" : true,
              "layout" : true,
              "messageTitle" : "Fila: "+this.proximo.proximoLinhaNome+' - Posição: '+this.proximo.proximaPosicaoNome
            }
          }
        }
      }
      else{
        this.authService.hideLoading();
        this.openModalErro(this.responseCarData.mensagem); 
    
      }

    }, (error) => {
      
      this.authService.hideLoading();
      this.openModalErro(this.responseCarData.mensagem); 
    });
  } 
  ListarPosicoes(linhaID){
    this.authService.showLoading();
    let listarPosicoes = this.url+"/ReceberParquear/ListarPosicoes?token="+ this.authService.getToken()+"&linhaID="+linhaID;


    this.http.get( listarPosicoes)
    .subscribe(res => {
      
      this.responseData = {};
      this.responseData = res;
      
      if(this.responseData.sucesso){
        
        this.authService.hideLoading();

        if(this.responseData['retorno'] != ""){
          
          console.log("há vagas livres.");
          //PREENCHER O SELECT DAS POSIÇÕES    
          this.posicoes = this.responseData.retorno;
          this.authService.hideLoading();            
          
        }else{
          
          this.openModalErro("Não há vagas livres.");
          console.log("Não há vagas livres.");
        }

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      
      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }
  onPosicaoChange(posicao) {

    this.authService.showLoading();

    this.parametros.veiculoID = this.dadosVeiculo.veiculoID;
    this.parametros.posicaoID = posicao;
    this.parametros.movimentar = true;

    let parquearVeiculos = this.url+"/ReceberParquear/ParquearVeiculo?token="+this.authService.getToken();

    this.http.put( parquearVeiculos, this.parametros, httpOptions)
    .subscribe(res => {

    this.responseCarData = res;
      
    if(this.responseCarData.sucesso){
      
      this.authService.hideLoading();

      this.formData = this.responseCarData.retorno;
      this.proximo = this.responseCarData.extra;

      this.authService.setProximaPosicao(this.proximo.proximaPosicaoID);

        if(this.proximo.fimLinha){

          if(this.proximo.fimBolsao){

            if(this.proximo.fimLayout){

              this.dados = {
                "message" : "O layout "+this.proximo.layoutNome,
                "fila" : true,
                "layout" : false,
                "messageTitle" : "está completo"
              }

            }else{
              this.dados = {
                "message" : "Deseja utilizar a Próxima Fila?",
                "fila" : true,
                "layout" : true,
                "messageTitle" : "Bolsão: "+this.proximo.proximoBolsaoNome+' - Posição: '+this.proximo.proximaPosicaoNome
              }
            }
          }else{

            this.dados = {
              "message" : "Deseja utilizar a Próxima Fila?",
              "fila" : true,
              "layout" : true,
              "messageTitle" : "Fila: "+this.proximo.proximoLinhaNome+' - Posição: '+this.proximo.proximaPosicaoNome
            }
          }
        }
    }
    else{
      this.authService.hideLoading();
      this.openModalErro(this.responseCarData.mensagem);   
      
    }

    }, (error) => {
      
      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
      
    this.parametros.movimentar = false;
    this.forcarPosicao = false;
    this.forcarText = "Forçar";
  }
  Finalizar(){
    this.view.dismiss();
    this.authService.setProximaPosicao('');
    this.authService.setFila('');
    this.navCtrl.push(HomePage);
  }  
  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.view.dismiss();
    })
    chassiModal.onWillDismiss((data) =>{

    })
  }  
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.view.dismiss();
      this.openModalQrCode();
    })
    chassiModal.onWillDismiss((data) =>{

    })
  } 
  openModalQrCode(){
    
    const chassiModal: Modal = this.modal.create(ModalReceberParquearComponent);
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{
    })

  }
  openAlert(data){
    
    const chassiModal: Modal = this.modal.create(AlertComponent, {data: data });
    chassiModal.present();

  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  } 
  ProximoVeiculo(){
    this.view.dismiss();
    this.navCtrl.push(ModalReceberParquearComponent);
  }
  isEmpty(obj) {
    for (var x in obj) { if (obj.hasOwnProperty(x))  return false; }
    return true;
  }
   
}
