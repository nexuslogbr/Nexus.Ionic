import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as $ from 'jquery';
import { Veiculo } from '../../model/veiculo';
import { Momento } from '../../model/Momento';
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { LancamentoAvariaVistoriaLancarPage } from '../lancamento-avaria-vistoria-lancar/lancamento-avaria-vistoria-lancar';
import { Arquivo } from '../../model/arquivo';
import { Navio } from '../../model/navio';

@Component({
  selector: 'page-model-lancar-avaria',
  templateUrl: 'model-lancar-avaria.html',
})
export class ModelLancarAvariaPage {

  formData = {
    veiculo: new Veiculo(),
    momento: new Momento(),
    arquivo: new Arquivo(),
    navio: new Navio(),
    veiculos: new Array<Veiculo>()
  };

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  constructor(
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
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

  ionViewWillLoad() {
    const data = this.navParam.get('data');
    this.formData = data;
  }

  closeModal() {
    var modal: Modal;

    if (this.formData.arquivo.id) {
      this.formData.arquivo.momentoId = this.formData.momento.id;
      this.formData.momento.id = this.formData.momento.id;
      modal = this.modal.create(LancamentoAvariaVistoriaLancarPage, {
        arquivo: this.formData.arquivo,
      });
    }
    else if (this.formData.navio.id) {
      this.formData.navio.momentoId = this.formData.momento.id;
      this.formData.momento.id = this.formData.momento.id;
      modal = this.modal.create(LancamentoAvariaVistoriaLancarPage, {
        navio: this.formData.navio,
      });
    }


    modal.present();
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.view.dismiss(data);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  openPage() {
    const modal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage, {
      data: this.formData,
    });
    modal.present();


    modal.onDidDismiss((data) => {
      console.log(data);
    });
    modal.onWillDismiss((data) => {
      console.log(data);
    });
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
