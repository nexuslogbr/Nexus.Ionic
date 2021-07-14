import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController, Select } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { FormParqueamentoComponent } from '../../components/form-parqueamento/form-parqueamento';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'modal-chassi-parqueamento',
  templateUrl: 'modal-chassi-parqueamento.html'
})
export class ModalChassiParqueamentoComponent {
  @ViewChild('select1') select1: Select;

  title: string;
  chassis: any;
  novoChassi: string;
  private url: string;
  private url2: string;
  responseData2: any;
  responseData: any;
  responseCarData: any;
  formParqueamentoData = {
    "token":"",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":''
  };
  recebimentoData = {
    "token":"",
    "empresaID": "1",
    "id": '',
    "chassi": '',
    "local": '',
    "layout": '',
    "bolsao": '',
    "fila": '',
    "posicao":''
  };

  constructor(public http: HttpClient, private modal: ModalController, private navParam: NavParams, private view: ViewController, public navCtrl: NavController, public authService: AuthService) {

    this.title = 'Parqueamento';

    console.log('ModalChassiParqueamentoComponent');

    this.url = this.authService.getUrl();
  }

  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.chassis = data;
  }
  ionViewDidEnter(){
    setTimeout(() => {
      this.select1.open();
    },150);

  }
  onChassisChange(selectedValue) {
    this.novoChassi = selectedValue;
    $('.login-content').css('display','block');
  }
  cancelar(){
    this.view.dismiss();
    this.select1.close();
    this.navCtrl.push(ParqueamentoPage);
  }
  ConsultarChassi(){
    this.view.dismiss();
    this.select1.close();

    let consultarChassi = this.url+"/Parquear/ConsultarChassi?token="+ this.authService.getToken() +"&chassi="+this.novoChassi;
    this.formParqueamentoData.chassi = this.novoChassi;

    this.authService.showLoading();

    this.formParqueamentoData.token = this.authService.getToken();
    this.formParqueamentoData.local = this.authService.getLocalAtual();

    this.http.get( consultarChassi )
    .subscribe(res => {

      this.responseData = res;

      if(this.responseData.sucesso){

        this.formParqueamentoData.id = this.responseData.retorno['id'];

        let listarLayouts = this.url+"/Parquear/ListarLayouts?token="+ this.authService.getToken();

        this.http.get( listarLayouts )
        .subscribe(data => {

          this.responseData2 = data;
          if(this.responseData2.sucesso){

            //PREENCHER O SELECT DO LAYOUT
            this.formParqueamentoData.layout = this.responseData2.retorno;
            this.authService.hideLoading();

            this.formParqueamentoData.local = this.authService.getLocalAtual();

            const recForm: Modal = this.modal.create(FormParqueamentoComponent, {data: this.formParqueamentoData });
            recForm.present();

            recForm.onDidDismiss((data) => {
              this.select1.close();
              console.log(data);
            })
            recForm.onWillDismiss((data) =>{
              console.log('data');
              console.log(data);
            })

          }else{
            this.authService.hideLoading();
            this.openModalErro(this.responseData.mensagem);
          }

        }, (error) => {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        });

      }else{
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }

    }, (error) => {
      this.authService.hideLoading();
      this.openModalErro(this.responseData.mensagem);
    });
  }
  // openModalRecebimento(data){
  //   this.select1.close();
  //   const recModal: Modal = this.modal.create(ModalRecebimentoComponent, {data: data });
  //   recModal.present();

  //   recModal.onDidDismiss((data) => {
  //     this.select1.close();
  //     this.navCtrl.push(ParqueamentoPage);
  //   })
  //   recModal.onWillDismiss((data) =>{
  //     console.log('data');
  //     console.log(data);
  //   })

  // }
  toggleMenu = function(this){
    this.select1.close();
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  }
  openModalSucesso(data){
    this.select1.close();
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(ParqueamentoPage);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }
  closeModal(){
    this.view.dismiss();
    this.select1.close();
  }
  openModalErro(data){
    this.view.dismiss();
    this.select1.close();
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.navCtrl.push(ParqueamentoPage);
    })
    chassiModal.onWillDismiss((data) =>{
      console.log('data');
      console.log(data);
    })
  }
}
