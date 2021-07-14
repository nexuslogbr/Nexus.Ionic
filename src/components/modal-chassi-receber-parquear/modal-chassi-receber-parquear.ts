import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { Select } from 'ionic-angular';
import { ModalReceberParquearComponent } from '../../components/modal-receber-parquear/modal-receber-parquear';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { FormReceberParquearComponent} from '../../components/form-receber-parquear/form-receber-parquear';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-chassi-receber-parquear',
  templateUrl: 'modal-chassi-receber-parquear.html'
})
export class ModalChassiReceberParquearComponent {

  @ViewChild('select1') select1: Select;

  title: string;
  chassis: any;
  novoChassi: string;
  url: string;
  formParqueamentoData = {
    "token":"",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":''
  };
  responseData: any;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private view: ViewController, public authService: AuthService, private navParam: NavParams,) {
    this.title = 'Receber / Parquear';

    console.log('ModalChassiReceberParquearComponent');

    this.url = this.authService.getUrl();
  }
  ionViewWillLoad(){

    const data = this.navParam.get('data');
    this.chassis = data;
  }
  ionViewDidEnter(){
    this.authService.hideLoading();
    setTimeout(() => {
      this.select1.open();
   },150);

  }
  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;
    $('.login-content').css('display','block');
  }
  cancelar(){
    this.view.dismiss();
    this.select1.close();
    this.openModalQrCode({});
  }
  ConsultarChassi(){
    this.authService.showLoading();
    this.view.dismiss();
    this.select1.close();

    let consultarChassi = this.url+"/ReceberParquear/ConsultarChassi?token="+ this.authService.getToken() +"&chassi="+this.novoChassi;

    this.http.get( consultarChassi )
    .subscribe(res => {

      this.responseData = res;

      if(this.responseData.sucesso){

        this.openFormReceberParquear(this.responseData.retorno);

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
    });

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

    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
  openModalQrCode(data){

    const chassiModal: Modal = this.modal.create(ModalReceberParquearComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{
    })

  }
  openFormReceberParquear(data){
    const chassiModal: Modal = this.modal.create(FormReceberParquearComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
}
