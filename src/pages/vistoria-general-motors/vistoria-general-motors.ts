import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NavController, ModalController, ViewController, NavParams, Modal } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../providers/alert-service';
import { MomentoDataService } from '../../providers/momento-data-service';
import { StakeholderService } from '../../providers/stakeholder-data-service';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { GeneralMotorsDataService } from '../../providers/general-motors-data-service';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Company } from '../../model/GeneralMotors/company';
import { Place } from '../../model/GeneralMotors/place';
import { Trip } from '../../model/GeneralMotors/trip';
import { Ship } from '../../model/GeneralMotors/ship';
import { Surveyor } from '../../model/GeneralMotors/surveyor';
import { ModalChassisVistoriaGmComponent } from '../../components/modal-chassis-vistoria-gm/modal-chassis-vistoria-gm';
import { StakeHolder } from '../../model/stakeholder';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { LocalDataService } from '../../providers/local-data-service';
import { NavioDataService } from '../../providers/navio-data-service';

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
  checkpointsFiltered: Checkpoint[] = [];
  companies: Company[] = [];
  places: Place[] = [];
  ships: Ship[] = [];
  trips: Trip[] = [];
  tripsFiltered: Trip[] = [];
  surveyors: Surveyor[] = [];

  checkpoint = new Checkpoint();
  place = new Place();
  company = new Company();
  companyOrigin = new Company();
  companyDestination = new Company();
  ship = new Ship();
  trip = new Trip();
  surveyor = new Surveyor();

  data: StakeHolder;

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
    public navParams: NavParams,
    private generalMotorsService: GeneralMotorsDataService,
    private vistoriaService: VistoriaDataService,
    private localService: LocalDataService,
    private navioService: NavioDataService
  ) {
    this.title = 'Vistoria';
    this.url = this.authService.getUrl();
    this.user = this.authService.getUserData();
    this.local = this.authService.getUserData().localNome;
    // this.data = this.navParams.get('data');

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
    this.loadGM();
  }

  initializeFormControl(){
    this.form = this.formBuilder.group({
      company: [null, Validators.required],
      place: [null, Validators.required],
      checkpoint: [{ value:null, disabled: true }, Validators.required],
      companyOrigin: [null, Validators.required],
      companyDestiny: [null, Validators.required],
      ship: [null, Validators.required],
      trip: [{ value:null, disabled: true }, Validators.required]
    });
  }

  loadGM(){
    this.authService.showLoading();

    forkJoin([
      this.generalMotorsService.places(),
      this.generalMotorsService.checkPoints(),
      this.generalMotorsService.companies(),
      this.generalMotorsService.trips(),
      this.generalMotorsService.ships(),
      this.generalMotorsService.listSurveyors()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let places$ = arrayResult[0];
      let checkpoints$ = arrayResult[1];
      let companies$ = arrayResult[2];
      let trips$ = arrayResult[3];
      let ships$ = arrayResult[4];
      let surveyors$ = arrayResult[5];

      if (companies$.sucesso && checkpoints$.sucesso && places$.sucesso && trips$.sucesso && ships$.sucesso && surveyors$.sucesso) {
        this.companies = companies$.retorno.company;
        this.checkpoints = checkpoints$.retorno.checkPoints;
        this.places = places$.retorno;
        this.trips = trips$.retorno.trips;
        this.ships = ships$.retorno.ships;

        this.surveyors = surveyors$.retorno.surveyors;
        if (this.surveyors.length) {
          this.surveyors.forEach(surveyor => {
            if (this.user.nome == surveyor.name) {
              this.surveyor = surveyor;
            }
          });
        }


        let company = this.companies.filter(x => x.companyName == 'Nexus').map(x => x)[0];
        this.form.patchValue({
          company: company.id
        });
        this.company = company;
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

  loadGeral(){
    this.authService.showLoading();

    forkJoin([
      this.vistoriaService.vistoriadores(),
      this.localService.listar(),
      this.momentoService.listar(),
      this.stakeholderService.listar(),
      this.navioService.listar()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let vistoriadores$ = arrayResult[0];
      let local$ = arrayResult[1];
      let momentos$ = arrayResult[2];
      let stakeholders$ = arrayResult[3];
      let navios$ = arrayResult[4];

      if (vistoriadores$.sucesso && local$.sucesso && momentos$.sucesso && stakeholders$.sucesso && navios$.sucesso) {

        vistoriadores$.retorno.forEach(item => {
          let surveyor = new Surveyor();
          surveyor.id = item.id;
          surveyor.name = item.nome
          this.surveyors.push(surveyor);
        });

        local$.retorno.forEach(item => {
          let place = new Place();
          place.local = item.id;
          place.localDescription = item.nome;
          this.places.push(place);
        });

        momentos$.retorno.forEach(item => {
          let checkpoint = new Checkpoint();
          checkpoint.checkpoint = item.id;
          checkpoint.checkpointDescription = item.nome;
          this.checkpoints.push(checkpoint);
        });

        stakeholders$.retorno.forEach(item => {
          let company = new Company();
          company.id = item.id;
          company.companyName = item.nome[0].toUpperCase() + item.nome.substring(1);
          this.companies.push(company);
        });

        navios$.retorno.forEach(item => {
          let temNavio = this.ships.filter(x => x.description == item.nome).map(x => x)[0];
          if (!temNavio) {
            let ship = new Ship();
            ship.id = item.id;
            ship.description = item.nome;
            ship.viagem = item.viagem;
            this.ships.push(ship);
          }
        });
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

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  voltar(){
    this.view.dismiss();
  }

  changeCompany(id:number) {
    this.company = this.companies.filter(x => x.id == id).map(x => x)[0];
  }

  changeOriginCompany(id:number) {
    this.companyOrigin = this.companies.filter(x => x.id == id).map(x => x)[0];
  }

  changeSurveyors(id:number) {
    this.surveyor = this.surveyors.filter(x => x.id == id).map(x => x)[0];
  }

  changeDestinationCompany(id:number) {
    this.companyDestination = this.companies.filter(x => x.id == id).map(x => x)[0];
  }

  changePlace(local: number){
    this.place = this.places.filter(x => x.local == local).map(x => x)[0];
    var places = this.checkpoints.filter(x => x.local == local).map(x => x);
    this.checkpointsFiltered = places;
    this.form.controls.checkpoint.enable();
    this.form.controls.checkpoint.setErrors({'invalid': true});
  }

  changeCheckpoint(id: number){
    this.checkpoint = this.checkpoints.filter(x => x.checkpoint == id).map(x => x)[0];
  }

  changeShip(id: number){
    this.ship = this.ships.filter(x => x.id == id).map(x => x)[0];

    this.form.controls.trip.enable();
    this.form.controls.trip.setErrors({'invalid': true});
    this.tripsFiltered = [];
    this.trips.forEach(trip => {
      if (trip.shipId == this.ship.id) {
        this.tripsFiltered.push(trip);
      }
    });
  }

  changeTrip(id: number){
    this.trip = this.trips.filter(x => x.id == id).map(x => x)[0];
  }

  toNavigate(){
    this.navCtrl.push(ModalChassisVistoriaGmComponent, {
      data: {
        company: this.company,
        place: this.place,
        checkpoint: this.checkpoint,
        trip: this.trip,
        ship: this.ship,
        surveyor: this.surveyor,
        companyOrigin: this.companyOrigin,
        companyDestination: this.companyDestination,
      }
    });
  }
}
