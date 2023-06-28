import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, Content, Modal, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators';
import { Veiculo } from '../../model/veiculo';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DataRetorno } from '../../model/dataretorno';
import { GeneralMotorsDataService } from '../../providers/general-motors-data-service';
import { Part } from '../../model/GeneralMotors/part';
import { Qualityinconsistence } from '../../model/GeneralMotors/qualityinconsistence';
import { Severity } from '../../model/GeneralMotors/severity';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Company } from '../../model/GeneralMotors/company';
import { Place } from '../../model/GeneralMotors/place';
import { Ship } from '../../model/GeneralMotors/ship';
import { Trip } from '../../model/GeneralMotors/trip';
import { Surveyor } from '../../model/GeneralMotors/surveyor';
import { Damage } from '../../model/GeneralMotors/damage';
import { Survey } from '../../model/GeneralMotors/survey';
import { ParteDataService } from '../../providers/parte-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';
import { Parte } from '../../model/parte';
import { GravidadeAvaria } from '../../model/gravidadeAvaria';
import { Avaria } from '../../model/avaria';
import { TipoAvariaDataService } from '../../providers/tipoAvaria-data-service';
import { TipoAvaria } from '../../model/tipoAvaria';
import { ResponsabilidadeAvaria } from '../../model/responsabilidadeAvaria';
import { ResponsabilidadeAvariaDataService } from '../../providers/responsabilidade-avaria-service';
import { VistoriaDataService } from '../../providers/vistoria-service';

@Component({
  selector: 'page-lancamento-avaria-gm-selecao',
  templateUrl: 'lancamento-avaria-gm-selecao.html',
})
export class LancamentoAvariaGmSelecaoPage {
  title: string;

  parts: Array<Part> = [];
  qualityinconsistences: Array<Qualityinconsistence> = [];
  severities: Array<Severity> = [];
  responsabilidadeAvarias: Array<ResponsabilidadeAvaria> = [];

  partes: Array<Parte> = [];
  tipoAvarias: Array<TipoAvaria> = [];
  gravidades: Array<GravidadeAvaria> = [];
  responsabilidadeAvaria = new ResponsabilidadeAvaria();

  form: FormGroup;

  images: any[] = [];
  imagesToSend: any[] = [];
  imageClose = { id: 0, path: '', fileName: '' };
  ImageNormal = { id: 0, path: '', fileName: '' };

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  urlImagem = '';

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  public formData = {
    number: 0,
    parte: '',
    veiculo: new Veiculo(),
    company: new Company(),
    surveyor: new Surveyor(),
    place: new Place(),
    checkpoint: new Checkpoint(),
    companyOrigin: new Company(),
    companyDestination: new Company(),
    ship: new Ship(),
    trip: new Trip(),
  };

  public damage = new Damage();
  public survey = new Survey();

