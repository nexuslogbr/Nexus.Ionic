import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController, Select, Modal } from 'ionic-angular';
import { HistoricoChassiPage } from '../../pages/historico-chassi/historico-chassi';
import * as $ from 'jquery';
import { NovaConferenciaVeiculosConferidosPage } from '../nova-conferencia-veiculos-conferidos/nova-conferencia-veiculos-conferidos';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'page-historico-chassi-resumo',
  templateUrl: 'historico-chassi-resumo.html',
})
export class HistoricoChassiResumoPage {
  @ViewChild('select1') select1: Select;
  formData = {
    chassi: '',
    modelo: '',
    local: '',
    lote: '',
  };

  formDataBloqueio = {
    id: '',
    veiculoID: '',
    tipoBloqueioID: '',
    dataBloqueio: '',
    dataDesbloqueio: '',
    descricaoBloqueio: '',
    observacaoDesbloqueio: '',
    usuarioBloqueio: '',
    usuarioDesbloqueio: ''
  }

  formDataServico = {
    id: '',
    veiculoID: '',
    tipoServicoID: '',
    tipoServicoNome: '',
    data: '',
    usuario: ''
  }

  formDataObservacao = {
    id: '',
    veiculoID: '',
    tipoObservacaoID: '',
    tipoObservacaoNome: '',
    descricao: '',
    data: '',
    usuario: ''
  }

  title: string;
  qrCodeText: string;
  url: string;
  historicos: any[] = new Array();
  parqueamento: any[] = new Array();

  veiculoId: any;

  constructor(public http: HttpClient, public navCtrl: NavController, public navParam: NavParams, public authService: AuthService, private modal: ModalController, private view: ViewController) {
    this.title = 'Histórico de Chassi';

    this.url = this.authService.getUrl();
  }

  ionViewDidLoad() {
    console.log('HistoricoChassiResumoPage');
    const data = this.navParam.get('data');
    console.log(data);

    if (data && data.length) {
      this.formData.chassi = data[0].chassi;
      this.formData.modelo = data[0].modelo;
      this.formData.local = data[0].local;
      this.formData.lote = data[0].lote;
    }

    this.historicos = data;

    this.consultarVeiculo();

  }


  consultarVeiculo() {

    let uriConsultarChassi =
      this.url +
      '/veiculos/ConsultarChassi?token=' +
      this.authService.getToken() +
      '&chassi=' +
      this.formData.chassi;

    this.authService.showLoading();

    this.http.get(uriConsultarChassi).subscribe(
      (res: any) => {
        ;
        if (res.sucesso) {
          this.veiculoId = res.retorno.id;

          this.consultaBloqueios(this.veiculoId);
          this.consultaServicos(this.veiculoId);
          this.consultaObservacoes(this.veiculoId);

          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(res.Mensagem);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.mensagem);
      }
    );
  }


  consultaBloqueios(veiculoID) {
    let uriConsultarChassi =
      this.url +
      '/bloqueio/Bloqueios?token=' +
      this.authService.getToken() +
      '&veiculoID=' +
      this.veiculoId +
      '&inativos= true';

    this.authService.showLoading();

    this.http.get(uriConsultarChassi).subscribe(
      (res: any) => {
        ;
        if (res.sucesso) {


          console.log('bloqueio')

          console.log(res)
          // this.formDataBloqueio.id = res.retorno[0].id;
          // this.formDataBloqueio.veiculoID = res.retorno[0].veiculoID;
          // this.formDataBloqueio.tipoBloqueioID = res.retorno[0].tipoBloqueioID;
          // this.formDataBloqueio.dataBloqueio = res.retorno[0].dataBloqueio;
          // this.formDataBloqueio.dataDesbloqueio = res.retorno[0].dataDesbloqueio
          // this.formDataBloqueio.descricaoBloqueio = res.retorno[0].descricaoBloqueio;
          // this.formDataBloqueio.observacaoDesbloqueio = res.retorno[0].observacaoDesbloqueio;
          // this.formDataBloqueio.usuarioBloqueio = res.retorno[0].usuarioBloqueio;
          // this.formDataBloqueio.usuarioDesbloqueio = res.retorno[0].usuarioDesbloqueio;


          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(res.Mensagem);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.mensagem);
      }
    );
  }


  consultaServicos(veiculoID) {
    let uriConsultarChassi =
      this.url +
      '/servico/Servicos?token=' +
      this.authService.getToken() +
      '&veiculoID=' +
      this.veiculoId;

    this.authService.showLoading();

    this.http.get(uriConsultarChassi).subscribe(
      (res: any) => {
        ;
        if (res.sucesso) {

          console.log(res.retorno)

       //   this.formDataServico.id = res.retorno[0].id;
          // this.formDataServico.veiculoID = res.retorno[0].veiculoID;
          // this.formDataServico.tipoServicoID = res.retorno[0].tipoServicoIDv;
          // this.formDataServico.tipoServicoNome = res.retorno[0].tipoServicoNome;
          // this.formDataServico.data = res.retorno[0].data;
          // this.formDataServico.usuario = res.retorno[0].usuario;

          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(res.Mensagem);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.mensagem);
      }
    );
  }


  consultaObservacoes(veiculoID) {
    let uriConsultarChassi =
      this.url +
      '/observacao/Observacoes?token=' +
      this.authService.getToken() +
      '&veiculoID=' +
      this.veiculoId;

    this.authService.showLoading();

    this.http.get(uriConsultarChassi).subscribe(
      (res: any) => {
        ;
        if (res.sucesso) {

        //  this.formDataObservacao.id = res.retorno[0].id;
          // this.formDataObservacao.veiculoID = res.retorno[0].veiculoID;
          // this.formDataObservacao.tipoObservacaoID = res.retorno[0].tipoObservacaoID;
          // this.formDataObservacao.tipoObservacaoNome = res.retorno[0].tipoObservacaoNome;
          // this.formDataObservacao.descricao = res.retorno[0].descricao;
          // this.formDataObservacao.data = res.retorno[0].data;
          // this.formDataObservacao.usuario = res.retorno[0].usuario;

          console.log(this.formDataObservacao)

          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(res.Mensagem);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.mensagem);
      }
    );
  }

  openModalErro(data) {
    this.view.dismiss();
    this.select1.close();
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(HistoricoChassiResumoPage);
    })
    chassiModal.onWillDismiss((data) => {
      console.log('data');
      console.log(data);
    })
  }

  closeModal() {
    this.view.dismiss();
    this.select1.close();
  }

  voltar() {
    this.navCtrl.push(HistoricoChassiPage);
    //this.navCtrl.pop();
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };
}
