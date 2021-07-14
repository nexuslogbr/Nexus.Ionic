import { Component } from '@angular/core';
import { NavParams,NavController,Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalNovoVeiculoComponent } from '../../components/modal-novo-veiculo/modal-novo-veiculo'
import { RomaneioCePage } from '../../pages/romaneio-ce/romaneio-ce';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as moment from 'moment';
import * as $ from 'jquery';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'modal-editar-romaneio-ce',
  templateUrl: 'modal-editar-romaneio-ce.html'
})
export class ModalEditarRomaneioCeComponent {

  title: string;
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
  parametros: any;
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
  romaneio = {
    romaneioID:'',
    numero : '',
    porto : '',
    tipo:'',
    tipoID : '',
    data : '',
    transportadoraID : 0,
    transportadora : '',
    placa : '',
    frota : '',
    chassis : []
  }
  newCourse: any;
  novaData: any;
  url: string;
  urlTransportadoras: string;
  chassis: any;
  novoChassis: string[] = new Array();

  constructor(private httpClient: HttpClient, private modal: ModalController, private navParam: NavParams,public authService: AuthService, public navCtrl: NavController) {
    this.title = 'EDITAR ROMANEIO';
    // this.formData.data = new Date().toISOString();
    console.log('ModalEditarRomaneioCeComponent');
    this.url = this.authService.getUrl();
    setTimeout(() =>
    {
      this.removeVeiculo(event);
    },
    1000);
  }
  popView(){
    this.navCtrl.pop();
  }