  damages:Damage[] = [];
  partsAll: Part[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    public alertService: AlertService,
    public authService: AuthService,
    private generalMotorsService: GeneralMotorsDataService,
    private tipoAvariaService: TipoAvariaDataService,
    private alertController: AlertController,
    private modal: ModalController,
    private view: ViewController,
    private pecaService: ParteDataService,
    private gravidadeService: GravidadeDataService,
    private responsabilidadeAvariaService: ResponsabilidadeAvariaDataService,
    private vistoriaService: VistoriaDataService
  ) {

    var data = this.navParams.get('data');
    this.formData = data.formData;
    this.damages = data.array == null ? [] : data.array;

    this.title = this.formData.parte;

    this.form = formBuilder.group({
      lado: [0],
      subArea: [null],
      parte: [null],
      parteOutros: [null],
      avaria: [null],
      gravidade: [null],
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
    this.loadGM();
  }

  loadGM(){
    this.authService.showLoading();
    this.loadImage();

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
        this.qualityinconsistences = qualityinconsistences$.retorno.qualityInconsistences;
        this.severities = severity$.retorno.severity;
        this.partsAll = parts$.retorno.parts;

        let image = this.formData.number;

        // Frente capo
        if (image == 1) {
          this.parts = this.partsAll.filter(x => x.block == 1 && x.zone == 1).map(x => x);
        }
        // Frente parachoques e farol
        else if (image == 2) {
          this.parts = this.partsAll.filter(x => x.block == 2 && x.zone == 1).map(x => x);
        }
        // Traseira parachoques
        else if (image == 3) {
            this.parts = this.partsAll.filter(x => x.block == 2 && x.zone == 2).map(x => x);
        }
        // Traseira porta-malas e lanterna
        else if (image == 4) {
          this.parts = this.partsAll.filter(x => x.block == 1 && x.zone == 2).map(x => x);
        }
        // Lateral frente
        else if (image == 5) {
          this.parts = this.partsAll.filter(x => x.block == 1 && x.zone == 3).map(x => x);
        }
        // Lateral meio
        else if (image == 6) {
          this.parts = this.partsAll.filter(x => x.block == 2 && x.zone == 3).map(x => x);
        }
        // Lateral traseira
        else if (image == 7) {
          this.parts = this.partsAll.filter(x => x.block == 3 && x.zone == 3).map(x => x);
        }
        // Teto
        else if (image == 8) {
          this.parts = this.partsAll.filter(x => x.block == 3 && x.zone == 1).map(x => x);
        }
        // Interno
        else if (image == 9) {
          this.parts = this.partsAll.filter(x => x.block == 0 && x.zone == 4).map(x => x);
        }
      }
    });
  }

  loadImage(){
    let image = this.formData.number;

    // Frente capo
    if (image == 1)
      this.urlImagem = 'assets/images/onix-frente.png';

    // Frente parachoques e farol
    else if (image == 2)
      this.urlImagem = 'assets/images/onix-parachoques.png';

    // Traseira parachoques
    else if (image == 3)
        this.urlImagem = 'assets/images/onix-traseira-parachoques.png';

    // Traseira porta-malas e lanterna
    else if (image == 4)
      this.urlImagem = 'assets/images/onix-traseira-portamalas.png';

    // Lateral frente
    else if (image == 5)
      this.urlImagem = 'assets/images/onix-lateral-frente.png';

    // Lateral meio
    else if (image == 6)
      this.urlImagem = 'assets/images/onix-lateral-porta.png';

    // Lateral traseira
    else if (image == 7)
      this.urlImagem = 'assets/images/onix-lateral-traseira.png';

    // Teto
    else if (image == 8)
      this.urlImagem = 'assets/images/onix-teto.png';

  }

  initializeFormControl(){
    this.form = this.formBuilder.group({
      lado: [null, Validators.required],
      subArea: [null, Validators.required],
      checkpoint: [{ value:null, disabled: true }, Validators.required],
      companyOrigin: [null, Validators.required],
      companyDestiny: [null, Validators.required],
      ship: [{ value:null, disabled: true }, Validators.required],
      trip: [{ value:null, disabled: true }, Validators.required]
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

  selectSubAreaChange(){
    if (this.form.controls.subArea.value) {
      this.damage.quadrant = parseInt(this.form.controls.subArea.value);
      this.damage.side = parseInt(this.form.controls.lado.value);
    }
  }

  selectPartsChange(id: number){
    if (id > 0) {
      let part = this.parts.filter(x => x.id == id).map(x => x)[0];
      this.damage.vehicleZone = part.zone;
      this.damage.part = part.id;
      this.damage.block = part.block;
    }
  }

  selectQualityInconsistenceChange(id:number){
    if (id > 0) {
      this.damage.qualityInconsistency = this.qualityinconsistences.filter(x => x.id == id).map(x => x)[0].id;
      this.damage.other = '';
    }
  }

  selectSeverityChange(id){
    if (id > 0) {
      this.damage.severity = this.severities.filter(x => x.id == id).map(x => x)[0].id;
    }
  }

  selectResponsabilidadeAvariaChange(id){
    this.responsabilidadeAvaria = this.responsabilidadeAvarias.filter(x => x.id == id).map(x => x)[0]
  }

  return(){
    this.view.dismiss();
  }

  newQualityinconsistence() {
    this.authService.showLoading();
    this.images = [];
    this.damages.push(this.damage);
    this.form.reset();

    setTimeout(() => {
      this.view.dismiss(this.damages);
      this.authService.hideLoading();
    }, 2000);
  }

  save(){
    this.authService.showLoading();
    this.damages.push(this.damage);

    var date = new Date();

    this.survey.company = '';
    this.survey.local = this.formData.place.local;
    this.survey.origin = this.formData.companyOrigin.id;
    this.survey.destination = this.formData.companyDestination.id;
    this.survey.checkpoint = this.formData.checkpoint.checkpoint;
    this.survey.tripId = this.formData.trip.id;
    this.survey.shipId = this.formData.ship.id;
    this.survey.vin = this.formData.veiculo.chassi;
    this.survey.surveyor = this.formData.surveyor.id;
    this.survey.surveyDate = date.toISOString();
    this.survey.validator = this.formData.surveyor.id;
    this.survey.validationDate = date.toISOString();
    this.survey.hasDamages = true;
    this.survey.hasDocuments = false;
    this.survey.released = 2;
    this.survey.damages = this.damages;
    this.survey.documents = [];

    this.generalMotorsService.insertsurvey(this.survey)
    .subscribe((response:DataRetorno) => {
      if (response.sucesso) {
        let data = 'esc';
        this.view.dismiss(data);
        this.authService.hideLoading();
        this.alertService.showInfo('Salvo com sucesso!');
        var response = response;
      }
      else {
        this.alertService.showError(response.mensagem);;
      }
    }, (error: any) => {
        this.alertService.showError('Erro ao salvar avaria');
    });
  }

  /// Funções relativas a captura, exibição e upload de imagens
  selectImage(event:any, type:number) {
    const actionSheet = this.actionSheetController.create({
        title: 'Selecionar imagem',
        buttons: [
          {
            text: 'Camera',
            handler: () => {
              this.selectImageCamera(type);
            }
          },
          {
            text: 'Galeria',
            handler: () => {
              this.selectImageLibrary(type);
            }
          },
          {
            text: 'Cancelar', role: 'cancel'
          }
        ]
    });
    actionSheet.present();
  }

  async selectImageCamera(type:number) {
    this.authService.showLoading();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    if (image) {
      this.saveImage(image, type)
    }
  }

  async selectImageLibrary(type:number) {
    this.authService.showLoading();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image) {
      this.saveImage(image, type)
    }
  }

  saveImage(photo: Photo, type:number) {
    const fileName = new Date().getTime() + '.jpeg';

    let image = {
      id: 0,
      path: 'data:image/jpeg;base64,' + photo.base64String,
      fileName: fileName
    }

    if (type === 1) {
      this.imageClose = null;
      this.imageClose = image;
      this.damage.photoClose = 'data:image/jpeg;base64,' + photo.base64String;
    }
    else if (type === 2){
      this.ImageNormal = null;
      this.ImageNormal = image;
      this.damage.photoNormal = 'data:image/jpeg;base64,' + photo.base64String;
    }

    // this.images = [];
    // this.images.push(image);
    this.authService.hideLoading();
  }

  async presentAlert(image, type:number) {
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
            this.deleteImage(image, type);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteImage(image, type:number) {
    this.images = this.images.filter(x => x !== image).map(x => x);

    if (type === 1) {
      this.imageClose.id = 0;
      this.imageClose.path = '' ;
      this.imageClose.fileName = '' ;
    }
    else if (type === 2){
      this.ImageNormal.id = 0;
      this.ImageNormal.path = '';
      this.ImageNormal.fileName = '';
    }

  }
}
