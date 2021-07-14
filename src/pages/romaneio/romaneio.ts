import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController} from 'ionic-angular';
import { NovoRomaneioPage } from '../../pages/novo-romaneio/novo-romaneio';
import { RomaneioOrdenarPage } from '../../pages/romaneio-ordenar/romaneio-ordenar';
import { RomaneioListarPage } from '../../pages/romaneio-listar/romaneio-listar';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalAnaliseRomaneioComponent } from '../../components/modal-analise-romaneio/modal-analise-romaneio';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-romaneio',
  templateUrl: 'romaneio.html',
})
export class RomaneioPage {

  title: string;
  parametros: any;
  url: string;
  responseData: any;
  urlListarRomaneios: string;
  clienteExterno: boolean;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams,public authService: AuthService) {
    this.title = "Romaneio";
    console.log('RomaneioPage');
    this.url = this.authService.getUrl();
    this.clienteExterno = this.authService.getUserData().clienteExterno;
  }

  ionViewDidEnter() {
    this.parametros = this.navParams.get('data');
    if(this.parametros != null){
      console.log(this.parametros);
    }

  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
    $('side-menu-ce').toggleClass('show');
  }

  novoRomaneio(){
    // this.navCtrl.pop();
    // this.authService.limparRomaneio();
    this.navCtrl.push(NovoRomaneioPage);
  }
  ordenarRomaneio(){
    // this.navCtrl.pop();
    this.navCtrl.push(RomaneioOrdenarPage);

  }
  listarRomaneio(){
    // this.navCtrl.pop();
    this.navCtrl.push(RomaneioListarPage);

  }
  analiseRomaneio(event, id, romaneioID){
    // var target = event.target || event.srcElement || event.currentTarget;
    // var idAttr = target.attributes.id;
    // var value = idAttr.nodeValue;

    console.log(id);
    console.log(romaneioID);

      let carregarRomaneio = this.url+"/Romaneio/CarregarRomaneio?token="+ this.authService.getToken() +"&romaneioID="+id;

      this.authService.showLoading();

      this.http.get( carregarRomaneio )
      .subscribe(res => {

        this.responseData = '';
        this.responseData = res;

        if(this.responseData.sucesso){

          console.log(this.responseData.retorno);

          this.authService.hideLoading();
          let parametros = this.responseData.retorno;
          parametros.classe = 'aprovar';
          parametros.romaneioID = romaneioID;

          console.log(this.responseData.retorno);

          this.navCtrl.push(ModalAnaliseRomaneioComponent, { parametros: parametros });

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

      }, (error) => {
        this.authService.hideLoading();
        this.openModalErro(error);
      });
  }
  editarRomaneio(event, id, romaneioID){

      this.urlListarRomaneios = this.url+"/Romaneio/CarregarRomaneio?token="+ this.authService.getToken() +"&romaneioID="+event.target.id;

      this.authService.showLoading();

      this.http.get(this.urlListarRomaneios)
      .subscribe(res => {
        this.responseData = "";
        this.responseData = res;

        if(this.responseData.sucesso){

          this.authService.hideLoading();

          let parametros = this.responseData.retorno;
          parametros.classe = 'editar';
          this.navCtrl.push(ModalAnaliseRomaneioComponent, { parametros: parametros });

        }else{
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

      }, (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status+' - '+error.statusText);
        console.log(error);
      });

  }
  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
     ;
    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
}
