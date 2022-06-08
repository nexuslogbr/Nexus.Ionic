import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalLancamentoAvariaComponent } from '../../components/modal-lancamento-avaria/modal-lancamento-avaria';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { MomentoDataService } from '../../providers/momento-data-service';
import { Momento } from '../../model/Momento';
import { ModalBuscaChassiComponent } from '../modal-busca-chassi/modal-busca-chassi';
import { ModalSelecionarChassiComponent } from '../../components/modal-selecionar-chassi/modal-selecionar-chassi';
import { LancamentoAvariaSelecaoSuperficiePage } from '../lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { LancarAvariaComponent } from '../../components/lancar-avaria/lancar-avaria';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';

@Component({
  selector: 'page-lancamento-avaria',
  templateUrl: 'lancamento-avaria.html'
})
export class LancamentoAvariaPage {
  scanData: {};
  inputChassi: string = '';
  carData: any;
  responseCarData: any;
  ligado: boolean;
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

  formControlChassi = new FormControl('');

  erroData = {
    messageTitle: '',
    message: '',
  };

  formData = {
    chassi: '',
    modelo: '',
    posicaoAtual: '',
    cor: '',
    observacao: '',
    momento: ''
  };

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
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: '',
  };

  @ViewChild('chassiInput') chassiInput;
  formControlAvaria = new FormControl('');
  formLancamentoAvaria: FormGroup;

  constructor(
    private http: HttpClient,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private modal: ModalController,
    public navCtrl: NavController,
    public storage: Storage,
    public authService: AuthService,
    private momentoService: MomentoDataService,
    private view: ViewController,
    private navParam: NavParams,
    private formBuilder: FormBuilder
  )
  {
    this.title = 'Lançamento de Avaria';
    this.url = this.authService.getUrl();
    this.initializeFormControl();

    this.modoOperacao = this.authService.getLocalModoOperacao();
    this.userData = this.authService.getUserData()

    var chassi_ = (this.navParam.get('data'));
    if (chassi_) {
      this.formData = chassi_;
      this.showInfoCar = true;
    }

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

    this.formControlAvaria.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, '');
            setTimeout(() => {
              this.buscarChassi(chassi, false);
              this.formData.chassi = '';
            }, 500);
          }
        }
      }
    });
  }

  ionViewDidEnter() {
    this.loadMomentos();
    setTimeout(() => {
      // this.chassiInput.setFocus();
     }, 1000);
  }

  initializeFormControl(){
    this.formLancamentoAvaria = this.formBuilder.group({
      chassi: [this.formData.chassi, Validators.required],
      momento: ['', Validators.required]
      // observacao: [''],
    });
  }

  loadMomentos(){
    this.formLancamentoAvaria.patchValue({
      chassi: this.formData.chassi,
      momento: this.formData.momento
    });
    this.authService.showLoading();
    this.momentoService.carregarMomentos().subscribe(result => {
      this.momentos = result.retorno;
      this.authService.hideLoading();
    });
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        this.chassiInput.setFocus();
      }, 1000);
    }
    this.formData.chassi = '';
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };


    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then(
      (barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(
            this.qrCodeText.length - 17,
            17
          );
         // this.openModalErro(partChassi, true);
          this.formData['chassi'] = partChassi;
          this.buscarChassi(partChassi, true);
        }
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data, true);
      }
    );
  }

  scanInput(){
    this.authService.showLoading();
    this.buscarChassi(this.formLancamentoAvaria.controls.chassi.value, true);
  }

  buscarChassi(partChassi, byScanner: boolean) {

    this.formBloqueioData.chassi = partChassi;
    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;

    this.authService.showLoading();
    this.formBloqueioData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {

        this.responseData = res;
        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.openModalLancamentoAvaria(this.responseData.retorno, byScanner);
        }
        else {
          this.authService.hideLoading();
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
          else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.responseData.mensagem, byScanner);
          }
          else if (
            this.modoOperacao == 2 &&
            this.responseData.dataErro == 'CHASSI_NOT_FOUND'
          ) {
            this.openModalLancamentoAvaria([partChassi], byScanner);
          }
          else {
           this.openModalErro(this.responseData.mensagem, byScanner);
          }
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText, byScanner);
      }
    );
  }

  modalBuscarChassi(){
    const chassiModal: Modal = this.modal.create(ModalBuscaChassiComponent, {
      data: this.formData
    });
    chassiModal.present();

    // chassiModal.onDidDismiss((data) => {
    //   this.cleanInput(true);
    // });
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


  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data,
    });
    chassiModal.present();
    chassiModal.onDidDismiss((data) => {
     // this.view.dismiss(data);
      this.navCtrl.push(HomePage);
    });
  }

  // openModalRecebimento(data, byScanner: boolean) {
  //   ;
  //   const recModal: Modal = this.modal.create(ModalRecebimentoComponent, {
  //     data: data,
  //   });
  //   recModal.present();

  //   recModal.onDidDismiss((data) => {
  //     this.cleanInput(byScanner);
  //   });
  // }

  openLancarChassisAvaria(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(LancarAvariaComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  openModalLancamentoAvaria(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalSelecionarChassiComponent, {
        data: data,
      });
      chassiModal.present();

      chassiModal.onDidDismiss((data) => {
        this.cleanInput(byScanner);
      });
  }

  onMomentoChange(event){
    this.formData.observacao = event;
  }

  voltar(){
    // this.view.dismiss();
    this.navCtrl.push(QualidadeMenuPage);
  }

  openModalSelecionarSuperficie(){
    const modal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage, {
      data: this.formData,
    });
    modal.present();

    modal.onDidDismiss(data => {});
    modal.onWillDismiss(data => {});
  }
}
