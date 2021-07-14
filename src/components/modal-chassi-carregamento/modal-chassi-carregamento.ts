import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
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
  selector: 'modal-chassi-carregamento',
  templateUrl: 'modal-chassi-carregamento.html'
})
export class ModalChassiCarregamentoComponent {

  @ViewChild('select1') select1: Select;
  
    title: string;
    chassis: any;
    novoChassi: string;
    formData = {
      romaneioID : 0,
      data : null,
      quantidadeNaoCarregados: 0
    };
    url: string;  
    responseData: any;
    chassi: string;  

  constructor(public http: HttpClient, private modal: ModalController, private navParam: NavParams, private view: ViewController, public navCtrl: NavController, public authService: AuthService) {
    console.log('ModalChassiCarregamentoComponent');
    this.title = 'Carregamento';
    this.url = this.authService.getUrl();
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.chassis = data;
  }
  ionViewDidEnter(){
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
    this.navCtrl.push(CarregamentoPage);
  }  
  PreCarregar(){  

    console.log(this.formData);
    
    var romaneioId = Number(this.formData.romaneioID);
    
    let preCarregar = this.url+"/Carregar/PreCarregar?token="+ this.authService.getToken() +"&romaneioID="+romaneioId+"&chassi="+this.novoChassi;

    this.authService.showLoading();

    this.http.put( preCarregar, {}, httpOptions)
    .subscribe(res => {
      
      this.responseData = res;

      if(this.responseData.sucesso){
          
        let consultarRomaneio = "/Carregar/ConsultarRomaneio?token="+ this.authService.getToken() +"&romaneioID="+romaneioId;

        this.http.get( consultarRomaneio )
        .subscribe(res => {
          
          this.responseData = '';
          this.responseData = res;
    
          if(this.responseData.sucesso){
  
            this.authService.hideLoading();
            this.view.dismiss();
         
          }else{
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
  
          }
  
        }, (error) => {
          this.authService.hideLoading();
          this.openModalErro(error);
        });         

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
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
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      
    })
    chassiModal.onWillDismiss((data) =>{

    })
  }    
}
