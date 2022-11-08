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

@Component({
  selector: 'page-lancamento-avaria-gm-selecao',
  templateUrl: 'lancamento-avaria-gm-selecao.html',
})
export class LancamentoAvariaGmSelecaoPage {
  title: string;

  partes: Array<Part> = [];
  avarias: Array<Qualityinconsistence> = [];
  gravidades: Array<Severity> = [];

  parte = new Part();
  avaria = new Qualityinconsistence();
  gravidade = new Severity();

  form: FormGroup;

  images: any[] = [];
  imagesToSend: any[] = [];

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  width = 0;
  height = 0;

  urlImagem = '';

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  formData = {
    number: 0,
    parte: '',
    veiculo: new Veiculo(),
    momento: new Momento(),
    tipoAvaria: new TipoAvaria(),
    gravidadeAvaria: new GravidadeAvaria(),
    avaria: new Avaria(),
  };

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
        this.partes = parts$.retorno.parts;
        this.avarias = qualityinconsistences$.retorno.qualityInconsistences;
        this.gravidades = severity$.retorno.severity;
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

  selectPartesChange(event){
    if (event.length > 0) {
      this.parte = this.partes.filter(x => x.id == event).map(x => x)[0];
    }
  }

  selectAvariaChange(id:number){
    this.avaria = this.avarias.filter(x => x.id == id).map(x => x)[0];
  }

  selectGravidadeChange(id){
    this.gravidade = this.gravidades.filter(x => x.id == id).map(x => x)[0]
  }

  return(){
    this.view.dismiss();
  }

  save(){
    this.authService.showLoading();

    let imagesToSend = [];
    this.images.forEach(image => {
      imagesToSend.push({
        id: image.id,
        data: image.path,
        fileName: image.fileName
      });
    });

    let model  = {
      Company: null,
      Local: null,
      Origin: null,
      Destination: null,
      Checkpoint: null,
      Vin: null,
      Surveyor: null,
      SurveyDate: null,
      Validator: null,
      ValidationDate: null,
      HasDamages: null,
      HasDocuments: null,
      Released: null,
      VehicleZone: null,
      Part: null,
      Side: null,
      Quadrant: null,
      QualityInconsistency: null,
      Severity: null,
      Block: null,
      Other: null,
      PhotoClose: null,
      PhotoNormal: null,
      DocumentType: null,
      AdditionalInfo: null,
      Document: null,
      ListDamage: null,
      ListDoc: null,
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
