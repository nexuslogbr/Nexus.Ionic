import { Component } from '@angular/core';
import { NavParams, NavController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioCePage } from '../../pages/romaneio-ce/romaneio-ce';
import { ModalEditarRomaneioCeComponent } from '../../components/modal-editar-romaneio-ce/modal-editar-romaneio-ce';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-analise-romaneio-ce',
  templateUrl: 'modal-analise-romaneio-ce.html'
})
export class ModalAnaliseRomaneioCeComponent {

  title: string;
  romaneio = {
    romaneioID:'',
    numero : '',
    porto : '',
    tipo: '',
    tipoID : '',
    data : '',
    transportadoraID : '',
    transportadora:'',
    placa : '',
    frota : ''
  }
  novaData: any;
  chassis: string[];
  classe: string;
  parametros: any;
  responseData: any;
  url: string;
  SalvarStatus: string;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, public authService: AuthService ) {
    this.title = 'ANÁLISE DE ROMANEIO';
    console.log('ModalAnaliseRomaneioCeComponent');
    this.url = this.authService.getUrl();
  }

  ionViewDidEnter() {
    this.parametros = '';
    this.parametros = this.navParam.get('parametros');

    if(this.parametros != null){
      var data = new Date(this.parametros.data);
      this.novaData = data.toLocaleDateString();

      this.romaneio = {
        romaneioID: this.parametros.romaneioID,
        numero : this.parametros.numero,
        porto : this.parametros.local,
        tipo : this.parametros.tipo,
        tipoID: this.parametros.tipoID,
        data : this.novaData,
        transportadoraID : this.parametros.transportadoraID,
        transportadora : this.parametros.transportadora,
        placa : this.parametros.caminhao,
        frota : this.parametros.frota,
      }
      this.chassis = this.parametros.detalhes;
      this.classe = this.parametros.classe;
    }

  }
  voltar(){
      let listarRomaneio = this.url+"/Romaneio/ListarRomaneios?token="+ this.authService.getToken()+"&data="+this.romaneio.data;

      this.authService.showLoading();

      this.http.get( listarRomaneio)
      .subscribe(res => {

        this.responseData = '';
        this.responseData = res;

        if(this.responseData.sucesso){

          this.authService.hideLoading();
          alert(this.responseData.mensagem);
          console.log(this.responseData.retorno);
          this.navCtrl.push(RomaneioCePage, {data: this.responseData.retorno});
        }else{
          this.authService.hideLoading();
          this.navCtrl.push(RomaneioCePage);
        }

      }, (error) => {
        this.authService.hideLoading();
        this.openModalErro(error);
      });
  }
  editar(){
    console.log(this.parametros);
    this.navCtrl.push(ModalEditarRomaneioCeComponent, {data: this.parametros});
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
     ;
    })
    chassiModal.onWillDismiss((data) =>{

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
