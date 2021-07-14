import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { ModalEditarRomaneioComponent } from '../../components/modal-editar-romaneio/modal-editar-romaneio';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'modal-analise-romaneio',
  templateUrl: 'modal-analise-romaneio.html'
})
export class ModalAnaliseRomaneioComponent {

  title: string;
  romaneioID: Number;
  novaData: any;
  chassis: string[];
  classe: string;
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
        veiculos : []
      }
    ]
  };
  responseData: any;
  url: string;
  SalvarStatus: string;
  dataPesquisa: any;
  detalhes: any;
  showRomaneio: boolean;
  clienteExterno: boolean;

  constructor(private http: HttpClient, private view: ViewController, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, public authService: AuthService ) {
    this.title = 'ANÁLISE DE ROMANEIO';
    this.clienteExterno = this.authService.getUserData().clienteExterno;
    this.showRomaneio = true;
    console.log('ModalAnaliseRomaneioComponent');
    this.url = this.authService.getUrl();

  }

  ionViewDidLoad() {

    this.parametros = this.navParam.get('parametros');

    if(this.parametros != null){
      this.novaData = moment(this.parametros.data).format('DD/MM/YYYY');

      this.romaneioID = Number(this.parametros.romaneioID);

      this.dataPesquisa = this.parametros.data;
      this.detalhes = this.parametros.detalhes;
      this.classe = this.parametros.classe;
    }

    for(let i in this.parametros.detalhes){

      console.log(this.parametros.detalhes[i].id);
      console.log(this.romaneioID);

      if(this.parametros.detalhes[i].id == this.romaneioID){

        this.parametros.detalhes[i].hidden = false;

      }else{
        this.parametros.detalhes[i].hidden = true;
      }
    };
  };
  voltar(){

    this.authService.showLoading();

    let listarRomaneio = this.url+"/Romaneio/ListarRomaneios?token="+ this.authService.getToken()+"&data="+this.dataPesquisa;

    this.http.get<dataRetorno>( listarRomaneio)
    .subscribe(res => {

      this.responseData = '';
      this.responseData = res;

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        this.navCtrl.push(RomaneioPage, {data: this.responseData.retorno});
      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
    });

  }

  editar(){

    this.navCtrl.push(ModalEditarRomaneioComponent, {data: this.parametros});
  }
  aprovar(){
    this.authService.showLoading();
    var romaneioID = Number(this.parametros.id);
    var status = Number(4);
    let dados = {
      romaneioID: romaneioID,
      status: status
    }
    console.log(this.parametros);
    console.log(dados);
    let salvarStatus = this.url+"/Romaneio/SalvarStatus?token="+this.authService.getToken();

    this.http.post( salvarStatus, dados, httpOptions )
    .subscribe(res => {

      this.responseData = '';
      this.responseData = res;
      console.log(this.responseData);

      if(this.responseData.sucesso){

        this.authService.hideLoading();
        alert(this.responseData.mensagem);
        this.navCtrl.push(RomaneioPage);
        // this.navCtrl.setRoot(HomePage,  this.responseData);

      }
      else{
        this.authService.hideLoading();
        this.authService.showError(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error.status+' - '+error.statusText);
      console.log(error);
    });
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
      this.navCtrl.push(RomaneioPage);
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

  closeModal(){
    this.view.dismiss();
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
