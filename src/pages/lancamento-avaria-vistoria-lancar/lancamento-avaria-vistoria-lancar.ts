import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { MomentoDataService } from '../../providers/momento-data-service';
import { Momento } from '../../model/Momento';
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { Veiculo } from '../../model/veiculo';
import { Navio } from '../../model/navio';
import { Arquivo } from '../../model/arquivo';
import { AlertService } from '../../providers/alert-service';
import { ModalBuscaChassiVistoriaPage } from '../modal-busca-chassi-vistoria/modal-busca-chassi-vistoria';
import { ArquivoDataService } from '../../providers/arquivo-data-service';
import { DataRetorno } from '../../model/dataretorno';

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
  public veiculos: Array<Veiculo> = [];
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
    private formBuilder: FormBuilder,
    private arquivoService: ArquivoDataService
  )
  {
    this.title = 'Vistoriar Chassi';
    this.url = this.authService.getUrl();
    this.initializeFormControl();

    this.modoOperacao = this.authService.getLocalModoOperacao();
    this.userData = this.authService.getUserData()

    if (navParam.data.navio != null) {
      this.navio = navParam.data.navio;
    }

    if (navParam.data.data != null) {
      this.arquivo = navParam.data.data;
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
    this.loadChassisVistoria();
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

  loadChassisVistoria(){
    this.arquivoService.listarChassisVistoria(this.arquivo.id).subscribe((result:DataRetorno) => {
      console.log(result.retorno);
      this.veiculos = result.retorno;
      this.loadMomentos();
    });
  }

  modalBuscarChassi(){
    this.navCtrl.push(ModalBuscaChassiVistoriaPage, {
      data: this.formData
    });
    this.view.dismiss();
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
