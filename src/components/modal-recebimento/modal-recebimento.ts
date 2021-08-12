import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController,
} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { FormRecebimentoComponent } from '../../components/form-recebimento/form-recebimento';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-recebimento',
  templateUrl: 'modal-recebimento.html',
})
export class ModalRecebimentoComponent {
  formRecebimentoData: any;
  private url: string;
  responseData: any;
  layouts: any;
  modoOperacao: number;

  constructor(
    private http: HttpClient,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();
  }

  ionViewWillLoad() {
    ;
    console.log('ionViewWillLoad ModalRecebimentoComponent');
    const data = this.navParam.get('data');
    this.formRecebimentoData = data;
  }

  closeModal() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.view.dismiss(data);
  }

  cancelar() {
    this.navCtrl.push(RecebimentoPage);
  }

  openModal() {
    const recModal: Modal = this.modal.create(FormRecebimentoComponent);
    recModal.present();

    recModal.onDidDismiss((data) => {
      console.log(data);
    });
    recModal.onWillDismiss((data) => {
      console.log('data');
      console.log(data);
    });
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  parqueamento() {
    ;
    this.authService.showLoading();

    if (!this.formRecebimentoData.id) {
      let uriConsultarChassi =
        this.url +
        '/veiculos/ConsultarChassi?token=' +
        this.authService.getToken() +
        '&chassi=' +
        this.formRecebimentoData.chassi;

      this.authService.showLoading();

      this.http.get(uriConsultarChassi).subscribe(
        (res: any) => {
          ;
          if (res.sucesso) {
            this.formRecebimentoData.id = res.retorno.id;
            this.buscarLayout();
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
    } else {
      this.buscarLayout();
    }
  }

  buscarLayout() {
    let ListarLayouts =
      '/Parquear/ListarLayouts?token=' + this.authService.getToken();
    this.http.get(this.url + ListarLayouts).subscribe(
      (res) => {
        this.responseData = '';
        this.responseData = res;

        if (this.responseData.sucesso) {
          //PREENCHER O SELECT DO LAYOUT
          this.formRecebimentoData.layout = this.responseData.retorno;
          this.authService.hideLoading();

          this.formRecebimentoData.local = this.authService.getLocalAtual();

          const recForm: Modal = this.modal.create(FormRecebimentoComponent, {
            data: this.formRecebimentoData,
          });
          recForm.present();

          recForm.onDidDismiss((data) => {
            console.log(data);
          });
          recForm.onWillDismiss((data) => {
            console.log('data');
            console.log(data);
          });
        } else {
          this.authService.hideLoading();
          // this.authService.showError(this.responseData2.mensagem);
          alert(this.responseData.mensagem);
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText);
        console.log(error);
      }
    );
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    });
    chassiModal.onWillDismiss((data) => {});
  }
}
