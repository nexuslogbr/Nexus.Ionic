import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from '../../model/veiculo';
import { CheckpointDataService } from '../../providers/checkpoint-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators/finalize';
import { DataRetorno } from '../../model/dataretorno';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { VeiculoDataService } from '../../providers/veiculo-data-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Checklist } from '../../model/checklist';
import { LancamentoAvariaVistoriaPage } from '../../pages/lancamento-avaria-vistoria/lancamento-avaria-vistoria';
import { Momento } from '../../model/Momento';
import { Local } from '../../model/local';
import { StakeHolder } from '../../model/stakeholder';
import { Observable } from 'rxjs/Observable';
import { enumVeiculoStatus } from '../../providers/enumerables/enum';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Place } from '../../model/GeneralMotors/place';
import { Company } from '../../model/GeneralMotors/company';
import { Ship } from '../../model/GeneralMotors/ship';
import { Trip } from '../../model/GeneralMotors/trip';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { LancamentoAvariaSelecaoSuperficiePage } from '../../pages/lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { Surveyor } from '../../model/GeneralMotors/surveyor';
import { GeneralMotorsDataService } from '../../providers/general-motors-data-service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'modal-chassis-vistoria-gm',
  templateUrl: 'modal-chassis-vistoria-gm.html'
})
export class ModalChassisVistoriaGmComponent {
  title: string;
  url: string;
  formControl = new FormControl("");
  public form: FormGroup
  @ViewChild('chassiInput') chassiInput;
  chassi = '';
  options: BarcodeScannerOptions;
  qrCodeText: string;

  formData = {
    veiculo: new Veiculo(),
    company: new Company(),
    place: new Place(),
    checkpoint: new Checkpoint(),
    trip: new Trip(),
    ship: new Ship(),
    surveyor: new Surveyor(),
    companyOrigin: new Company(),
    companyDestination: new Company()
  };

  modoOperacao: number;
  responseData:any;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  checklists: Array<Checklist> = [];
  veiculo: Veiculo;
  retorno: DataRetorno;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public alertService: AlertService,
    public modalController: ModalController,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private gmService: GeneralMotorsDataService,
    private vistoriaService: VistoriaDataService
  ) {
    this.title = 'Vistoria';
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();

    let data = this.navParam.get('data');
    this.formData = data;

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

    this.formControl.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, '');
            setTimeout(() => {
              this.buscarChassi(chassi);
            }, 500);
          }
        }
      }
    });

    this.initializeFormControl();
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
  }

  initializeFormControl(){
    this.form = this.formBuilder.group({
      empresa: [this.formData.company.companyName],
      local: [this.formData.place.localDescription],
      momento: [this.formData.checkpoint.checkpointDescription],
      stakeholderOrigem: [this.formData.companyOrigin.companyName],
      stakeholderDestino: [this.formData.companyDestination.companyName],
    });
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

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
          this.buscarChassi(partChassi);
        }
      },
      (err) => {
        this.authService.hideLoading();
        this.alertService.showError('Erro de qr code!');
      }
    );
  }

  buscarChassi(chassi: string) {
    if (this.form.valid) {
      this.authService.showLoading();

      forkJoin([
        this.vistoriaService.consultarChassi(chassi)
      ])
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
          this.chassi = '';
        })
      )
      .subscribe(arrayResult => {
        let veiculo$ = arrayResult[0];

        if (veiculo$.sucesso) {
          this.veiculo = veiculo$.retorno;
          this.formData.veiculo = veiculo$.retorno;
        }
        else {
          this.veiculo = null;
          this.authService.hideLoading();
          this.alertService.showError(veiculo$.mensagem);
        }
      },
      (error) => {
        this.alertService.showError(error.status + ' - ' + error.statusText);
      });
    }
    else {
      this.alertService.showAlert('Erro!');
    }
  }

  semAvaria() {
    this.authService.showLoading();
    let date = new Date();
    let dateNow = date.getUTCDay() + date.getUTCMonth() + date.getUTCFullYear() + date.getUTCHours() + date.getUTCMinutes() + date.getUTCSeconds()

    let model  = {
      local: this.formData.place.local,
      origin: this.formData.companyOrigin.id,
      destination: this.formData.companyDestination.id,
      checkpoint: this.formData.checkpoint.checkpoint,
      TripId: this.formData.trip.id,
      ShipId: this.formData.ship.id,
      vin: this.veiculo.chassi,

      surveyor: this.formData.surveyor.id,
      surveyDate: dateNow,
      // surveyDate: new Date().toISOString(),
      validator: this.formData.surveyor.id,
      validationDate: dateNow,
      // validationDate: new Date().toISOString(),

      hasDamages: false,
      hasDocuments: false,
      released: 1,
      damages: [],
      documents: []
    };

    forkJoin([
      this.gmService.insertsurvey(model)
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
        this.veiculo = null;
      })
    )
    .subscribe(arrayResult => {
      let vistoria$ = arrayResult[0];

      if (vistoria$.sucesso) {
        this.alertService.showInfo('Vistoriado com sucesso!');
      }
      else if (!vistoria$.sucesso) {
        this.alertService.showError(vistoria$.mensagem);
      }
    }, error => {
      this.alertService.showError(error);
    })
  }

  comAvaria(){
    const chassiModal: Modal = this.modal.create(LancamentoAvariaVistoriaPage,
      {
        data: this.formData
      });

    this.veiculo = null;
    chassiModal.present();
  }

  close() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.view.dismiss(data);
  }
}
