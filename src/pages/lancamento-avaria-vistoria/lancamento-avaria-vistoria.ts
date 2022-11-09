import { Component } from '@angular/core';
import { Modal, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { Veiculo } from '../../model/veiculo';
import { Momento } from '../../model/momento';
import { LancamentoAvariaGmSelecaoPage } from '../lancamento-avaria-gm-selecao/lancamento-avaria-gm-selecao';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Company } from '../../model/GeneralMotors/Company';
import { Place } from '../../model/GeneralMotors/place';
import { Ship } from '../../model/GeneralMotors/ship';
import { Trip } from '../../model/GeneralMotors/trip';
@Component({
  selector: 'page-lancamento-avaria-vistoria',
  templateUrl: 'lancamento-avaria-vistoria.html',
})
export class LancamentoAvariaVistoriaPage {
  title: string;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  formData = {
    number: 0,
    parte: '',
    company: new Company(),
    place: new Place(),
    checkpoint: new Checkpoint(),
    companyOrigin: new Company(),
    companyDestination: new Company(),
    ship: new Ship(),
    trip: new Trip(),
  };

  public form: FormGroup

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    public alertService: AlertService,
    public authService: AuthService,
    private modal: ModalController,
    private view: ViewController,
    private formBuilder: FormBuilder,
  ) {
    this.title = 'Selecione a área';

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
    let data = this.navParams.get('data');

    this.initializeFormControl();

  }

  initializeFormControl(){
    this.form = this.formBuilder.group({
      capo: [null],
      parachoquefrente: [null],
      parachoquetras: [null],
      portamalas: [null],
      lateralfrente: [null],
      lateralmeio: [null],
      lateraltras: [null],
      teto: [null],
    });
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  selectImage(event:any){
    if (event == 1) {
      this.formData.parte = 'Dianteira';
      this.formData.number = 1;
    }
    else if (event == 2) {
      this.formData.parte = 'Dianteira';
      this.formData.number = 2;
    }
    else if (event == 3) {
      this.formData.parte = 'Traseira';
      this.formData.number = 3;
    }
    else if (event == 4) {
      this.formData.parte = 'Traseira';
      this.formData.number = 4;
    }
    else if (event == 5) {
      this.formData.parte = 'Laterais';
      this.formData.number = 5;
    }
    else if (event == 6) {
      this.formData.parte = 'Laterais';
      this.formData.number = 6;
    }
    else if (event == 7) {
      this.formData.parte = 'Laterais';
      this.formData.number = 7;
    }
    else if (event == 8) {
      this.formData.parte = 'Teto';
      this.formData.number = 8;
    }

    const modal: Modal = this.modal.create(LancamentoAvariaGmSelecaoPage, {
      data: this.formData,
    });
    modal.present();


  }

  return(){
    this.view.dismiss();
  }
}
