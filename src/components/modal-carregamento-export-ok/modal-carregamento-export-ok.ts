import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'modal-carregamento-export-ok',
  templateUrl: 'modal-carregamento-export-ok.html'
})
export class ModalCarregamentoExportOkComponent {

  title: string;
  chassis: any;
  veiculoId: string;
  url: string;
  responseData: any;
  formCarregamento = {id:0};

  constructor(public http: HttpClient, private modal: ModalController, private navParam: NavParams, private view: ViewController, public navCtrl: NavController, public authService: AuthService) {
    this.title = 'Carregamento Exportação';

    console.log('ModalCarregamentoExportOkComponent');
    this.url = this.authService.getUrl();
  }
  ionViewDidEnter() {

  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.formCarregamento = data;
    console.log(this.formCarregamento);
  }
  FinalizarCarregamento(){

  var veiculoId = Number(this.formCarregamento['id']);

  let carregarExportacaoVeiculo = this.url+"/CarregarExportacao/CarregarExportacaoVeiculo?token="+ this.authService.getToken() +"&veiculoID="+ veiculoId;

  this.authService.showLoading();

  this.http.put( carregarExportacaoVeiculo, {}, httpOptions)
  .subscribe(res => {

    this.responseData = res;

    if(this.responseData.sucesso){

      var data = {
        iconClass : 'parking-green',
        message : 'Parqueamento realizado com sucesso'
      };

      this.authService.hideLoading();
      this.openModalSucesso(data);
      // this.navCtrl.push(CarregamentoExportPage);

    }else{
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
    }

  }, (error) => {
    this.authService.hideLoading();
    this.openModalErro(error);
  });

}
  closeModal(){
    this.view.dismiss();
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
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
