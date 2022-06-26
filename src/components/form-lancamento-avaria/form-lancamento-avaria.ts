import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import * as $ from 'jquery';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso';
import { LancamentoAvariaPage } from '../../pages/lancamento-avaria/lancamento-avaria';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'form-lancamento-avaria',
  templateUrl: 'form-lancamento-avaria.html'
})
export class FormLancamentoAvariaComponent {
  @ViewChild('select1') select1: Select;

  title: string;
  
  FormLancamentoAvariaData = {
    "id": '',
    'chassi':'',
    "observacao": ''
  };
  chassi: string;
  tShow: boolean;
  private url: string;
  retorno: any;
  dadosLancamento: any; 

  constructor(
    private authService: AuthService, 
    private navParam: NavParams, 
    private navCtrl: NavController, 
    private view: ViewController,
    private http: HttpClient, 
    private modal: ModalController
    ) {
    this.title = "Lançamento de Avaria";
    this.url = this.authService.getUrl();
  }

  ionViewDidEnter() {

    if( this.authService.getLayout() ){
      this.tShow = false;
      this.authService.showLoading();
    }
    else{
      this.tShow = true; 
    }     
  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    console.log(data)
    
    this.FormLancamentoAvariaData = data;
  }

  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  } 

  closeModal(){
    this.view.dismiss();
  } 

  cancelar(){
    // this.navCtrl.push(MovimentacaoPage);
  }
  
  onTipoChange(selectedValue){
    console.log(selectedValue);
    // this.FormLancamentoServicoData.tipoServicoID = selectedValue;
  }
 
  Bloquear(){
    this.authService.showLoading();
    let lancamento = this.url+"/Servico/Incluir?token="+ this.authService.getToken();
  
    // this.dadosLancamento = {
    //   "veiculoID": this.FormLancamentoServicoData.id,
    //   "tipoServicoID":this.FormLancamentoServicoData.tipoServicoID
    // }

    this.http.post<dataRetorno>( lancamento, this.dadosLancamento, httpOptions)
    .subscribe(res => {

      this.retorno = '';
      this.retorno = res;

      console.log(this.retorno);

      if(this.retorno.sucesso){

        this.authService.hideLoading();
        var data = {
          message : "Lançamento de serviço realizado com",
          iconClass : "icon-lancamento-servico"
        }        
        this.openModalSucesso(data);

      }
      else{
        this.authService.hideLoading();
        this.openModalErro(this.retorno.mensagem); 
        // this.navCtrl.push(HomePage);         
      }

    }, (error) => {
      
      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    }); 
    
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
      this.navCtrl.push(LancamentoAvariaPage);
      
    })    
  }
}
interface dataRetorno{
  dataErro: string;
  mensagem: string;
  retorno: any;
  sucesso: boolean;
  tipo: number;
  urlRedirect: string
}
