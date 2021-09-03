import { Component, ViewChild } from '@angular/core';
import { App, ViewController, IonicPage, NavController, NavParams, Modal, ModalController, Select } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalNovoVeiculoComponent } from '../../components/modal-novo-veiculo/modal-novo-veiculo';
import { ModalNovoVeiculoCarregadoComponent } from '../../components/modal-novo-veiculo-carregado/modal-novo-veiculo-carregado';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalRomaneioComponent } from '../../components/modal-romaneio/modal-romaneio';
import { ModalMultiplosRomaneiosComponent } from '../../components/modal-multiplos-romaneios/modal-multiplos-romaneios';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'page-novo-romaneio',
  templateUrl: 'novo-romaneio.html',
})
export class NovoRomaneioPage {
  @ViewChild('select1') select1: Select;

  urlTipos: string;
  urlRomaneio: string;
  urlCarregarRomaneios: string;
  urlListarRomaneios: string;
  urlTransportadoras: string;
  responseData: any;
  veiculos = new Array();
  chassis = new Array();
  chassiNf: string;
  chassiNfCarregado: string;
  showRomaneio: boolean;
  formData = {
    "id": 0,
    "porto": "",
    "tipoID": 0,
    "tipo" : "",
    "data": "",
    "detalhes": [
      {
        "id": 0,
        "transportadoraCNPJID": 0,
        "placa": "",
        "frota": "",
        "veiculos" : this.veiculos,
        "chassis": []
      }
    ]
  };
  transportadoraCNPJID: number;
  romaneios = {
    "id": 0,
    "porto": "",
    "tipoID": 0,
    "tipo" : "",
    "data": "",
    "detalhes": []
  };
  dados: any;
  title: string;
  qrCodeText: string;
  inputChassi: string;
  romaneioID: number;
  romaneioIDinterno: number;
  romaneioIndex: string;
  url: string;
  dataTransportadoras: any;
  transportadoras: any;
  fixaTransportadora: boolean;
  transportadoraNome: any;
  clienteExterno: boolean;

  options: BarcodeScannerOptions;

  constructor(public http: HttpClient, private navParam: NavParams, public viewCtrl: ViewController,  private barcodeScanner: BarcodeScanner,public appCtrl: App, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthService ) {
    this.clienteExterno = this.authService.getUserData().clienteExterno;
    this.title = "NOVO ROMANEIO";
    this.formData.data = new Date().toISOString();
    this.formData.porto = this.authService.getLocalAtual();

    console.log('NovoRomaneioPage');
    this.url = this.authService.getUrl();

    if(this.isObjectEmpty(this.romaneios)){
      this.showRomaneio = true;
    }else{
      this.showRomaneio = false;
    }

    this.fixaTransportadora = true;

    var data = {
      message : "Romaneio criado com",
      iconClass : "icon-romaneio"
    }

  }
  ionViewWillLeave(){

  }
  ionViewWillLoad(){

  }
  ionViewDidEnter() {
    this.novoRomaneioListarTipos();
  }

