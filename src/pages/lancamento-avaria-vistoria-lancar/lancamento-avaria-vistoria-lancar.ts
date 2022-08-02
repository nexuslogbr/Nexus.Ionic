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
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-lancamento-avaria-vistoria-lancar',
  templateUrl: 'lancamento-avaria-vistoria-lancar.html',
})
export class LancamentoAvariaVistoriaLancarPage {
  title: string;
  options: BarcodeScannerOptions;
  url: string;
  responseData: any;
  modoOperacao: number;
  userData = {};
  public tipoVistoria = '';
  public navio: Navio;
  public local = '';
  public nomeArquivo = '';
  public totalRegistros = 0;
  public totalVistoriados = 0;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  public momentos: Array<Momento> = [];
  public veiculos: Array<Veiculo> = [];
  public veiculosLidos: Array<Veiculo> = [];
  public veiculosNaoLidos: Array<Veiculo> = [];

  formData = {
    posicaoAtual: '',
    veiculo: new Veiculo(),
    momento: new Momento(),
    arquivo: new Arquivo(),
    navio: new Navio(),
    veiculos: new Array<Veiculo>()
  };

  @ViewChild('chassiInput') chassiInput;
  formControlAvaria = new FormControl('');
  formLancamentoAvaria: FormGroup;

  slideLeftSelected: boolean = true;
  slideCenterSelected: boolean = false;
  slideRightSelected: boolean = false;

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
    this.userData = this.authService.getUserData();

    // const dados = this.navParam.get("data");

    if (navParam.data.navio != null) {
      this.formData.navio = navParam.data.navio;
      this.local = this.formData.navio.porto.nome;
      this.nomeArquivo = this.formData.navio.nome;
      this.tipoVistoria = 'Navio';

      this.formLancamentoAvaria.patchValue({
        momento: this.formData.arquivo.momentoId
      });
    }

    if (navParam.data.arquivo != null) {
      this.formData.arquivo = navParam.data.arquivo;
      this.local = this.formData.arquivo.local.nome;
      this.nomeArquivo = this.formData.arquivo.nomeOriginal;
      this.tipoVistoria = 'Arquivo';

      this.formLancamentoAvaria.patchValue({
        momento: this.formData.arquivo.momentoId
      });
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

    let id = 0;
    if (this.tipoVistoria == 'Arquivo')
      id = this.formData.arquivo.id;
    else if (this.tipoVistoria = 'Navio')
      id = this.formData.navio.id;

    forkJoin([
      this.arquivoService.listarChassisVistoria(id, this.tipoVistoria),
      this.momentoService.carregarMomentos()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(
      arrayResult => {
        let veiculos$ = arrayResult[0];
        let momentos$ = arrayResult[1];

        if (veiculos$.sucesso) {
          this.veiculos = veiculos$.retorno.veiculosLidos;
          this.veiculosLidos = veiculos$.retorno.veiculosLidos;
          this.veiculosNaoLidos = veiculos$.retorno.veiculosNaoLidos;
          this.formData.veiculos = veiculos$.retorno.veiculosLidos.concat(veiculos$.retorno.veiculosNaoLidos);
          this.totalRegistros = veiculos$.retorno.totalRegistros;
          this.totalVistoriados = veiculos$.retorno.totalVistoriados;
        }

        if (momentos$.sucesso) {
          this.momentos = momentos$.retorno;
        }
      },
      error => {
        console.log('error', error);
      },
      () => {
        this.authService.hideLoading();
      }
    );
  }

  initializeFormControl(){
    this.formLancamentoAvaria = this.formBuilder.group({
      chassi: [this.formData.veiculo.chassi],
      momento: ['', Validators.required]
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

  changeSlideToLeft() {
    this.slideLeftSelected = true;
    this.slideCenterSelected = false;
    this.slideRightSelected = false;
    this.veiculos = this.veiculosLidos;
  }

  changeSlideToCenter() {
    this.slideLeftSelected = false;
    this.slideCenterSelected = true;
    this.slideRightSelected = false;
    this.veiculos = this.veiculosNaoLidos;
  }

  changeSlideToRight() {
    this.slideLeftSelected = false;
    this.slideCenterSelected = false;
    this.slideRightSelected = true;
    this.veiculos = this.veiculosLidos.concat(this.veiculosNaoLidos);
  }

  voltar(){
    this.view.dismiss();
  }

  modalBuscarChassi(){
    this.navCtrl.push(ModalBuscaChassiVistoriaPage, {
      data: this.formData
    });
    this.view.dismiss();
  }
}
