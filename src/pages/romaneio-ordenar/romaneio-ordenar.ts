import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { OrdenarRomaneioFilaPage } from '../../pages/ordenar-romaneio-fila/ordenar-romaneio-fila';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'page-romaneio-ordenar',
  templateUrl: 'romaneio-ordenar.html',
})
export class RomaneioOrdenarPage {
  formData = {
    "data":""
  };
  responseData: any;
  url: string;
  title: string;

  constructor(public http: HttpClient,  private modal: ModalController, public navCtrl: NavController, public navParams: NavParams,public authService: AuthService ) {
    this.title = "ORDENAR ROMANEIO";
    this.formData.data = new Date().toISOString();
    console.log('RomaneioOrdenarPage');
    this.url = this.authService.getUrl();

  }
  ionViewDidEnter() {
    
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }  
  ordenarRomaneio(){
    var formattedDate = moment(this.formData.data).format('YYYYMMDD');
    let listarRomaneios = this.url+"/Romaneio/ListarRomaneios?token="+ this.authService.getToken() +"&data="+formattedDate;

    this.authService.showLoading();

    this.http.get( listarRomaneios )
    .subscribe(res => {
      
      this.responseData = '';
      this.responseData = res;
      
      if(this.responseData.sucesso){
        let parametros = this.responseData.retorno;
        // console.log(this.responseData.retorno);
        // let dados = new Array();
        // for(var i = 0; i < parametros.length; i++){
        //   if(parametros[i].filaID != 0 && parametros[i].rampaID != 0){

        //   }else{
        //     dados.push(parametros[i]);
        //   }
        // }
        // console.log(parametros);

        this.authService.hideLoading();   
        this.navCtrl.push(OrdenarRomaneioFilaPage, {parametros: this.responseData.retorno});

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
      console.log(this.responseData.mensagem);
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
  
}