  ionViewDidEnter() {
    this.editarRomaneioListarTransportadoras();
    this.parametros = this.navParam.get('data');
    console.log(this.parametros );
    var data = new Date(this.parametros.data);
    this.formData.data = new Date(this.parametros.data).toISOString();


    for(var i = 0; i < this.parametros.detalhes.length; i++){
      this.novoChassis.push(this.parametros.detalhes[i].chassi);
    }

    this.carregarVeiculos(this.parametros.detalhes);
    var formattedDate = moment(this.formData.data).format('YYYYMMDD');
    console.log(this.parametros);
    this.romaneio = {
      romaneioID: this.parametros.romaneioID,
      numero : this.parametros.numero,
      porto : this.parametros.local,
      tipo: this.parametros.tipo,
      tipoID : this.parametros.tipoID,
      data : formattedDate,
      transportadoraID : this.parametros.transportadoraID,
      transportadora : this.parametros.transportadora,
      placa : this.parametros.caminhao,
      frota : this.parametros.frota,
      chassis : this.novoChassis
    }

    this.chassis = this.parametros.detalhes;
    this.carregarVeiculos(this.parametros.detalhes);
    console.log(this.romaneio);
  }
  editarRomaneio(){

    this.authService.showLoading();

    console.log(this.romaneio);

    let salvarRomaneio = this.url+"/Romaneio/SalvarRomaneio?token="+ this.authService.getToken();

    this.httpClient.post( salvarRomaneio, this.romaneio, httpOptions ).subscribe(
      data => {

        this.responseData = '';
        this.responseData = data;

        if(this.responseData.sucesso){

          this.authService.setVeiculoTemp(this.responseData.retorno);
          alert(this.responseData.mensagem);
          this.openModalNovoVeiculo(this.responseData.retorno);
        }else{
          this.authService.hideLoading();
          alert(this.responseData.mensagem);
          this.formData.chassiNf = '';
        }
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status+' - '+err.statusText);
        console.log(err);
        this.formData.chassiNf = '';
      }
    );
  }

  editarRomaneioListarTransportadoras() {
    this.authService.showLoading();
    let urlTransportadoras = this.url+"/Romaneio/ListarTransportadoras?token="+ this.authService.getToken();

    this.httpClient.get( urlTransportadoras ).subscribe(
      data => {

        this.dataTransportadoras = data;

        if(this.dataTransportadoras.sucesso){

          //LISTAR TRANSPORTADORAS

          this.transportadoras = this.dataTransportadoras.retorno;
          this.authService.hideLoading();
        }else{
          this.authService.hideLoading();
          // this.authService.showError(this.responseData5.mensagem);
          alert(this.dataTransportadoras.mensagem);
        }
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status+' - '+err.statusText);
        console.log(err);
      }
    );

  }

  onTransportadoraChange(value){
    this.romaneio.transportadoraID = Number(value);
    console.log(this.romaneio.transportadoraID);
  }

  removeVeiculo = function(event){

    let list = <HTMLElement>document.body.querySelector(".form-novo-veiculo");
    list.addEventListener("click", (event) => {
      var target = event.target || event.srcElement || event.currentTarget;
      var chassiProp = $(event.target).prop('id');
      var chassiAttr = $(event.target).attr('id');
      if(chassiProp){
        $('.'+chassiProp).remove();
        console.log($('.'+chassiProp));
        console.log(chassiProp);
        for(var i = 0; i < this.romaneio.chassis.length; i++){
          if(this.romaneio.chassis[i] == chassiProp){
            this.romaneio.chassis.splice(i, 1);
            console.log(this.romaneio);
          }
        }
      }
    });

  }
  ConsultarChassiNf(){

    this.url = "/Romaneio/ConsultarChassiNF?token="+ this.authService.getToken() +"&chassiNF="+this.inputChassi;

    this.authService.showLoading();

    this.httpClient.get(this.authService.getUrl() + this.url).subscribe(
      data => {

        this.responseData = '';
        this.responseData = data;

        if(this.responseData.sucesso){

          this.authService.setVeiculoTemp(this.responseData.retorno);
          alert(this.responseData.mensagem);
          this.openModalNovoVeiculo(this.responseData.retorno);
        }else{
          this.authService.hideLoading();
          alert(this.responseData.mensagem);
          this.formData.chassiNf = '';
        }
      },
      err => {
        this.authService.hideLoading();
        this.openModalErro(err.status+' - '+err.statusText);
        console.log(err);
        this.formData.chassiNf = '';
      }
    );
  }
  openModalNovoVeiculo(data){

    const chassiModal: Modal = this.modal.create(ModalNovoVeiculoComponent, {data: data });

    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      if(data){

        $('.add-novo-veiculo').append('\
        <div class="form-item '+data.chassi+'">\
        <i class="icon icon-close" id="'+data.chassi+'" (Click)="removeVeiculo($event)"></i>\
        <div class="form-group row">\
            <label for="example-text-input" class="col-2 col-form-label">NFE:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data.nfe+'" disabled />\
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
        </div>');

        this.romaneio.chassis.push(data.chassi);

      }
    })
  }

  carregarVeiculos(data){
    console.log(data);
    $('.form-item').remove();
    for(var i = 0; i < data.length; i++){
      $('.add-novo-veiculo').append('\
        <div class="form-item '+data[i].chassi+'">\
        <i class="icon icon-close" id="'+data[i].chassi+'" (Click)="removeVeiculo($event)"></i>\
        <div class="form-group row">\
            <label for="example-text-input" class="col-2 col-form-label">NFE:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data[i].nota+'" disabled />\
            </div>\
        </div>\
        <div class="form-group row">\
            <label for="" class="col-2 col-form-label">Chassi:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data[i].chassi+'" disabled />\
            </div>\
        </div>\
        <div class="form-group row">\
            <label for="" class="col-2 col-form-label">Modelo:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data[i].modelo+'" disabled />\
            </div>\
        </div>\
        <div class="form-group row">\
            <label for="" class="col-2 col-form-label">Posição:</label>\
            <div class="col-10">\
                <input type="text" class="form-control" name="" id="" value="" placeholder="'+data[i].posicao+'" disabled />\
            </div>\
        </div> \
      </div>');
    }
  }
  toggleMenu = function(this){
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu-ce').toggleClass('show');
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
