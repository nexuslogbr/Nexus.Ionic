import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalNovoVeiculoComponent } from '../../components/modal-novo-veiculo/modal-novo-veiculo';
import { RomaneioCePage } from '../../pages/romaneio-ce/romaneio-ce';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import * as $ from 'jquery';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'page-novo-romaneio-ce',
  templateUrl: 'novo-romaneio-ce.html',
})
export class NovoRomaneioCePage {

  urlTipos: string;
  urlTransportadoras: string;
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
  responseData: any;
  dataTransportadoras: any;
  title: string;
  transportadoras: any;
  qrCodeText: string;
  inputChassi: string;
  veiculos = new Array();
  veiculoTemp = {
    'chassi' : '',
    'modelo' : '',
    'nfe' : '',
    'posicao' : ''
  };
  url: string;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, public navParams: NavParams,public authService: AuthService ) {
    console.log('NovoRomaneioCePage');
    this.url = this.authService.getUrl();
    this.formData.data = new Date().toISOString();
    this.title = "NOVO ROMANEIO";
    this.formData.chassiNf = '';
    this.novoRomaneioListarTipos();
    this.formData.porto = this.authService.getLocalAtual();
    setTimeout(() =>
    {
      this.removeVeiculo(event);
    },
    1000);
  }
  ionViewDidEnter() {

  }
  onTransportadoraChange(selectedValue) {
    let transportadoraId = Number(selectedValue);
    this.authService.setRomaneioTransportadora(transportadoraId);
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu-ce').toggleClass('show');
  }
  ConsultarChassiNf(){

    let consultarChassi = this.url+"/Romaneio/ConsultarChassiNF?token="+ this.authService.getToken() +"&chassiNF="+this.formData.chassiNf;

    this.authService.showLoading();

    this.http.get( consultarChassi )
    .subscribe(res => {
      this.authService.hideLoading();
      this.responseData = res;
      if(this.responseData.sucesso){
        this.authService.setVeiculoTemp(this.responseData.retorno);
        this.openModalNovoVeiculo(this.responseData.retorno);
      }else{
        this.openModalErro(this.responseData.mensagem);
        this.formData.chassiNf = '';
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
        this.formData.chassiNf = '';
    });
  }
  openModalNovoVeiculo(data){

    const chassiModal: Modal = this.modal.create(ModalNovoVeiculoComponent, {data: data });

    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      if(data){
        this.authService.setRomaneioTempChassis(data.chassi);
        console.log(data);
        $('#form-novo-veiculo').append('\
        <div class="form-item '+data.chassi+'">\
        <i class="icon icon-close" id="'+data.chassi+'" (Click)="removeVeiculo($event)"></i>\
        <div class="form-group row">\
            <label for="example-text-input" class="col-2 col-form-label">NFE:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data.nota+'" disabled />\
            </div>\
        </div>\
        <div class="form-group row">\
            <label for="" class="col-2 col-form-label">Chassi:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data.chassi+'" disabled />\
            </div>\
        </div>\
        <div class="form-group row">\
            <label for="" class="col-2 col-form-label">Modelo:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data.modelo+'" disabled />\
            </div>\
        </div>\
        <div class="form-group row">\
            <label for="" class="col-2 col-form-label">Posição:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data.posicao+'" disabled />\
            </div>\
        </div> \
        </div>')

      }
    })

  }
  novoRomaneioListarTipos() {
    this.authService.showLoading();
    this.urlTipos = this.url+"/Romaneio/ListarTipos?token="+ this.authService.getToken();

    this.http.get( this.urlTipos )
    .subscribe(res => {
      this.responseData = res;
      this.authService.hideLoading();
      if(this.responseData.sucesso){
       //PREENCHER O TIPO DE ROMANEIO
       this.formData.tipo = this.responseData.retorno[0].nome;
       this.formData.tipoID = this.responseData.retorno[0].id;
       this.authService.setRomaneioTipoID(this.formData.tipoID);
       this.novoRomaneioListarTransportadoras();
      }else{
       this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.openModalErro(error);
      console.log(error);
    });

  }
  novoRomaneioListarTransportadoras() {
    this.authService.showLoading();
    this.urlTransportadoras = this.url+"/Romaneio/ListarTransportadoras?token="+ this.authService.getToken();

    this.http.get( this.urlTransportadoras )
    .subscribe(res => {
      this.authService.hideLoading();
      this.dataTransportadoras = res;
      if(this.responseData.sucesso){

       //LISTAR TRANSPORTADORAS

       this.transportadoras = this.dataTransportadoras.retorno;
      }else{
       this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
    });
  }

  novoRomaneio(){
    var formattedDate = moment(this.formData.data).format('YYYYMMDD');
    this.authService.setRomaneioData(formattedDate);
    this.authService.setRomaneioTipoID(this.formData.tipoID);
    this.authService.setRomaneioPlaca(this.formData.placa);
    this.authService.setRomaneioFrota(this.formData.frota);
    this.authService.setRomaneioChassis(this.authService.getRomaneioChassis());
    this.salvarRomaneio({detalhes : [this.authService.getNovoRomaneio()] });
  }
  salvarRomaneio(parametros){

    this.authService.showLoading();

    let salvarRomaneio = this.url+"/Romaneio/SalvarRomaneio?token="+ this.authService.getToken();

    this.http.post( salvarRomaneio , parametros, httpOptions)
    .subscribe(res => {
      this.authService.hideLoading();
      this.responseData = res;

      if(this.responseData.sucesso){

        this.navCtrl.push(RomaneioCePage);
      }else{
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(error);
    });
  }
  removeVeiculo = function(event){

    let list = <HTMLElement>document.body.querySelector(".form-novo-veiculo");
    list.addEventListener("click", (event) => {
      // var target = event.target || event.srcElement || event.currentTarget;
      var chassiProp = $(event.target).prop('id');
      // var chassiAttr = $(event.target).attr('id');
      if(chassiProp){
        $('#'+chassiProp).parent('.'+chassiProp).remove();
        console.log($('#'+chassiProp).parent('.'+chassiProp));
        this.authService.removeVeiculo(chassiProp);
        console.log(chassiProp);
      }
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

}
