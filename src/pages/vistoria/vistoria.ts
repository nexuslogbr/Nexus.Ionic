import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NavController, ModalController, ViewController, NavParams, Modal } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../providers/alert-service';
import { ModalBuscaChassiComponent } from '../modal-busca-chassi/modal-busca-chassi';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HomePage } from '../home/home';
import { VistoriaCheckpointDataService } from '../../providers/vistoria-checkpoint-service';
import { Momento } from '../../model/Momento';
import { MomentoDataService } from '../../providers/momento-data-service';
import { StakeholderService } from '../../providers/stakeholder-data-service';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { StakeHolder } from '../../model/stakeholder';
import { ModalChassisVistoriaComponent } from '../../components/modal-chassis-vistoria/modal-chassis-vistoria';

@Component({
  selector: 'page-vistoria',
  templateUrl: 'vistoria.html',
})
export class VistoriaPage {

  responseData: any;
  user: any;
  local: string;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  title: string;
  url: string;
  showErrorMessage: boolean = false;

  public form: FormGroup

  momentos: Momento[] = [];
  stakeholders: StakeHolder[] = [];

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
    private checkpointService: VistoriaCheckpointDataService,
    private momentoService: MomentoDataService,
    private stakeholderService: StakeholderService,
    private formBuilder: FormBuilder
  ) {
    this.title = 'Vistoria';
    this.url = this.authService.getUrl();
    this.user = this.authService.getUserData();
    this.local = this.authService.getUserData().localNome;

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

    this.initializeFormControl();
  }

  ionViewWillEnter(){
    this.authService.showLoading();

    forkJoin([
      this.momentoService.listar(),
      this.stakeholderService.listar()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let momentos$ = arrayResult[0];
      let stakeholders$ = arrayResult[1];

      if (momentos$.sucesso && stakeholders$.sucesso) {
        this.momentos = momentos$.retorno;
        this.stakeholders = stakeholders$.retorno;
      }
      else {
      this.showErrorMessage = true;
      }
    },
    error => {
      this.showErrorMessage = true;
    },
    () => {
      this.authService.hideLoading();
    });
  }

  initializeFormControl(){
    this.form = this.formBuilder.group({
      empresa: ['Nexus', Validators.required],
      local: [this.local, Validators.required],
      momento: [null, Validators.required],
      stakeholderOrigem: [null, Validators.required],
      stakeholderDestino: [null, Validators.required]
    });
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
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

  openModalErro(data, byScanner: boolean) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.cleanInput(byScanner);
    });
  }

  cleanInput(byScanner: boolean) {
    // if (!byScanner) {
    //   setTimeout(() => {
    //     this.chassiInput.setFocus();
    //   }, 1000);
    // }
    // this.formData.veiculo.chassi = '';
  }

  voltar(){
    this.view.dismiss();
  }

  toNavigate(){
    this.navCtrl.push(ModalChassisVistoriaComponent, {
      data: this.form.controls
    });
  }
}
