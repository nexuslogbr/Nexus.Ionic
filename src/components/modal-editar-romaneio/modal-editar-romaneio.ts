import { Component } from '@angular/core';
import { NavParams,NavController,Modal, ModalController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalNovoVeiculoComponent } from '../../components/modal-novo-veiculo/modal-novo-veiculo'
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'modal-editar-romaneio',
  templateUrl: 'modal-editar-romaneio.html'
})
export class ModalEditarRomaneioComponent {

  title: string;
  romaneioID: Number;
  formData = {
    "chassiNf":'',
    "porto" :"",
    "tipo":"",
    "tipoID":"",
    "data":"",
    "transportadora":"",
    "placa":"",
    "frota":""
  };
  parametros = {
    romaneioID: "",
    classe : "",
    data : "",
    id : 0,
    local : "",
    numero : "",
    quantidadeCarregados: 0 ,
    quantidadeNaoCarregados: 0,
    status : 0,
    tipo : "",
    tipoID : 0,
    detalhes : [
      {
        hidden : true,
        fila : "",
        filaID : 0,
        frota : "",
        id  : 0,
        ordem : 0,
        placa : "",
        rampa : "",
        rampaID : 0,
        transportadora : "",
        transportadoraCNPJID : 0,
        veiculos : [],
        chassis : []
      }
    ]
  };
  responseData: any;
  dataTransportadoras: any;
  transportadoras: any;
  qrCodeText: string;
  inputChassi: string;
  veiculo: any;
  veiculos = new Array();
  veiculoTemp = {
    'chassi' : '',
    'modelo' : '',
    'nota' : '',
    'posicao' : ''
  };
  newCourse: any;
  novaData: any;
  url: string;
  ConsultarChassiNF: string;
  SalvarRomaneio: string;
  urlTransportadoras: string;
  chassis: any;
  novoChassis: string[] = new Array();
  clienteExterno: boolean;

  constructor(public http: HttpClient, public viewCtrl: ViewController, private modal: ModalController, private navParam: NavParams,public authService: AuthService, public navCtrl: NavController) {
    this.title = 'EDITAR ROMANEIO';
    this.clienteExterno = this.authService.getUserData().clienteExterno;
    console.log('ModalEditarRomaneioComponent');
    this.url = this.authService.getUrl();
    this.parametros = this.navParam.get('data');
    this.romaneioID = Number(this.parametros.romaneioID);

    this.url = this.authService.getUrl();

    for(let i in this.parametros.detalhes){

      if(this.parametros.detalhes[i].id == this.romaneioID){

        this.parametros.detalhes[i].hidden = false;
        this.formData.placa = this.parametros.detalhes[i].placa;
        this.formData.frota = this.parametros.detalhes[i].frota;

      }else{
        this.parametros.detalhes[i].hidden = true;
      }
    };

    for(let i = 0; i < this.parametros.detalhes.length; i++){
      this.chassis = new Array();

      for(let j = 0; j < this.parametros.detalhes[i].veiculos.length; j++){

        this.chassis.push(this.parametros.detalhes[i].veiculos[j].chassi);
      }
      this.parametros.detalhes[i].chassis = this.chassis;

    }
  }

  popView(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.formData.data = new Date(this.parametros.data).toISOString();
  }

  salvarRomaneio(){

    this.authService.showLoading();

    for(let i in this.parametros.detalhes){

      if(this.parametros.detalhes[i].id == this.romaneioID){

        this.parametros.detalhes[i].placa = this.formData.placa;
        this.parametros.detalhes[i].frota = this.formData.frota;

      }
    };

    this.SalvarRomaneio = this.url+"/Romaneio/SalvarRomaneio?token="+ this.authService.getToken();

    this.http.post( this.SalvarRomaneio, this.parametros, httpOptions )
    .subscribe(res => {
      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        var data = {
          message : "Romaneio alterado com",
          iconClass : "icon-romaneio"
        }
        this.openModalSucesso(data);
      }
      else{

        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error.status+' - '+error.statusText);
    });
  }

  removeVeiculo (veiculo, i, j){

    this.parametros.detalhes[i].veiculos.splice(this.parametros.detalhes[i].veiculos.indexOf(veiculo), 1);

  }

  ConsultarChassiNf(){

    this.ConsultarChassiNF = this.url+"/Romaneio/ConsultarChassiNF?token="+ this.authService.getToken() +"&chassiNF="+this.inputChassi;

    this.authService.showLoading();

    this.http.get( this.ConsultarChassiNF )
    .subscribe(res => {

      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.openModalNovoVeiculo(this.responseData.retorno);

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
        this.formData.chassiNf = '';
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error.status+' - '+error.statusText);
      this.formData.chassiNf = '';
    });
  }
  openModalNovoVeiculo(data){

    const chassiModal: Modal = this.modal.create(ModalNovoVeiculoComponent, {data: data });

    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

      for(let romaneio of this.parametros.detalhes){
        if(romaneio.id == Number(this.parametros.romaneioID)){
          romaneio.veiculos.push(data);
        }

      }

      for(let i = 0; i < this.parametros.detalhes.length; i++){
        this.chassis = new Array();

        for(let j = 0; j < this.parametros.detalhes[i].veiculos.length; j++){

          this.chassis.push(this.parametros.detalhes[i].veiculos[j].chassi);
        }
        this.parametros.detalhes[i].chassis = this.chassis;

      }
      this.authService.hideLoading();
      this.inputChassi = '';
    })

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
      // console.log(data);
    })
    chassiModal.onWillDismiss((data) =>{
      // console.log('data');
      // console.log(data);
    })
  }
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.viewCtrl.dismiss();
      this.navCtrl.push(RomaneioPage);

    })
  }
}
