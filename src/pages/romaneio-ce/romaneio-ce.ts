import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
// import { NovoRomaneioCePage } from '../../pages/novo-romaneio-ce/novo-romaneio-ce';
// import { RomaneioCeListarPage } from '../../pages/romaneio-ce-listar/romaneio-ce-listar';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
// import { ModalAnaliseRomaneioCeComponent } from '../../components/modal-analise-romaneio-ce/modal-analise-romaneio-ce';
import * as $ from 'jquery';
import { NovoRomaneioCePage } from '../novo-romaneio-ce/novo-romaneio-ce';
import { RomaneioCeListarPage } from '../romaneio-ce-listar/romaneio-ce-listar';

@Component({
  selector: 'page-romaneio-ce',
  templateUrl: 'romaneio-ce.html',
})
export class RomaneioCePage {

  title: string;
  parametros: any;
  url: string;
  responseData: any;

  constructor(private navParam: NavParams, private modal: ModalController, public navCtrl: NavController, public authService: AuthService) {
    this.title = "Romaneio";
    console.log('RomaneioCePage');
  }

  ionViewDidEnter() {
    this.parametros = this.navParam.get('data');
    if(this.parametros != null){
      console.log(this.parametros);
    }

  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu-ce').toggleClass('show');
  }
  novoRomaneio(){
    this.navCtrl.push(NovoRomaneioCePage);
  }
  listarRomaneio(){
    this.navCtrl.push(RomaneioCeListarPage);
  }
  analiseRomaneio(event){

      this.url = "/Romaneio/CarregarRomaneio?token="+ this.authService.getToken() +"&romaneioID="+event.target.id;

      this.authService.showLoading();

      // this.authService.ListarRomaneios( this.url ).then((result)=>{
      //   this.responseData = '';
      //   this.responseData = result;

      //   if(this.responseData.sucesso){
      //     console.log(this.responseData.retorno);
      //     this.authService.hideLoading();
      //     // alert(this.responseData.mensagem);
      //     let parametros = this.responseData.retorno;
      //     parametros.classe = 'aprovar';
      //     this.navCtrl.push(ModalAnaliseRomaneioCeComponent, { parametros: parametros });

      //   }else{
      //     this.authService.hideLoading();
      //     alert(this.responseData.mensagem);
      //   }
      // }, (error) =>{
      //   alert(error);
      //   this.authService.hideLoading();
      //     alert(this.responseData.mensagem);
      //     console.log(this.responseData.mensagem);
      // });
  }
  RomaneioFechado(event){
    // var target = event.target || event.srcElement || event.currentTarget;
    // var idAttr = target.attributes.id;
    // var value = idAttr.nodeValue;

    this.url = "/Romaneio/CarregarRomaneio?token="+ this.authService.getToken() +"&romaneioID="+event.target.id;

    this.authService.showLoading();

    // this.authService.ListarRomaneios( this.url ).then((result)=>{
    //   this.responseData = '';
    //   this.responseData = result;

    //   if(this.responseData.sucesso){
    //     console.log(this.responseData.retorno);
    //     this.authService.hideLoading();
    //     // alert(this.responseData.mensagem);
    //     let parametros = this.responseData.retorno;
    //     parametros.classe = 'aprovar';
    //     this.navCtrl.push(ModalAnaliseRomaneioCeComponent, { parametros: parametros });

    //   }else{
    //     this.authService.hideLoading();
    //     alert(this.responseData.mensagem);
    //   }
    // }, (error) =>{
    //   alert(error);
    //   this.authService.hideLoading();
    //     alert(this.responseData.mensagem);
    //     console.log(this.responseData.mensagem);
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
