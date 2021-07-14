import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ModalRampaFilaComponent } from '../../components/modal-rampa-fila/modal-rampa-fila';
import * as moment from 'moment';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'page-romaneio-fila',
  templateUrl: 'romaneio-fila.html',
})
export class RomaneioFilaPage {

  title: string;
  parametros = {
    tipo : "",
    local : "",
    id : "",
    chassisCarregados : "",
    chassisNaoCarregados: "",
    data : "",
    detalhes: [
      {
        fila : "",
        filaID : 0,
        frota : "",
        id : 0,
        placa : "",
        rampa : "",
        rampaID : 0,
        transportadora : "",
        transportadoraCNPJID: 0,
        veiculos : [
          {
            chassi : "",
            modelo : "",
            nota : "",
            posicao : ""
          }
        ]
      }
    ]
  };
  url: string;
  url2: string;
  url3: string;
  responseData: any;
  rampas: string[];
  filas: string[];  
  chassis: string[];
  romaneio = {
    numero : '',
    porto : '',
    tipo : '',
    data : '',
    id : "",
    transportadora : '',
    placaDoCaminhao : '',
    frota : ''
  }
  RampaFila = {
      "romaneioID": 0,
      "romaneioDetalheID" : 0,
      "rampaID": 0,
      "filaID": 0
    };
  dataRetorno: any;
  detalhes: any;
  ListarRampas: string;
  SalvarRampaFila: string;
    
  constructor(public http: HttpClient, public viewCtrl: ViewController, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.title = "ROMANEIO FILA";
    console.log('RomaneioFilaPage');

    this.url = this.authService.getUrl();
  }

  ionViewDidEnter() {
    this.RomaneioListarRampas();
    this.parametros = this.navParams.get('parametros');
    this.detalhes = this.parametros.detalhes;
    console.log(this.parametros);
    
    var formattedDate = moment(this.parametros.data).format('DD/MM/YYYY');

    this.romaneio.id = this.parametros.id;
    this.romaneio.porto = this.parametros.local;
    this.romaneio.tipo = this.parametros.tipo;
    this.romaneio.data = formattedDate;
    this.RampaFila.romaneioID = Number(this.parametros.id);
    
  }
  onRampaChange(value, id){
    this.authService.showLoading();

    this.RampaFila.rampaID = Number(value);
    this.RampaFila.romaneioDetalheID = Number(id);

    let listarFilas = this.url+"/Romaneio/ListarFilas?token="+ this.authService.getToken()+"&rampaID="+value;


    this.http.get( listarFilas )
    .subscribe(res => {

      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        
        this.filas = this.responseData.retorno;
        
      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }      

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
    });  

  }
  onFilaChange(value, id){

    this.RampaFila.filaID = Number(value);
    this.RampaFila.romaneioDetalheID = Number(id);
    console.log(this.RampaFila);
  } 
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }   
  toggleSlide(event){

    console.log(event);
    console.log(event.target);
    var arrow = $(event.target).find('.icon');
    let slideToggle = $(event.target).parents('.romaneio-list');
    let toggleSlider = $(slideToggle).find('.toggleSlider');

    $(toggleSlider).slideToggle('slow');

    if($(arrow).hasClass('arrow-down')){
      $(arrow).addClass('arrow-up');
      $(arrow).removeClass('arrow-down');
    }else{
      $(arrow).addClass('arrow-down');
      $(arrow).removeClass('arrow-up');
    }
  }
  RomaneioListarRampas(){
    this.authService.showLoading();
    this.ListarRampas = "/Romaneio/ListarRampas?token="+ this.authService.getToken();

    this.http.get( this.ListarRampas )
    .subscribe(res => {

      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        this.rampas = this.responseData.retorno;
        
      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }     

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
    });   
  }
  finalizar(){

    this.authService.showLoading();

    this.RampaFila.romaneioID = Number(this.romaneio.id); 

    console.log(this.RampaFila);

    this.SalvarRampaFila = this.url+"/Romaneio/SalvarRampaFila?token="+this.authService.getToken();

    if(this.RampaFila.romaneioID != 0 && this.RampaFila.rampaID != 0 && this.RampaFila.filaID != 0){

      this.http.post( this.SalvarRampaFila, this.RampaFila, httpOptions )
      .subscribe(res => {

        this.responseData = '';
        this.responseData = res;
        console.log(this.responseData);

        if(this.responseData.sucesso){
          this.openModalRampaFila();
        }
        else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);        
        }        

      }, (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status+' - '+error.statusText);
        console.log(error);
      });
    }else{
      var data = "Preencha a Rampa e a Fila!";
      this.authService.hideLoading();
      this.openModalErro(data);      
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
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();  

    chassiModal.onDidDismiss((data) => {
      this.viewCtrl.dismiss(); 
      this.navCtrl.push(RomaneioPage);
          
    }) 
  }  
  openModalRampaFila(){
    const chassiModal: Modal = this.modal.create(ModalRampaFilaComponent);
    chassiModal.present();  

    chassiModal.onDidDismiss(() => {
          
    }) 
  }     
}
