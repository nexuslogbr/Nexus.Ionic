import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController,
} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalRecebimentoComponent } from '../modal-recebimento/modal-recebimento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { Select } from 'ionic-angular';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBloqueioComponent } from '../form-bloqueio/form-bloqueio';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Component({
  selector: 'modal-chassis-bloqueio',
  templateUrl: 'modal-chassis-bloqueio.html',
})
export class ModalChassisBloqueioComponent {
  @ViewChild('select') select: Select;
  title: string;
  chassis:any;
  novoChassi: string;
  url: string;

  formBloqueioData = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
  };

  bloqueioData = {
    token: '',
    id: '',
    chassi: '',
    notaFiscal: '',
    status: '',
    modelo: '',
    localAtual: '',
    layoutAtual: '',
    bolsaoAtual: '',
    posicaoAtual: '',
    conferido: '',
    conferenciaVeiculo: ''
  };

  modoOperacao: number;

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.title = 'Bloqueio';
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();

    // this.chassis = this.navParam.get('data');


    let evilResponseProps = Object.keys(this.navParam.get('data'));

    console.log(evilResponseProps)

    let goodResponse = [];
    // Step 3. Iterate throw all keys.
    for ( let prop of evilResponseProps) { 
        goodResponse.push(evilResponseProps[prop]);
    }

    console.log(goodResponse)
   
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.select.open();
    }, 150);
  }

  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;
    $('.login-content').css('display', 'block');
  }

  cancelar() {
    this.view.dismiss();
    this.select.close();
    this.navCtrl.push(RecebimentoPage);
  }

  registrarVeiculo() {
    let uriConsultarChassi =
      this.url +
      '/Receber/ConsultarChassi?token=' +
      this.authService.getToken() +
      '&chassi=' +
      this.novoChassi;

    this.formBloqueioData.chassi = this.novoChassi;
    this.formBloqueioData.token = this.authService.getToken();

    this.authService.showLoading();

    this.http.get(uriConsultarChassi).subscribe(
      (res: any) => {
        ;
        if (res.sucesso) {
       //   this.receberVeiculo(res);
        } else {
          if (
            this.modoOperacao == 2 &&
            res.dataErro &&
            res.dataErro === 'CHASSI_NOT_FOUND'
          ) {
          //  this.cadastraVeiculo();
          } else {
            this.authService.hideLoading();
          //  this.openModalErro(res.mensagem);
            this.select.close();
            this.view.dismiss();
          }
        }
      },
      (error) => {
        this.authService.hideLoading();
    //    this.openModalErro(error.mensagem);
        console.log(error.mensagem);
        this.select.close();
        this.view.dismiss();
      }
    );
  }




  bloquearVeiculo() {
    this.openFormBloqueio(this.formBloqueioData);

   // ;
    // let urlCadastrarVeiculo =
    //   this.url +
    //   '/Bloqueio/Bloquear?token=' +
    //   this.authService.getToken() +
    //   '&chassi=' +
    //   this.novoChassi;

    // this.formRecebimentoData.chassi = this.novoChassi;
    // this.formRecebimentoData.token = this.authService.getToken();

    // this.http.post(urlCadastrarVeiculo, {}, httpOptions).subscribe(
    //   (res: any) => {
    //     ;
    //     if (res.sucesso) {
    //       this.authService.hideLoading();
    //       this.select.close();
    //       this.view.dismiss();
    //       this.openModalRecebimento(this.formRecebimentoData);
    //     } else {
    //       this.authService.hideLoading();
    //     //  this.openModalErro(res.mensagem);
    //       console.log(res.mensagem);
    //       this.select.close();
    //       this.view.dismiss();
    //     }
    //   },
    //   (error) => {
    //     this.authService.hideLoading();
    //     //this.openModalErro(error.mensagem);
    //     console.log(error.mensagem);
    //     this.select.close();
    //     this.view.dismiss();
    //   }
    // );
  }

  // cadastraVeiculo() {
  //   ;
  //   let urlCadastrarVeiculo =
  //     this.url +
  //     '/Receber/CadastrarVeiculo?token=' +
  //     this.authService.getToken() +
  //     '&chassi=' +
  //     this.novoChassi;

  //   this.formRecebimentoData.chassi = this.novoChassi;
  //   this.formRecebimentoData.token = this.authService.getToken();

  //   this.http.post(urlCadastrarVeiculo, {}, httpOptions).subscribe(
  //     (res: any) => {
  //       ;
  //       if (res.sucesso) {
  //         this.authService.hideLoading();
  //         this.select.close();
  //         this.view.dismiss();
  //         this.openModalRecebimento(this.formRecebimentoData);
  //       } else {
  //         this.authService.hideLoading();
  //       //  this.openModalErro(res.mensagem);
  //         console.log(res.mensagem);
  //         this.select.close();
  //         this.view.dismiss();
  //       }
  //     },
  //     (error) => {
  //       this.authService.hideLoading();
  //       //this.openModalErro(error.mensagem);
  //       console.log(error.mensagem);
  //       this.select.close();
  //       this.view.dismiss();
  //     }
  //   );
  // }

  // receberVeiculo(responseData: any) {
  //   this.formRecebimentoData.id = responseData.retorno['id'];
  //   let uriReceberVeiculo =
  //     this.url +
  //     '/Receber/ReceberVeiculo?token=' +
  //     this.authService.getToken() +
  //     '&veiculoID=' +
  //     responseData.retorno['id'];
  //   this.http.put(uriReceberVeiculo, {}, httpOptions).subscribe(
  //     (res: any) => {
  //       if (res.sucesso) {
  //         this.authService.hideLoading();
  //         this.select.close();
  //         this.view.dismiss();
  //         this.openModalRecebimento(this.formRecebimentoData);
  //       } else {
  //         this.authService.hideLoading();
  //      //   this.openModalErro(res.mensagem);
  //         this.select.close();
  //         this.view.dismiss();
  //       }
  //     },
  //     (error) => {
  //       this.authService.hideLoading();
  //     //  this.openModalErro(error.mensagem);
  //       this.select.close();
  //       this.view.dismiss();
  //     }
  //   );
  // }


  openFormBloqueio(data) {
    const recModal: Modal = this.modal.create(FormBloqueioComponent, {
      data: data,
    });
    recModal.present();

    recModal.onDidDismiss((data) => {
      console.log(data);
    });
    recModal.onWillDismiss((data) => {
      console.log('data');
      console.log(data);
    });
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();
  }

  // openModalRecebimento(data) {
  //   const recModal: Modal = this.modal.create(ModalRecebimentoComponent, {
  //     data: data,
  //   });
  //   recModal.present();

  //   recModal.onDidDismiss((data) => {
  //     console.log(data);
  //   });
  //   recModal.onWillDismiss((data) => {
  //     console.log('data');
  //     console.log(data);
  //   });
  // }

  closeModal() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.select.close();
    this.view.dismiss(data);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };
}
