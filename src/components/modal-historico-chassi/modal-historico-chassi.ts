import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Modal, Select, ViewController, ModalController } from 'ionic-angular';
import { HistoricoChassiPage } from '../../pages/historico-chassi/historico-chassi';
import { HistoricoChassiResumoPage } from '../../pages/historico-chassi-resumo/historico-chassi-resumo';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-historico-chassi',
  templateUrl: 'modal-historico-chassi.html'
})
export class ModalHistoricoChassiComponent {
  @ViewChild('select1') select1: Select;

  title: string;
  chassis: any;
  novoChassi: string;
  url: string;
  url2: string;
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
  responseData2: any;

  constructor(public httpClient: HttpClient, private modal: ModalController, public navCtrl: NavController, private view: ViewController, private navParam: NavParams,public authService: AuthService) {
    console.log('Hello ModalHistoricoChassiComponent Component');
    this.title = 'Histórico de Chassi';
    this.url = this.authService.getUrl();
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.chassis = data;
    console.log(this.chassis);
  }
  ionViewDidEnter(){
    setTimeout(() => {
      this.select1.open();
   },150);

  }
  cancelar(){
    this.view.dismiss();
    this.select1.close();
    this.navCtrl.push(HistoricoChassiPage);
  }

  ConsultarChassi(){
    this.view.dismiss();
    this.select1.close();

    console.log(this.novoChassi);

    let consultarChassi = this.url+"/VeiculoHistorico/ConsultarChassi?token="+ this.authService.getToken() +"&chassi="+this.novoChassi;
    this.formParqueamentoData.chassi = this.novoChassi;

    this.authService.showLoading();

    this.formParqueamentoData.token = this.authService.getToken();
    this.formParqueamentoData.local = this.authService.getLocalAtual();

    this.httpClient.get(consultarChassi).subscribe(
      res => {
        this.responseData = res;

        if(this.responseData.sucesso){

          this.authService.hideLoading();
          this.navCtrl.push(HistoricoChassiResumoPage, {data: this.responseData.retorno });

        }else{

          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }

      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status+' - '+err.statusText);
        console.log(err);
      }
    );
  }
  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;
    console.log(this.novoChassi);
    $('.login-content').css('display','block');
  }
  closeModal(){
    this.view.dismiss({cancelado: true});
    this.select1.close();
  }
  openModalSucesso(data){
    this.select1.close();
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(HistoricoChassiPage);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }
  openModalErro(data){
    this.view.dismiss();
    this.select1.close();
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(HistoricoChassiPage);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
}
