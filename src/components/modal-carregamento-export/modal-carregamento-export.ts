import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { CarregamentoExportPage } from '../../pages/carregamento-export/carregamento-export';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-carregamento-export',
  templateUrl: 'modal-carregamento-export.html'
})
export class ModalCarregamentoExportComponent {
  title: string;
  chassis: any;
  veiculoId: string;
  url: string;
  responseData: any;
  formCarregamento = {id:0};

  constructor(public http: HttpClient, private modal: ModalController, private navParam: NavParams, private view: ViewController, public navCtrl: NavController, public authService: AuthService) {
    this.title = 'Carregamento Exportação';
    console.log('ModalCarregamentoExportComponent');
    this.url = this.authService.getUrl();
  }
  ionViewDidEnter() {

  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.chassis = data;
    console.log(this.chassis);
  }
  onChassisChange(selectedValue) {
    this.veiculoId = selectedValue;
    this.ConsultarChassi(this.veiculoId);
    console.log(selectedValue);
  }
  FinalizarCarregamento(){

    var veiculoId = Number(this.formCarregamento.id);

    let carregarExpVeiculo = this.url+"/CarregarExportacao/CarregarExportacaoVeiculo?token="+ this.authService.getToken() +"&veiculoID="+ veiculoId;

    this.authService.showLoading();

    this.http.get( carregarExpVeiculo)
    .subscribe(res => {

      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        // alert(this.responseData.mensagem);
        var data = {
          message : "Carregamento exportação realizado com",
          iconClass : "icon-load-export"
        }
        this.openModalSucesso(data);

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
    });
  }
  cancelar(){
    this.navCtrl.push(CarregamentoExportPage);
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
      this.navCtrl.push(CarregamentoExportPage);
    })
    chassiModal.onWillDismiss((data) =>{

    })
  }

  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(CarregamentoExportPage);
    })
    chassiModal.onWillDismiss((data) =>{
      // this.navCtrl.push(CarregamentoExportPage);
    })
  }
  ConsultarChassi(chassi){

    let consultarChassi= this.url +"/CarregarExportacao/ConsultarChassi?token="+ this.authService.getToken() +"&chassi="+ chassi;

    this.authService.showLoading();

    this.http.get( consultarChassi)
    .subscribe(res => {

      this.responseData = res;
      console.log(this.responseData);

      if(this.responseData.sucesso){

        this.formCarregamento.id = this.responseData.retorno['id'];
        console.log(this.responseData.retorno['id']);
        $('.login-content').css('display','block');
        this.authService.hideLoading();

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
    });
  }
}
