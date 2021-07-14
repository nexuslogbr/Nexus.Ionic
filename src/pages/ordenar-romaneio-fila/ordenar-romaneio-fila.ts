import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { RomaneioOrdenarPage } from '../../pages/romaneio-ordenar/romaneio-ordenar';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioFilaPage } from '../../pages/romaneio-fila/romaneio-fila';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-ordenar-romaneio-fila',
  templateUrl: 'ordenar-romaneio-fila.html',
})

export class OrdenarRomaneioFilaPage {

  parametros: any;
  title: string;
  url: string;
  carregarRomaneio: string;
  responseData: any;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.title = "ORDENAR ROMANEIO";
    this.authService.showLoading();
    console.log('OrdenarRomaneioFilaPage');

    this.url = this.authService.getUrl();

  }
  ionViewDidEnter() {
    
    this.parametros = this.navParams.get('parametros');
    this.authService.hideLoading();

    console.log(this.parametros);
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  } 
  voltar(){
    this.navCtrl.push(RomaneioOrdenarPage);
  }  
  filaRomaneio(event, id){

    this.authService.showLoading();

    let romaneioID = Number(id);

      this.carregarRomaneio = this.url+"/Romaneio/CarregarRomaneio?token="+ this.authService.getToken() +"&romaneioID="+romaneioID;

      this.http.get(this.carregarRomaneio)
      .subscribe(res => {
        this.responseData = "";
        this.responseData = res;
  
        if(this.responseData.sucesso){
  
          this.authService.hideLoading();
          console.log(this.responseData);

          let parametros = this.responseData.retorno;

          console.log(this.responseData.retorno);
          
          this.navCtrl.push(RomaneioFilaPage, { parametros: parametros } );            

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }
      }, (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status+' - '+error.statusText);
      });      

      // this.authService.showLoading();
      
      // this.authService.ListarRomaneios( this.url ).then((result)=>{
      //   this.responseData = '';
      //   this.responseData = result;
  
      //   console.log(this.responseData.retorno);

      //   if(this.responseData.sucesso){
  
      //     this.authService.hideLoading();
      //     // alert(this.responseData.mensagem);
      //     let parametros = this.responseData.retorno;

      //     console.log(this.responseData.retorno);
          
      //     this.navCtrl.push(RomaneioFilaPage, { parametros: parametros } );          
  
      //   }else{
      //     this.authService.hideLoading();
      //     this.openModalErro(this.responseData.mensagem);
      //   }
      // }, (error) =>{
      //   this.authService.hideLoading();
      //   this.openModalErro(error);
      // });    
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
