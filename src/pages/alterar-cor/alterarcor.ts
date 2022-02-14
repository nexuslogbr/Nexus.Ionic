import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@ionic-native/barcode-scanner';
import { NavController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalRecebimentoComponent } from '../../components/modal-recebimento/modal-recebimento';
import { ModalChassisComponent } from '../../components/modal-chassis/modal-chassis';
import { ParqueamentoPage } from '../parqueamento/parqueamento';
import { RomaneioPage } from '../romaneio/romaneio';
import { MovimentacaoPage } from '../movimentacao/movimentacao';
import { HomePage } from '../home/home';
import { ReceberParquearPage } from '../receber-parquear/receber-parquear';
import { CarregamentoExportPage } from '../carregamento-export/carregamento-export';
import { CarregamentoPage } from '../carregamento/carregamento';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ModalChassisBloqueioComponent } from '../../components/modal-chassis-bloqueio/modal-chassis-bloqueio';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';

@Component({
  selector: 'page-alterarcor',
  templateUrl: 'alterarcor.html',
})
export class AlterarCorPage {
  title: string;
  scanData: {};
  data: any;
  inputChassi: string = '';

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;


  @ViewChild('chassiInput') chassiInput;

  formControlChassi = new FormControl('');

  constructor(
    private http: HttpClient,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    public navCtrl: NavController,
    public storage: Storage,
    public authService: AuthService,
    private elementRef: ElementRef
  ) {
    this.title = 'Alterar Cor Aplicativo';
    this.primaryColor = '#595959';
    this.secondaryColor = '#484848';
    this.inputColor = '#595959';
    this.buttonColor = '#595959';

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
    this.authService.hideLoading();
  }

  cleanInput(byScanner: boolean) {
  }

  changeToBlue() {
    this.primaryColor = '#06273f';
    this.secondaryColor = '#00141b';
    this.inputColor = '#06273f';
    this.buttonColor = "#1c6381";

    localStorage.setItem('tema', 'Azul');
  }

  changeToGray() {
    this.primaryColor = '#595959';
    this.secondaryColor = '#484848';
    this.inputColor = '#595959';
    this.buttonColor = "#595959";

    localStorage.setItem('tema', 'Cinza');
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };


}
