import { Component } from '@angular/core';
import { IonicPage, NavController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'page-romaneio-listar',
  templateUrl: 'romaneio-listar.html',
})
export class RomaneioListarPage {
  formData = {
    "data":""
  };
  url: string;
  urlListarRomaneios: string;
  title: string;
  responseData: any;
  clienteExterno: boolean;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public authService: AuthService) {
    this.title = "LISTAR ROMANEIOS";
    this.clienteExterno = this.authService.getUserData().clienteExterno;
    this.formData.data = new Date().toISOString();
    console.log('RomaneioListarPage');
    this.url = this.authService.getUrl();
  }
  ionViewDidEnter() {

  }
  listarRomaneios(){
    var formattedDate = moment(this.formData.data).format();
    console.log(formattedDate);
    console.log(this.formData.data);
    // alert((this.formData.data.getMonth() + 1) + '/' + this.formData.data.getDate() + '/' +  this.formData.data.getFullYear());
    this.urlListarRomaneios = this.url+"/Romaneio/ListarRomaneios?token="+ this.authService.getToken()+"&data="+this.formData.data;

    this.authService.showLoading();

    this.http.get(this.urlListarRomaneios)
    .subscribe(res => {
      this.responseData = "";
      this.responseData = res;

      console.log(this.responseData);

      if(this.responseData.sucesso){
        console.log(this.responseData.retorno);

      this.authService.hideLoading();
      this.navCtrl.push(RomaneioPage, {data: this.responseData.retorno});

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error.status+' - '+error.statusText);
      console.log(error);
    });

    // this.authService.ListarRomaneios( this.url ).then((result)=>{
    //   this.responseData = '';
    //   this.responseData = result;
    //   console.log(this.responseData);
    //   if(this.responseData.sucesso){

    //     this.authService.hideLoading();
    //     var data = {
    //       message : this.responseData.mensagem
    //     }
    //     console.log(this.responseData.retorno);
    //     this.navCtrl.push(RomaneioPage, {data: this.responseData.retorno});
    //   }else{
    //     this.authService.hideLoading();
    //     this.openModalErro(this.responseData.mensagem);
    //   }
    // }, (error) =>{
    //   this.authService.hideLoading();
    //   this.openModalErro("Erro!");
    // });

  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
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
      console.log(data);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }

}
