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
  selector: 'page-vistoria-general-motors',
  templateUrl: 'vistoria-general-motors.html',
})

export class VistoriaGeneralMotorsPage {

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

  checkpoints: Checkpoint[] = [];
  checkpointsByPlace: Checkpoint[] = [];
  companies: Company[] = [];
  places: Place[] = [];

  checkpoint = new Checkpoint();
  place = new Place();
  companyOrigin = new Company();
  companyDestination = new Company();

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
      this.generalMotorsService.companies(),
      this.generalMotorsService.places(),
      this.generalMotorsService.checkPoints(),
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let companies$ = arrayResult[0];
      let places$ = arrayResult[1];
      let checkpoints$ = arrayResult[2];

      if (companies$.sucesso && checkpoints$.sucesso && places$.sucesso) {
        this.companies = companies$.retorno.company;
        this.checkpoints = checkpoints$.retorno.checkPoints;
        this.places = places$.retorno;
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
      local: [null, Validators.required],
      checkpoint: [null, Validators.required],
      stakeholderOrigem: [null, Validators.required],
      stakeholderDestino: [{ value: null, disabled: true }, Validators.required]
    });
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  voltar(){
    this.view.dismiss();
  }

  selectOriginCompanyChange(id:number) {
    this.companyOrigin = this.companies.filter(x => x.id == id).map(x => x)[0];

  }

  selectDestinationCompanyChange(id:number) {
    this.companyDestination = this.companies.filter(x => x.id == id).map(x => x)[0];

  }

  changeCheckpoint(id: number){
    this.checkpoint = this.checkpoints.filter(x => x.checkpoint == id).map(x => x)[0];
  }

  changePlace(local: number){
    this.place = this.places.filter(x => x.local == local).map(x => x)[0];
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
          id: this.place.local,
          nome: this.place.localDescription
        },
        momento : {
          id: this.checkpoint.checkpoint,
          nome: this.checkpoint.checkpointDescription
        },
        stakeholder : {
          destino: this.form.controls.stakeholderDestino.value
        },
        vistoriaGM: this.form.controls.vistoriaGM.value
      }
    });
  }
}
