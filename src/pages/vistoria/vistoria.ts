import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NavController, ModalController, ViewController, NavParams, Modal } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from '../../providers/alert-service';
import { ModalBuscaChassiComponent } from '../modal-busca-chassi/modal-busca-chassi';

@Component({
  selector: 'page-vistoria',
  templateUrl: 'vistoria.html',
})
export class VistoriaPage {

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  title: string;
  url: string;

  formControl = new FormControl("");
  public form: FormGroup

  formData = {
    id: null,
    token: "",
    skip: 0,
    take: 10,
    localID: 0,
    veiculoID: 0,
    chassi: "",
  };

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    private formBuilber: FormBuilder,
    private view: ViewController,
    public alertService: AlertService,
    private navParam: NavParams
  ) {
    this.title = 'Vistoria';
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
    // this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
    //   if (value && value.length) {
    //     {
    //       if (value.length >= 6) {
    //         let chassi = value.replace(/[\W_]+/g, '');
    //         setTimeout(() => {
    //           this.buscarChassi(chassi, false);
    //           this.formData.chassi = '';
    //         }, 500);
    //       }
    //     }
    //   }
    // });
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  modalBuscarChassi(){
    this.navCtrl.pop();
    this.formData.chassi = '';
    const chassiModal: Modal = this.modal.create(ModalBuscaChassiComponent, {
      data: this.formData
    });
    chassiModal.present();
  }

}
