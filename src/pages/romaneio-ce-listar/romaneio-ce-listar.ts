import { Component } from '@angular/core';
import { IonicPage, NavController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioCePage } from '../../pages/romaneio-ce/romaneio-ce';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'page-romaneio-ce-listar',
  templateUrl: 'romaneio-ce-listar.html',
})
export class RomaneioCeListarPage {

  formData = {
    "data":""
  };
  url: string;
  title: string;
  responseData: any;  

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public authService: AuthService) {
    this.title = "LISTAR ROMANEIOS";
    this.formData.data = new Date().toISOString();  
    this.url = this.authService.getUrl();  
  }
  ionViewDidEnter() {
    
  }
  listarRomaneios(){
    var formattedDate = moment(this.formData.data).format('YYYYMMDD');
    console.log(formattedDate);
    console.log(this.formData.data);
    // alert((this.formData.data.getMonth() + 1) + '/' + this.formData.data.getDate() + '/' +  this.formData.data.getFullYear());
    let listarRomaneios = this.url +"/Romaneio/ListarRomaneios?token="+ this.authService.getToken()+"&data="+this.formData.data;
      
    this.authService.showLoading();

    this.http.get( listarRomaneios )
    .subscribe(res => {
      
      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        var data = {
          iconClass : 'icon-sucesso',
          message : this.responseData.mensagem
        }
        this.navCtrl.push(RomaneioCePage, {data: this.responseData.retorno});
      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
    }); 
    
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu-ce').toggleClass('show');
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
      // this.navCtrl.push(RomaneioCePage, {data: this.responseData.retorno});
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }   

}
