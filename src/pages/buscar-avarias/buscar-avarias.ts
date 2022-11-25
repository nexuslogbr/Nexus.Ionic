import { Component, ViewChild } from "@angular/core";
import { NavController, Modal, ModalController, ViewController, NavParams } from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { Select } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import * as $ from "jquery";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { ListarAvariasPage } from "../listar-avarias/listar-avarias";
import { Usuario } from "../../model/usuario";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ModalSelecionarChassiBuscaComponent } from "../../components/modal-selecionar-chassi-busca/modal-selecionar-chassi-busca";
import { AlertService } from "../../providers/alert-service";
import { ModalBuscaChassiComponent } from "../modal-busca-chassi/modal-busca-chassi";
import { ParteDataService } from "../../providers/parte-data-service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { ModeloDataService } from "../../providers/modelo-data-service";
import { AvariaDataService } from "../../providers/avaria-data-service";
import { NivelAvariaDataService } from "../../providers/nivel-avaria-data-service";
import { finalize } from "rxjs/operators";

@Component({
  selector: "page-buscar-avarias",
  templateUrl: "buscar-avarias.html",
})
export class BuscarAvariasPage {
  @ViewChild('chassiInput') chassiInput;
  @ViewChild('select') select: Select;

  title: string;
  url: string;
  partes: any;
  modelos: any;
  tipoAvarias: any;
  nivelAvarias: any;
  modoOperacao: number;
  showModal: Boolean = false;

  formData = {
    id: null,
    "token": "",
    "skip": 0,
    "take": 10,
    "localID": 0,
    "veiculoID": 0,
    "chassi": "",
    "data": "",
    "parteAvariadaID": 0,
    "modelo": "",
    "tipoAvariaID": 0,
    "gravidadeID": 0,
    buscaAvaria: false
  };

  userData: Usuario;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  qrCodeText: string;
  options: BarcodeScannerOptions;
  car: any;
  public search = true;

  filtro = '';
  filtroValor = '';

