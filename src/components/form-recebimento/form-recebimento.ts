import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController,
} from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../../providers/data-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Component({
  selector: 'form-recebimento',
  templateUrl: 'form-recebimento.html',
})
export class FormRecebimentoComponent {
  title: string;
  formRecebimentoData = {
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
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



  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;


  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    private navParam: NavParams,
    private view: ViewController,
    public authService: AuthService,
    private dataService: DataService
  ) {
    this.title = 'Parqueamento';
    this.url = this.authService.getUrl();

    if (localStorage.getItem('tema') == "Cinza" || !localStorage.getItem('tema')) {
      this.primaryColor = '#595959';
      this.secondaryColor = '#484848';
      this.inputColor = '#595959';
      this.buttonColor = "#595959";
    } else {
      this.primaryColor = '#06273f';
      this.secondaryColor = '#00141b';
      this.inputColor = '#06273f';
      this.buttonColor = "#1c6381";
    }
  }

  ionViewDidEnter() {
    console.log('FormRecebimentoComponent ionViewDidEnter');
  }

  ionViewWillLoad() {
    ;
    const data = this.navParam.get('data');
    this.formRecebimentoData = data;
    this.layouts = this.formRecebimentoData.layout;
  }

  onLayoutChange(selectedValue) {
    this.authService.showLoading();

    this.formRecebimentoData.layout = selectedValue;
    this.formRecebimentoData.chassi = this.formRecebimentoData['chassi'];
    this.formRecebimentoData.local = this.formRecebimentoData['local'];

    // let listarBolsoes =
    //   this.url +
    //   "/Parquear/ListarBolsoes?token=" +
    //   this.authService.getToken() +
    //   "&layoutID=" +
    //   selectedValue;

    // this.http.get(listarBolsoes).subscribe(
    //   res => {
    //     this.responseData3 = res;
    //     if (this.responseData3.sucesso) {
    //       //PREENCHER O SELECT DO BOLSAO

    //       this.bolsoes = this.responseData3.retorno;
    //       this.authService.hideLoading();
    //     } else {
    //       this.authService.hideLoading();
    //       this.openModalErro(this.responseData3.mensagem);
    //     }
    //   },
    //   error => {
    //     this.openModalErro(error.status + " - " + error.statusText);
    //     this.authService.hideLoading();
    //     console.log(error);
    //   }
    // );

    this.dataService.consultarBolsoesDisponiveis(selectedValue).subscribe(
      (res) => {
        this.responseData3 = res;
        if (this.responseData3.sucesso) {
          //PREENCHER O SELECT DO BOLSAO

          this.bolsoes = this.responseData3.retorno;
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData3.mensagem);
        }
      },
      (error) => {
        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  onBolsaoChange(selectedValue) {
    this.authService.showLoading();
    this.formRecebimentoData.bolsao = selectedValue;

    // let listarLinhas =
    //   this.url +
    //   "/Parquear/ListarLinhas?token=" +
    //   this.authService.getToken() +
    //   "&bolsaoID=" +
    //   selectedValue;

    // this.http.get(listarLinhas).subscribe(
    //   res => {
    //     this.responseData4 = res;
    //     if (this.responseData4.sucesso) {
    //       //PREENCHER O SELECT DA Fila

    //       this.filas = this.responseData4.retorno;
    //       this.authService.hideLoading();
    //     } else {
    //       this.authService.hideLoading();
    //       this.openModalErro(this.responseData4.mensagem);
    //     }
    //   },
    //   error => {
    //     this.openModalErro(error.status + " - " + error.statusText);
    //     this.authService.hideLoading();
    //     console.log(error);
    //   }
    // );

    this.dataService.consultarLinhasDisponiveis(selectedValue).subscribe(
      (res) => {
        this.responseData4 = res;
        if (this.responseData4.sucesso) {
          //PREENCHER O SELECT DA Fila
          this.filas = this.responseData4.retorno;
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData4.mensagem);
        }
      },
      (error) => {
        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  onFilaChange(selectedValue) {
    this.authService.showLoading();
    this.formRecebimentoData.fila = selectedValue;

    // let listarPosicoes =
    //   this.url +
    //   "/Parquear/ListarPosicoes?token=" +
    //   this.authService.getToken() +
    //   "&linhaID=" +
    //   selectedValue;

    // this.http.get(listarPosicoes).subscribe(
    //   res => {
    //     this.responseData5 = res;
    //     if (this.responseData5.sucesso) {
    //       //PREENCHER O SELECT DA POSIÇÂO

    //       this.posicoes = this.responseData5.retorno;
    //       this.authService.hideLoading();
    //     } else {
    //       this.authService.hideLoading();
    //       this.openModalErro(this.responseData5.mensagem);
    //     }
    //   },
    //   error => {
    //     this.openModalErro(error.status + " - " + error.statusText);
    //     this.authService.hideLoading();
    //     console.log(error);
    //   }
    // );

    this.dataService.consultarPosicoesDisponiveis(selectedValue).subscribe(
      (res) => {
        this.responseData5 = res;
        if (this.responseData5.sucesso) {
          //PREENCHER O SELECT DA POSIÇÂO

          this.posicoes = this.responseData5.retorno;
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData5.mensagem);
        }
      },
      (error) => {
        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  onPosicaoChange(selectedValue) {
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
  };

  ParquearVeiculo() {
    ;
    this.authService.showLoading();

    let parquearVeiculo =
      this.url +
      '/Parquear/ParquearVeiculo?token=' +
      this.authService.getToken();

    this.dadosParqueamento = {
      veiculoID: this.formRecebimentoData.id,
      posicaoID: this.formRecebimentoData.posicao,
      movimentar: true,
    };

    this.http
      .put(parquearVeiculo, this.dadosParqueamento, httpOptions)
      .subscribe(
        (res) => {
          this.responseCarData = '';
          this.responseCarData = res;

          if (this.responseCarData.sucesso) {
            this.authService.hideLoading();

            var data = {
              message: 'Parqueamento realizado com',
              iconClass: 'parking-green',
            };
            this.openModalSucesso(data);
          } else {
            this.authService.hideLoading();
            this.openModalErro(this.responseCarData.mensagem);
          }
        },
        (error) => {
          this.openModalErro(error.status + ' - ' + error.statusText);
          this.authService.hideLoading();
          console.log(error);
        }
      );
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data,
    });
    chassiModal.present();
    chassiModal.onDidDismiss((data) => {
      this.view.dismiss(data);
      this.navCtrl.push(HomePage);
    });
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      // console.log(data);
    });
    chassiModal.onWillDismiss((data) => {
      // console.log(data);
    });
  }
}