  isObjectEmpty(obj) {
    if (obj) {
      for (var prop in obj) {
        return false;
      }
    }
    return true;
  }
  onTransportadoraChange(selectedValue) {

    this.formData.detalhes[0].transportadoraCNPJID = this.select1.value;

    this.transportadoraNome = this.select1.text;
    this.transportadoraCNPJID = this.select1.value;

  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: "",
      resultDisplayDuration: 0
    };

    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        //this.qrCodeText = barcodeData.text;
        debugger
        this.chassiNfCarregado=barcodeData.text;
        this.ConsultarChassiNfCarregados();
      },
      err => {
        var data = "Erro de qr code!";
        this.openModalErro(data);
      }
    );
  }




  ConsultarChassiNfCarregados(){

  //  this.romaneioIDinterno = id;
  //  this.romaneioIndex = i;

    this.authService.showLoading();
    this.urlTipos = this.url+"/Romaneio/ConsultarChassiNF?token="+ this.authService.getToken()+"&chassiNF="+this.chassiNfCarregado;

     this.http.get(this.urlTipos)
     .subscribe(res => {
      this.responseData = '';
      this.responseData = res;

       if(this.responseData.sucesso){

         this.authService.hideLoading();

         this.openModalNovoVeiculoCarregado(this.responseData.retorno);
        this.chassiNfCarregado = '';

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
  ConsultarChassiNf(){

    this.authService.showLoading();
    this.urlTipos = this.url+"/Romaneio/ConsultarChassiNF?token="+ this.authService.getToken()+"&chassiNF="+this.chassiNf;

     this.http.get(this.urlTipos)
     .subscribe(res => {
      this.responseData = '';
      this.responseData = res;

       if(this.responseData.sucesso){

         this.authService.hideLoading();

         this.openModalNovoVeiculo(this.responseData.retorno);
        this.chassiNf = '';
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
  openModalNovoVeiculo(data){

    const chassiModal: Modal = this.modal.create(ModalNovoVeiculoComponent, {data: data });

    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

      this.dados = data;

      if(!this.isObjectEmpty(this.dados)){
        this.formData.detalhes[0].veiculos.push(data);
        this.formData.detalhes[0].chassis.push(data['chassi']);
      }
    })
  }
  openModalNovoVeiculoCarregado(data){

    const chassiModal: Modal = this.modal.create(ModalNovoVeiculoCarregadoComponent, {data: data });

    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

      this.dados = data;

      if(!this.isObjectEmpty(this.dados)){

        this.romaneios.detalhes[this.romaneioIndex].chassis.push(data['chassi']);
        this.romaneios.detalhes[this.romaneioIndex].veiculos.push(data);

        this.salvarRomaneioCarregado();
      }
    })

  }
  novoRomaneioListarTipos() {

    this.authService.showLoading();

    this.urlTipos = this.url+"/Romaneio/ListarTipos?token="+ this.authService.getToken();

    this.http.get(this.urlTipos)
    .subscribe(res => {
      this.responseData = res;

      if(this.responseData.sucesso){

        //PREENCHER O TIPO DE ROMANEIO

        this.formData.tipo = this.responseData.retorno[0].nome;
        this.formData.tipoID = this.responseData.retorno[0].id;

        this.authService.hideLoading();
        this.novoRomaneioListarTransportadoras();

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
  novoRomaneioListarTransportadoras() {
    this.authService.showLoading();
    this.urlTransportadoras = this.url+"/Romaneio/ListarTransportadoras?token="+ this.authService.getToken();

    this.http.get(this.urlTransportadoras)
    .subscribe(res => {
      this.dataTransportadoras = res;

      if(this.dataTransportadoras.sucesso){

       //LISTAR TRANSPORTADORAS

       this.transportadoras = this.dataTransportadoras.retorno;
       this.authService.hideLoading();

       //
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
  ListarRomaneios(data){

    this.authService.showLoading();

    //LISTAR ROMANEIOS
    this.urlListarRomaneios = this.url+"/Romaneio/ListarRomaneios?token="+ this.authService.getToken()+"&data="+data;

    this.http.get(this.urlListarRomaneios)
    .subscribe(res => {
      this.responseData = "";
      this.responseData = res;

      if(this.responseData.sucesso){

      //LISTAR ROMANEIOS
      this.romaneios = this.responseData.retorno;

      this.authService.hideLoading();
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
  CarregarRomaneio(romaneioID){
    this.authService.showLoading();

    //CARREGAR ROMANEIOS
    this.urlCarregarRomaneios = this.url+"/Romaneio/CarregarRomaneio?token="+ this.authService.getToken()+"&romaneioID="+romaneioID;

    this.http.get(this.urlCarregarRomaneios)
    .subscribe(res => {
      this.responseData = "";
      this.responseData = res;

      if(this.responseData.sucesso){

        this.romaneios = {
          "id": 0,
          "porto": "",
          "tipoID": 0,
          "tipo" : "",
          "data": "",
          "detalhes": []
        };

      //LISTAR ROMANEIOS
      this.romaneios = this.responseData.retorno;
      this.romaneioID = this.responseData.retorno['id'];

      for(let i = 0; i < this.romaneios.detalhes.length; i++){
        this.chassis = new Array();
        this.transportadoraNome = this.romaneios.detalhes[i].transportadora;
        for(let j = 0; j < this.romaneios.detalhes[i].veiculos.length; j++){

          this.chassis.push(this.romaneios.detalhes[i].veiculos[j].chassi);
        }
        this.romaneios.detalhes[i].chassis = this.chassis;

      }
      this.formData.detalhes.splice(0, 1);
      this.formData.detalhes = [
        {
          "id": 0,
          "transportadoraCNPJID": this.romaneios.detalhes[0].transportadoraCNPJID,
          "placa": "",
          "frota": "",
          "veiculos" : [],
          "chassis": []
        }
      ];
      this.fixaTransportadora = false;
      this.formData.id = this.romaneios.id;

      this.authService.hideLoading();

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

  salvarRomaneio(){

    this.authService.showLoading();

    if(this.formData.detalhes[0].placa != '' && this.formData.detalhes[0].frota != ''){
      this.authService.showLoading();

      this.romaneios.id = this.formData.id;
      this.romaneios.tipoID = this.formData.tipoID;
      this.romaneios.data = this.formData.data;
      this.romaneios.porto = this.formData.porto;
      this.romaneios.tipo = this.formData.tipo;
      this.formData.detalhes[0].transportadoraCNPJID = this.transportadoraCNPJID;

      if(this.formData.detalhes[0]){

        this.romaneios.detalhes.push(this.formData.detalhes[0]);

      }

      if(this.romaneios.data != '' && this.romaneios.detalhes[0].placa != '' && this.romaneios.detalhes[0].frota != '' && this.romaneios.detalhes[0].transportadoraCNPJID != 0 ){

        this.urlRomaneio = this.url+"/Romaneio/SalvarRomaneio?token="+ this.authService.getToken();

        this.http.post( this.urlRomaneio, this.romaneios, httpOptions )
        .subscribe(res => {

          this.responseData = '';
          this.responseData = res;

          if(this.responseData.sucesso){

            this.romaneioID = this.responseData.retorno;
            this.authService.hideLoading();
            this.CarregarRomaneio(this.romaneioID);
            this.openModalMultiplosRomaneios();
          }
          else{
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
          }

        }, (error) => {
          this.authService.hideLoading();
          this.openModalErro(error.status+' - '+error.statusText);
        });

      }else{
        this.authService.hideLoading();
        this.openModalErro('Preencha todos os campos!');
      }

    }else{
      this.authService.hideLoading();
      this.openModalErro("Preencha todos os campos!");
    }

  }

  excluirFrota(romaneio, i){

    this.romaneios.detalhes.splice(i, 1);

    this.salvarRomaneioCarregado();

  }

  salvarRomaneioCarregado(){

    this.authService.showLoading();

    this.romaneios.porto = this.formData.porto;

    this.urlRomaneio = this.url+"/Romaneio/SalvarRomaneio?token="+ this.authService.getToken();

    this.http.post( this.urlRomaneio, this.romaneios, httpOptions )
    .subscribe(res => {

      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.romaneioID = this.responseData.retorno;
        this.authService.hideLoading();
        this.CarregarRomaneio(this.romaneioID);
        this.openModalMultiplosRomaneios();
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

  removeVeiculoCarregado(veiculo, i, j){

    this.romaneios.detalhes[i].veiculos.splice(j, 1);
    this.romaneios.detalhes[i].chassis.splice(j, 1);

    this.salvarRomaneioCarregado();

  }
  removeVeiculo (veiculo){

    this.formData.detalhes[0].chassis.splice(this.formData.detalhes[0].chassis.indexOf(veiculo.chassi), 1);
    this.formData.detalhes[0].veiculos.splice(this.formData.detalhes[0].veiculos.indexOf(veiculo), 1);

  }
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.veiculos = [];
      this.formData.detalhes = [
        {
          "id": 0,
          "transportadoraCNPJID": 0,
          "placa": "",
          "frota": "",
          "veiculos" : [],
          "chassis": []
        }
      ];

    })
  }

  openModalMultiplosRomaneios(){
    const romaneioModal: Modal = this.modal.create(ModalMultiplosRomaneiosComponent);
    romaneioModal.present();

    romaneioModal.onDidDismiss((data) => {
      this.veiculos = [];
      this.formData.detalhes = [
        {
          "id": 0,
          "transportadoraCNPJID": 0,
          "placa": "",
          "frota": "",
          "veiculos" : [],
          "chassis": []
        }
      ];

    })
  }
  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
  openModaRomaneio(data){
    const chassiModal: Modal = this.modal.create(ModalRomaneioComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
  cancelar(){
    this.authService.limparRomaneio();
    this.navCtrl.push(RomaneioPage);
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
    $('side-menu-ce').toggleClass('show');
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