  formControlChassi = new FormControl("");
  public form: FormGroup

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    private formBuilber: FormBuilder,
    private view: ViewController,
    public alertService: AlertService,
    private navParam: NavParams,
    private parteService: ParteDataService,
    private modeloService: ModeloDataService,
    private avariaService: AvariaDataService,
    private nivelAvariaService: NivelAvariaDataService
  ) {
    this.title = "BUSCAR AVARIAS";
    this.url = this.authService.getUrl();
    this.userData = this.authService.getUserData();

    var model = this.navParam.get('data');
    if (model) {
      this.formData =  model
    }
    this.loadForm();

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

    this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        if (value.length >= 6) {
          let chassi = value.replace(/[\W_]+/g, '');
          setTimeout(() => {
            this.buscarChassi(chassi, false);
          }, 500);
        }
      }
    });
  }

  ionViewWillEnter() {
    this.authService.showLoading();
    this.formData.localID = this.userData.localModoOperacao;
    this.loadList();
  }

  loadForm(){
    this.form = this.formBuilber.group({
      chassi: [''],
      data: [''],
      parte: [0],
      modelo: [''],
      tipoAvaria: [0],
      nivelAvaria: [0],
    });

  }

  loadList(){
    this.authService.showLoading();

    forkJoin([
      this.parteService.listar(),
      this.modeloService.listar(),
      this.avariaService.carregarTipoAvarias(),
      this.nivelAvariaService.listar()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let partes$ = arrayResult[0];
      let modelos$ = arrayResult[1];
      let tipoAvarias$ = arrayResult[2];
      let nivelAvarias$ = arrayResult[3];

      if (partes$.sucesso)
        this.partes = partes$.retorno;
      else
        this.openModalErro("Erro ao carregar as partes, volte ao menu e tente novamente!");

      if (modelos$.sucesso)
        this.modelos = modelos$.retorno;
      else
        this.openModalErro("Erro ao carregar os modelos, volte ao menu e tente novamente!");

      if (tipoAvarias$.sucesso)
        this.tipoAvarias = tipoAvarias$.retorno;
      else
        this.openModalErro("Erro ao carregar os tipos de avaria, volte ao menu e tente novamente!");

      if (nivelAvarias$.sucesso)
        this.nivelAvarias = nivelAvarias$.retorno;
      else
        this.openModalErro("Erro ao carregar os níveis de avaria, volte ao menu e tente novamente!");

    }, error => {
      this.openModalErro(error.mensagem);
    })
  }

  avancar(onDismiss?: Function) {
    if (this.validaCampos()) {

      let model = {
        veiculoID: this.formData.id == null ? 0 : this.formData.id,
        chassi:  this.formData.chassi,
        data:  this.form.controls.data.value,
        parteAvariadaID:  this.form.controls.parte.value,
        modelo:  this.form.controls.modelo.value,
        tipoAvariaID:  this.form.controls.tipoAvaria.value,
        gravidadeID:  this.form.controls.nivelAvaria.value,
        filtro: this.filtro,
        filtroValor: this.filtroValor
      }

      this.navCtrl.push(ListarAvariasPage, model);
      this.form.reset();
    }
    else {
      this.alertService.showAlert('Sem dados para busca');
    }
  }

  validaCampos() {
    let valido = false;

    if (this.form.controls.data.value){
      var data = this.form.controls.data.value;

      this.filtro = 'Data:';
      this.filtroValor = data.replace(/-/g,'/');
      valido = true;
    }
    if (this.form.controls.chassi.value){
      this.filtro = 'Chassi:';
      this.filtroValor = this.form.controls.chassi.value;
      valido = true;
    }
    if (this.form.controls.parte.value){
      this.filtro = 'Parte:';
      this.filtroValor = this.form.controls.parte.value;
      valido = true;
    }
    if (this.form.controls.modelo.value){
      this.filtro = 'Modelo:';
      this.filtroValor = this.form.controls.modelo.value;
      valido = true;
    }
    if (this.form.controls.tipoAvaria.value){
      this.filtro = 'Tipo Avaria:';
      this.filtroValor = this.form.controls.tipoAvaria.value;
      valido = true;
    }
    if (this.form.controls.nivelAvaria.value){
      this.filtro = 'Nível Avaria:';
      this.filtroValor = this.form.controls.nivelAvaria.value;
      valido = true;
    }
    // if (this.form.controls.data.value || this.form.controls.parte.value || this.form.controls.modelo.value || this.form.controls.tipoAvaria.value || this.form.controls.nivelAvaria.value)
    //   return true;

    return valido;
  }

  modalBuscarChassi(){
    this.formData.buscaAvaria = true;
    this.navCtrl.pop();
    this.formData.chassi = '';
    const chassiModal: Modal = this.modal.create(ModalBuscaChassiComponent, {
      data: this.formData
    });
    chassiModal.present();
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };

    this.authService.showLoading();
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(this.qrCodeText.length - 17, 17);
          this.formData['chassi'] = partChassi;
          this.buscarChassi(partChassi, true);
        }
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data);
      }
    );
  }

  buscarChassi(partChassi, byScanner: boolean) {
    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;
    this.formData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {
        this.car = res;
        if (this.car.sucesso) {
          this.formData['chassi']  = partChassi;
          this.openModal(this.car.retorno);
          this.authService.hideLoading();
        }
        else {
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.car.mensagem);
            this.authService.hideLoading();
          }
          else if (this.car.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.car.mensagem);
            this.authService.hideLoading();
          }
          else if (
            this.modoOperacao == 2 &&
            this.car.dataErro == 'CHASSI_NOT_FOUND'
          ) {
            // this.openModalLancamentoAvaria([partChassi], byScanner);
          }
          else {
            this.openModalErro(this.car.mensagem);
            this.authService.hideLoading();
          }
        }
      },
      (error) => {
        this.openModalErro(error.status + ' - ' + error.statusText);
        this.authService.hideLoading();
      }
    );
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput();
    });
  }

  cleanInput() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
    this.formData.chassi = '';
  }

  navigateToHomePage() {
    this.navCtrl.pop();
    // this.view.dismiss();
    // this.navCtrl.push(QualidadeMenuPage);
  }

  openModal(data) {
    const modal: Modal = this.modal.create(ModalSelecionarChassiBuscaComponent, {
      data: data,
    });
    modal.present();

    modal.onDidDismiss(() => {
      this.cleanInput();
    });
  }
}
