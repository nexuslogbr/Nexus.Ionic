import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, Content, Modal, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators';
import { Avaria } from '../../model/avaria';
import { Veiculo } from '../../model/veiculo';
import { Momento } from '../../model/momento';
import { GravidadeAvaria } from '../../model/gravidadeAvaria';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DataRetorno } from '../../model/dataretorno';
import { GeneralMotorsDataService } from '../../providers/general-motors-data-service';
import { Part } from '../../model/GeneralMotors/part';
import { Qualityinconsistence } from '../../model/GeneralMotors/qualityinconsistence';
import { Severity } from '../../model/GeneralMotors/severity';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Company } from '../../model/GeneralMotors/Company';
import { Place } from '../../model/GeneralMotors/place';
import { Ship } from '../../model/GeneralMotors/ship';
import { Trip } from '../../model/GeneralMotors/trip';

@Component({
  selector: 'page-lancamento-avaria-gm-selecao',
  templateUrl: 'lancamento-avaria-gm-selecao.html',
})
export class LancamentoAvariaGmSelecaoPage {
  title: string;

  parts: Array<Part> = [];
  qualityinconsistences: Array<Qualityinconsistence> = [];
  severities: Array<Severity> = [];

  form: FormGroup;

  images: any[] = [];
  imagesToSend: any[] = [];

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  urlImagem = '';

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  formData = {
    number: 0,
    parte: '',
    avaria: new Avaria(),
    veiculo: new Veiculo(),
    company: new Company(),
    place: new Place(),
    checkpoint: new Checkpoint(),
    companyOrigin: new Company(),
    companyDestination: new Company(),
    ship: new Ship(),
    trip: new Trip(),
  };

  damage: {
    quadrant: number,
    part: number,
    qualityInconsistency: number,
    severity: number,
    vehicleZone: number,
    other: string,
    photoClose: string,
    photoNormal: string,

    side: number, //??
    block: number, //??
  };

  document = {
    documentType: null, //??
    additionalInfo: null, //??
    document: null, //??
  }

  damages = [];
  documents = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    public alertService: AlertService,
    public authService: AuthService,
    private generalMotorsService: GeneralMotorsDataService,
    private avariaService: AvariaDataService,
    private alertController: AlertController,
    private modal: ModalController,
    private view: ViewController,
  ) {

    this.formData = this.navParams.get('data');
    this.title = this.formData.parte;

    this.form = formBuilder.group({
      subArea: [null, Validators.required],
      parte: [null,Validators.required],
      avaria: [ this.formData.avaria, Validators.required],
      gravidade: [null, Validators.required],
    });

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
  }

  ionViewWillEnter() {
    this.loadScreen();
  }

  loadScreen(){
    this.authService.showLoading();

    if (this.formData.number == 1) {
      this.urlImagem = 'assets/images/onix-frente.png';
    }
    else if (this.formData.number == 2) {
      this.urlImagem = 'assets/images/onix-parachoques.png';
    }
    else if (this.formData.number == 3) {
      this.urlImagem = 'assets/images/onix-traseira-parachoques.png';
    }
    else if (this.formData.number == 4) {
      this.urlImagem = 'assets/images/onix-traseira-portamalas.png';
    }
    else if (this.formData.number == 5) {
      this.urlImagem = 'assets/images/onix-lateral-frente.png';
    }
    else if (this.formData.number == 6) {
      this.urlImagem = 'assets/images/onix-lateral-porta.png';
    }
    else if (this.formData.number == 7) {
      this.urlImagem = 'assets/images/onix-lateral-traseira.png';
    }
    else if (this.formData.number == 8) {
      this.urlImagem = 'assets/images/onix-teto.png';
    }

    forkJoin([
      this.generalMotorsService.parts(),
      this.generalMotorsService.qualityinconsistences(),
      this.generalMotorsService.severity()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let parts$ = arrayResult[0];
      let qualityinconsistences$ = arrayResult[1];
      let severity$ = arrayResult[2];

      if (parts$.sucesso && qualityinconsistences$.sucesso && severity$.sucesso) {
        this.parts = parts$.retorno.parts;
        this.qualityinconsistences = qualityinconsistences$.retorno.qualityInconsistences;
        this.severities = severity$.retorno.severity;
      }
    });
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  touched(event){ }

  moved(event){ }

  selectPartsChange(event){
    this.damage.vehicleZone = this.parts.filter(x => x.id == event).map(x => x)[0].zone;
    this.damage.part = this.parts.filter(x => x.id == event).map(x => x)[0].id;
    this.damage.side = null;
  }

  selectSubAreaChange(){
    this.damage.quadrant = this.form.controls.subArea.value;
  }

  selectQualityInconsistenceChange(id:number){
    this.damage.qualityInconsistency = this.qualityinconsistences.filter(x => x.id == id).map(x => x)[0].id;
    this.damage.other = this.qualityinconsistences.filter(x => x.id == id).map(x => x)[0].description;
  }

  selectSeverityChange(id){
    this.damage.severity = this.severities.filter(x => x.id == id).map(x => x)[0].id;
  }

  return(){
    this.view.dismiss();
  }

  newQualityinconsistence() {
    this.damages.push(this.damage);
  }

  save(){
    this.authService.showLoading();

    let model  = {
      company: this.formData.company.id,
      local: this.formData.place.local,
      origin: this.formData.companyOrigin.id,
      destination: this.formData.companyDestination.id,
      checkpoint: this.formData.checkpoint.checkpoint,
      vin: this.formData.veiculo.chassi,

      surveyor: null,
      surveyDate: null,
      validator: null,
      validationDate: null,

      hasDamages: true,
      hasDocuments: false,

      released: null, //??

      damages: this.damages,
      documents: this.documents
    };

    this.generalMotorsService.insertsurvey(model)
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
      )
      .subscribe((response:any) => {

      }, (error: any) => {
        this.alertService.showError('Erro ao salvar avaria');
    });
  }

  /// Funções relativas a captura, exibição e upload de imagens
  selectImage(event:any) {
    const actionSheet = this.actionSheetController.create({
        title: 'Selecionar imagem',
        buttons: [
          {
            text: 'Camera',
            handler: () => {
              this.selectImageCamera();
            }
          },
          {
            text: 'Galeria',
            handler: () => {
              this.selectImageLibrary();
            }
          },
          {
            text: 'Cancelar', role: 'cancel'
          }
        ]
    });
    actionSheet.present();
  }

  async selectImageCamera() {
    this.authService.showLoading();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    if (image) {
      this.saveImage(image)
    }
  }

  async selectImageLibrary() {
    this.authService.showLoading();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image) {
      this.saveImage(image)
    }
  }

  saveImage(photo: Photo) {
    const fileName = new Date().getTime() + '.jpeg';

    let image = {
      id: 0,
      path: 'data:image/jpeg;base64,' + photo.base64String,
      fileName: fileName
    }

    this.damage.photoClose = 'data:image/jpeg;base64,' + photo.base64String;
    this.damage.photoNormal = 'data:image/jpeg;base64,' + photo.base64String;

    this.images.push(image);
    this.authService.hideLoading();
  }

  async presentAlert(image) {
    const alert = await this.alertController.create({
      title: 'Remover a imagem?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // this.handlerMessage = 'Alert canceled';
          }
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deleteImage(image);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteImage(image) {
    this.images = this.images.filter(x => x !== image).map(x => x);
  }
}
