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
import { CheckpointDataService } from '../../providers/checkpoint-service';
import { Momento } from '../../model/momento';
import { MomentoDataService } from '../../providers/momento-data-service';
import { StakeholderService } from '../../providers/stakeholder-data-service';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { StakeHolder } from '../../model/stakeholder';
import { ModalChassisVistoriaComponent } from '../../components/modal-chassis-vistoria/modal-chassis-vistoria';
import { GeneralMotorsDataService } from '../../providers/general-motors-data-service';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Company } from '../../model/GeneralMotors/Company';
import { Place } from '../../model/GeneralMotors/place';

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

  momentos$: Momento[] = [];
  stakeholders$: StakeHolder[] = [];
  checkpoints$: Checkpoint[] = [];
  companies$: Company[] = [];
  places$: Place[] = [];

  momentos: Momento[] = [];
  stakeholdersOrigem: StakeHolder[] = [];
  stakeholdersDestino: StakeHolder[] = [];
  checkpoints: Checkpoint[] = [];
  checkpointsByPlace: Checkpoint[] = [];
  companies: Company[] = [];
  places: Place[] = [];

  momento = new Momento();
  checkpoint = new Checkpoint();

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
    private checkpointService: CheckpointDataService,
    private momentoService: MomentoDataService,
    private stakeholderService: StakeholderService,
    private formBuilder: FormBuilder,
    private generalMotorsService: GeneralMotorsDataService
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
      this.stakeholderService.listar(),
      this.generalMotorsService.companies(),
      this.generalMotorsService.checkPoints(),
      this.generalMotorsService.places(),
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let momentos$ = arrayResult[0];
      let stakeholders$ = arrayResult[1];
      let companies$ = arrayResult[2];
      let checkpoints$ = arrayResult[3];
      let places$ = arrayResult[4];

      if (companies$.sucesso && checkpoints$.sucesso && places$.sucesso) {
        this.companies$ = companies$.retorno.company;
        this.checkpoints$ = checkpoints$.retorno.checkPoints;
        this.places$ = places$.retorno;
      }

      if (momentos$.sucesso && stakeholders$.sucesso) {
        this.momentos$ = momentos$.retorno;
        this.stakeholders$ = stakeholders$.retorno;

        this.momentos = this.momentos$;
        this.stakeholdersDestino = this.stakeholders$;
        this.stakeholdersOrigem = stakeholders$.retorno;
      }
      else {
        this.alertService.showError("Erro ao carregar as listas!");
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
      stakeholderOrigem: [null, Validators.required],
      stakeholderDestino: [{ value: null, disabled: true }, Validators.required],
      local: [{ value: this.local, disabled: true }, Validators.required],
      momento: [{ value: null, disabled: true }, Validators.required],
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

  selectEmpresaChange(id:number) {
    let stakeholder = this.stakeholdersOrigem.filter(x => x.id == id).map(x => x)[0];

    if (stakeholder.id == 1) {
      if (this.companies$.length > 0 && this.checkpoints$.length > 0) {
        this.momentos = [];
        this.stakeholdersDestino = [];
        this.companies = this.companies$;
        this.checkpoints = this.checkpoints$;
        this.places = this.places$;

        this.form.enable();
        this.form.controls.momento.disable();
      }
      else{
        this.alertService.showError(this.companies$['responseStatus']['message']);
      }
    }
    else if (stakeholder.id > 1) {
      this.companies = [];
      this.checkpoints = [];
      this.places = [];
      this.checkpointsByPlace = [];
      this.momentos = this.momentos$;
      this.stakeholdersDestino = this.stakeholders$;

      this.form.enable();
    }
  }

  changeMomento(id: number){
    this.momento = this.momentos.filter(x => x.id == id).map(x => x)[0];
  }

  changeCheckpoint(id: number){
    this.checkpoint = this.checkpoints.filter(x => x.checkpoint == id).map(x => x)[0];
  }

  changePlace(local: number){
    var places = this.checkpoints.filter(x => x.local == local).map(x => x);
    this.checkpointsByPlace = places;
    this.form.controls.momento.enable();
  }

  toNavigate(){
    this.navCtrl.push(ModalChassisVistoriaComponent, {
      data: {
        empresa : {
          nome: this.form.controls.empresa.value
        },
        local : {
          nome: this.form.controls.local.value
        },
        momento : {
          id: this.momento.id,
          nome: this.momento.nome
        },
        stakeholder : {
          origem: this.form.controls.stakeholderOrigem.value,
          destino: this.form.controls.stakeholderDestino.value
        },
      }
    });
  }
}
