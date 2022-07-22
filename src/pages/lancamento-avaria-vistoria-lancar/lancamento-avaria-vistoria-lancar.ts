import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { MomentoDataService } from '../../providers/momento-data-service';
import { Momento } from '../../model/Momento';
import { ModalSelecionarChassiComponent } from '../../components/modal-selecionar-chassi/modal-selecionar-chassi';
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { LancarAvariaComponent } from '../../components/lancar-avaria/lancar-avaria';
import { Veiculo } from '../../model/veiculo';
import { Navio } from '../../model/navio';
import { Arquivo } from '../../model/arquivo';
import { AlertService } from '../../providers/alert-service';
import { ModalBuscaChassiVistoriaPage } from '../modal-busca-chassi-vistoria/modal-busca-chassi-vistoria';

@Component({
  selector: 'page-lancamento-avaria-vistoria-lancar',
  templateUrl: 'lancamento-avaria-vistoria-lancar.html',
})
export class LancamentoAvariaVistoriaLancarPage {
  scanData: {};
  inputChassi: string = '';
  title: string;
  data: any;
  options: BarcodeScannerOptions;
  token: string;
  chassi: string;
  url: string;
  responseData: any;
  qrCodeText: string;
  modoOperacao: number;
  momentos: Array<Momento> = [];
  userData = {};
  showInfoCar = false;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  formData = {
    posicaoAtual: '',
    veiculo: new Veiculo(),
    momento: new Momento()
  };

  public navio: Navio;
  public arquivo: Arquivo;
  public local = '';
  public nomeArquivo = '';

  @ViewChild('chassiInput') chassiInput;
  formControlAvaria = new FormControl('');
  formLancamentoAvaria: FormGroup;

  constructor(
    public modalCtrl: ModalController,
    private modal: ModalController,
    public navCtrl: NavController,
    public storage: Storage,
    public authService: AuthService,
    private momentoService: MomentoDataService,
    private view: ViewController,
    private navParam: NavParams,
    public alertService: AlertService,
    private formBuilder: FormBuilder
  )
  {
    this.title = 'Vistoriar Chassi';
    this.url = this.authService.getUrl();
    this.initializeFormControl();

    this.modoOperacao = this.authService.getLocalModoOperacao();
    this.userData = this.authService.getUserData()

    var model = (this.navParam.get('data'));
    if (model) {
      this.formData.veiculo = model;
      this.formData.posicaoAtual = model.posicaoAtual;
      this.formData.momento.id = model.momentoID;
      this.showInfoCar = true;
    }

    if (navParam.data.navio != null) {
      this.navio = navParam.data.navio;
    }

    if (navParam.data.arquivo != null) {
      this.arquivo = navParam.data.arquivo;
      this.local = this.arquivo.local.nome;
      this.nomeArquivo = this.arquivo.nomeOriginal;
    }

    if (localStorage.getItem('tema') == "Cinza" || !localStorage.getItem('tema')) {
      this.primaryColor = '#595959';
      this.secondaryColor = '#484848';
      this.inputColor = '#595959';
      this.buttonColor = "#595959";
    }
    else {
      this.primaryColor = '#06273f';
      this.secondaryColor = '#00141b';
      this.inputColor = '#06273f';
      this.buttonColor = "#1c6381";
    }
  }

  ionViewWillEnter() {
    this.authService.showLoading();
    this.loadMomentos();
  }

  initializeFormControl(){
    this.formLancamentoAvaria = this.formBuilder.group({
      chassi: [this.formData.veiculo.chassi, Validators.required],
      momento: ['', Validators.required]
    });
  }

  loadMomentos(){
    this.formLancamentoAvaria.patchValue({
      chassi: this.formData.veiculo.chassi,
      momento: this.formData.momento.id
    });
    this.momentoService.carregarMomentos().subscribe(result => {
      this.momentos = result.retorno;
      this.authService.hideLoading();
    });
  }

  modalBuscarChassi(){
    this.navCtrl.push(ModalBuscaChassiVistoriaPage, {
      data: this.formData
    });
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  onMomentoChange(event){
    this.formData.momento.id = event;
  }

  voltar(){
    this.view.dismiss();
    // this.navCtrl.push(QualidadeMenuPage);
  }

  openModalSelecionarSuperficie(){
    const modal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage, {
      data: this.formData,
    });
    modal.present();
  }

}
