import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { NavController, Select, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import 'rxjs/add/operator/map';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ConferenciaSumModelo } from '../../model/conferencia-sum-modelo';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'form-parqueamento',
  templateUrl: 'form-parqueamento.html'
})
export class FormParqueamentoComponent {
  @ViewChild('select1') select1: Select;

  title: string;
  formRecebimentoData = {
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao": '',
    "layoutNome": ''
  };
  layouts: any;
  private url: string;
  responseData3: any;
  responseData5: any;
  responseData4: any;
  bolsoes: any;
  filas: any;
  posicoes: any;
  dadosParqueamento: any;
  responseCarData: any;
  tShow: boolean;
  temValores:boolean;

  constructor(public http: HttpClient, public storage: Storage, private modal: ModalController, public navCtrl: NavController, private navParam: NavParams, private view: ViewController, public authService: AuthService) {
    this.title = "Parqueamento";
    this.tShow = true;
    console.log('FormParqueamentoComponent');
    this.url = this.authService.getUrl();
    this.temValores= false;



  
  }




  // carregar() {



  //   if (this.authService.getLayout()) {


  //     this.tShow = false;
  //     this.formRecebimentoData.layout = this.authService.getLayout();
  //     this.formRecebimentoData.layoutNome = this.authService.getLayoutNome();
  //     this.authService.showLoading();

  //     let listarBolsoes = this.url + "/Parquear/ListarBolsoes?token=" + this.authService.getToken() + "&layoutID=" + this.formRecebimentoData.layout;

  //     this.http.get<dataRetorno>(listarBolsoes)
  //       .subscribe(res => {

  //         this.responseData3 = res;
  //         if (this.responseData3.sucesso) {

  //           //PREENCHER O SELECT DO BOLSAO

  //           this.bolsoes = this.responseData3.retorno;
  //           this.authService.hideLoading();
  //         } else {
  //           this.authService.hideLoading();
  //           this.openModalErro(this.responseData3.mensagem);
  //         }

  //       }, (error) => {
  //         this.openModalErro(error.status + ' - ' + error.statusText);
  //         this.authService.hideLoading();
  //         console.log(error);
  //       });

  //   } else {
  //     this.tShow = true;
  //   }
  // }


  ionViewWillLoad() {
    const data = this.navParam.get('data');
    this.formRecebimentoData = data;
    this.layouts = this.formRecebimentoData.layout;

    this.storage.ready().then(() => {
      this.storage.get('parqueamento').then((data) => {
        if (data != null) {
          this.formRecebimentoData = data;

          console.log(this.formRecebimentoData)
          this.onLayoutChange(this.formRecebimentoData.layout);
          this.onBolsaoChange(this.formRecebimentoData.bolsao);
          this.onFilaChange(this.formRecebimentoData.fila);
          this.onPosicaoChange(this.formRecebimentoData.posicao);

          console.log(this.formRecebimentoData)
          this.temValores=true;
        }
      });
    });



  }

  onLayoutChange(selectedValue) {

    this.authService.showLoading();

    this.authService.setLayout(selectedValue);
    this.authService.setLayoutNome(this.select1.text);

    this.formRecebimentoData.layout = selectedValue;
    this.formRecebimentoData.chassi = this.formRecebimentoData['chassi'];
    this.formRecebimentoData.local = this.formRecebimentoData['local'];

    let listarBolsoes = this.url + "/Parquear/ListarBolsoes?token=" + this.authService.getToken() + "&layoutID=" + selectedValue;

    this.http.get<dataRetorno>(listarBolsoes, {})
      .subscribe(res => {

        this.responseData3 = res;
        if (this.responseData3.sucesso) {

          //PREENCHER O SELECT DO BOLSAO

          this.bolsoes = this.responseData3.retorno;
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData3.mensagem);
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });
  }
  onBolsaoChange(selectedValue) {

    this.authService.showLoading();
    this.formRecebimentoData.bolsao = selectedValue;

    let listarLinhas = this.url + "/Parquear/ListarLinhas?token=" + this.authService.getToken() + "&bolsaoID=" + selectedValue;

    this.http.get<dataRetorno>(listarLinhas, {})
      .subscribe(res => {

        this.responseData4 = res;
        if (this.responseData4.sucesso) {

          //PREENCHER O SELECT DA Fila

          this.filas = this.responseData4.retorno;
          this.authService.hideLoading();

        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData4.mensagem);
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });
  }

  onFilaChange(selectedValue) {
    this.authService.showLoading();
    this.formRecebimentoData.fila = selectedValue;

    let listarPosicoes = this.url + "/Parquear/ListarPosicoes?token=" + this.authService.getToken() + "&linhaID=" + selectedValue;

    this.http.get<dataRetorno>(listarPosicoes, {})
      .subscribe(res => {

        this.responseData5 = res;
        if (this.responseData5.sucesso) {

          //PREENCHER O SELECT DA POSIÇÂO

          this.posicoes = this.responseData5.retorno;

          this.formRecebimentoData.posicao=this.posicoes[0].id;
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData5.mensagem);
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });
  }
  
  
  onPosicaoChange(selectedValue) {
    debugger
    this.authService.showLoading();
    this.formRecebimentoData.posicao = selectedValue;
    this.authService.hideLoading();
  }



  closeModal() {
    this.view.dismiss(this.formRecebimentoData);
  }


  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }

  ParquearVeiculo() {

    this.authService.showLoading();

    let parquearVeiculo = this.url + "/Parquear/ParquearVeiculo?token=" + this.authService.getToken();

    this.dadosParqueamento = {
      "veiculoID": this.formRecebimentoData.id,
      "posicaoID": this.formRecebimentoData.posicao
    }

    this.http.put(parquearVeiculo, this.dadosParqueamento, httpOptions)
      .subscribe(res => {

        this.responseCarData = '';
        this.responseCarData = res;

        if (this.responseCarData.sucesso) {

          this.authService.hideLoading();

          var data = {
            message: "Parqueamento realizado com",
            iconClass: "parking-green"
          }
          this.view.dismiss();

          this.storage.set('parqueamento', this.formRecebimentoData);

         // this.onPosicaoChange(null);
          this.openModalSucesso(data);
        }
        else {
          this.authService.hideLoading();
          this.openModalErro(this.responseCarData.mensagem);
        }

      }, (error) => {

        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      });
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }
  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, { data: data });
    chassiModal.present();
    chassiModal.onDidDismiss((data) => {
      // this.view.dismiss(data);
      this.navCtrl.push(ParqueamentoPage);
    })
  }
  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, { data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      // console.log(data);
    })
    chassiModal.onWillDismiss((data) => {
      // console.log(data);
    })
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