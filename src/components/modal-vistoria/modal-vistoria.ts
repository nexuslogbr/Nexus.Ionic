import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'modal-vistoria',
  templateUrl: 'modal-vistoria.html'
})
export class ModalVistoriaComponent {

  formData: any;
  responseData: any;
  layouts: any;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  constructor(
    private http: HttpClient,
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
    this.navCtrl.push(HomePage);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  vistoriar() {
    this.view.dismiss(this.formData);
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();
    chassiModal.onDidDismiss((data) => { });
    chassiModal.onWillDismiss((data) => {});
  }
}
