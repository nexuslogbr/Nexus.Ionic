import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { BloqueioPage } from '../../pages/bloqueio/bloqueio';
import { LancamentoServicoPage } from '../../pages/lancamento-servico/lancamento-servico';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'form-lancamento-servico',
  templateUrl: 'form-lancamento-servico.html'
})
export class FormLancamentoServicoComponent {
  @ViewChild('select1') select1: Select;

  title: string;
  formMovimentacaoData = {
    "id": '',
    "chassi": '',
    "localAtual": '',
    "layoutAtual": '',
    "bolsaoAtual": '',
    "fila": '',
    "posicaoAtual": '',
    "status": ''
  };
  novoFormMovimentacaoData = {
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao": '',
    "layoutNome": ''
  };

  FormLancamentoServicoData = {
    "id": '',
    'chassi': '',
    "veiculoID": '',
    "tipoServicoID": ''
  };
  chassi: string;
  data_hora: string;
  bolsaoAtual: string;
  localAtual: string;
  layoutAtual: string;
  posicaoAtual: string;
  // chassi: string;
  tipos: any;
  posicao: string;
  id: string;
  parametros: any;
  private url: string;

  bolsoes: any;
  filas: any;
  posicoes: any;
  dadosLancamento: any;
  responseData2: any;
  responseData3: any;
  responseData4: any;
  responseData5: any;
  retorno: any;
  tShow: boolean;

  constructor(public http: HttpClient, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, public authService: AuthService, private view: ViewController) {
    // console.log('Hello FormMovimentacaoComponent Component');
    this.title = "Lançamento de Serviço";

    console.log('FormLancamentoServicoComponent');
    this.url = this.authService.getUrl();


    this.loadTiposBloqueio();
  }
  ionViewDidEnter() {

    if (this.authService.getLayout()) {
      this.tShow = false;
      //this.novoFormMovimentacaoData.layout = this.authService.getLayout(); 
      //this.novoFormMovimentacaoData.layoutNome = this.authService.getLayoutNome(); 
      this.authService.showLoading();
      // let listarBolsoes = this.url+"/Movimentar/ListarBolsoes?token="+ this.authService.getToken() +"&layoutID="+this.novoFormMovimentacaoData.layout;

      // this.http.get<dataRetorno>( listarBolsoes, {})
      // .subscribe(res => {

      //   this.responseData3 = res;
      //   if(this.responseData3.sucesso){

      //   //PREENCHER O SELECT DO BOLSAO

      //   this.bolsoes = this.responseData3.retorno;
      //   this.authService.hideLoading();
      //   }else{
      //   this.authService.hideLoading();
      //   this.openModalErro(this.responseData3.mensagem);
      //   }

      // }, (error) => {

      //   this.openModalErro(error.status+' - '+error.statusText);
      //   this.authService.hideLoading();
      //   console.log(error);
      // });

    } else {
      this.tShow = true;
    }
  }
  ionViewWillLoad() {

    const data = this.navParam.get('data');

    console.log(data)


    this.FormLancamentoServicoData = data;
    //this.FormLancamentoServicoData.data_hora = new Date().toLocaleDateString();
    // // console.log(data);
    // // console.log(this.formMovimentacaoData);
    // this.chassi = data.chassi;
    // this.localAtual = data.localAtual;
    // this.layoutAtual = data.layoutAtual;
    // this.posicaoAtual = data.posicaoAtual;
    // this.bolsaoAtual = data.bolsaoAtual;
    // this.novoFormMovimentacaoData.local = data.localAtual;
    // this.id = data.id;
    // this.loadLayout();

  }
  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
  closeModal() {

    this.view.dismiss();
  }
  cancelar() {
    this.navCtrl.push(MovimentacaoPage);
  }



  loadTiposBloqueio() {
    this.authService.showLoading();

    let listarTipos = this.url + "/Servico/TiposServico?token=" + this.authService.getToken();

    this.http.get<dataRetorno>(listarTipos)
      .subscribe(res => {

        this.responseData2 = res;

        if (this.responseData2.sucesso) {
          this.tipos = this.responseData2.retorno;
          //this.novoFormMovimentacaoData.id = this.id;
          //PREENCHER O SELECT DO LAYOUT    
          //  this.layouts = this.responseData2.retorno;
          this.authService.hideLoading();

          // console.log(this.responseData2.retorno);
          // console.log(this.novoFormMovimentacaoData);

        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData2.mensagem);
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });
  }


  onTipoChange(selectedValue) {
    this.FormLancamentoServicoData.tipoServicoID = selectedValue;

  }

  Bloquear() {


    this.authService.showLoading();
    let lancamento = this.url + "/Servico/Incluir?token=" + this.authService.getToken();

    this.dadosLancamento = {
      "veiculoID": this.FormLancamentoServicoData.id,
      "tipoServicoID": this.FormLancamentoServicoData.tipoServicoID
    }

    this.http.post<dataRetorno>(lancamento, this.dadosLancamento, httpOptions)
      .subscribe(res => {

        this.retorno = '';
        this.retorno = res;

        console.log(this.retorno);

        if (this.retorno.sucesso) {

          this.authService.hideLoading();
          var data = {
            message: "Lançamento de serviço realizado com",
            iconClass: "icon-lancamento-servico"
          }
          this.openModalSucesso(data);
          this.FormLancamentoServicoData.chassi = ''
        }
        else {
          this.authService.hideLoading();
          this.openModalErro(this.retorno.mensagem);
          // this.navCtrl.push(HomePage);         
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });

  }
  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    })
    chassiModal.onWillDismiss((data) => {
      console.log('data');
      console.log(data);
    })
  }
  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
      this.navCtrl.push(LancamentoServicoPage);

    })
  }

  voltar() {
    //this.dragulaService.find('nested-bag').drake.destroy();
    const data = {};
    this.view.dismiss();
    this.navCtrl.push(LancamentoServicoPage);
  }

}
interface dataRetorno {
  dataErro: string;
  mensagem: string;
  retorno: any;
  sucesso: boolean;
  tipo: number;
  urlRedirect: string
}