import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, Content, Modal, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Parte } from '../../model/parte';
import { SuperficieChassiParte } from '../../model/superficieChassiParte';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators';
import { Avaria } from '../../model/avaria';
import { Veiculo } from '../../model/veiculo';
import { Momento } from '../../model/momento';
import { GravidadeAvaria } from '../../model/gravidadeAvaria';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ModalNovoLancamentoAvariaPage } from '../modal-novo-lancamento-avaria/modal-novo-lancamento-avaria';
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

  @Output() onSuperficieParteChassiInputed: EventEmitter<SuperficieChassiParte> = new EventEmitter<SuperficieChassiParte>();

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  width = 0;
  height = 0;

  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;

  urlImagem = '';

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  formData = {
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
    this.title = 'Lançamento de Avaria';
    this.formData = this.navParams.get('data');

    this.form = formBuilder.group({
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
    // this.authService.showLoading();

    // if (this.formData.veiculo.chassi) {
    //   this.avariaService.consultarChassi({
    //     chassi: this.formData.veiculo.chassi,
    //     token: ''
    //   })
    //   .subscribe((res: any) => {
    //     this.urlImagem = res.retorno.imagem;

    //     let imagem = document.getElementById('image')
    //     this.width = imagem.clientWidth;

    //     if (imagem.clientHeight < 100) {
    //       this.height = (imagem.clientHeight * 10);
    //     }
    //     else {
    //       this.height = imagem.clientHeight;
    //     }

    //     // this.getImageDimenstion(this.width,this.height);
    //   });
      this.loadScreen();
    // }
  }

  loadScreen(){
    this.authService.showLoading();
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

  getImageDimenstion(width: number, height: number){
    this.canvasElement = this.canvas.nativeElement;
    this.platform.width() + '';
    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }

  selectGrupoAvariaChange(event){
    if (event > 0) {
      this.authService.showLoading();
      this.form.patchValue({
        superficieChassiParte: null,
        tipoAvaria: null,
        partePeca: false
      });

      this.form.controls.superficieChassiParte.enable();
      this.form.controls.tipoAvaria.disable();


      this.avariaService.listarPartes({
        chassi: this.formData.veiculo.chassi,
       })
       .subscribe((x:DataRetorno) => {
        this.assembleGrid({});
        this.authService.hideLoading();
       });
    }
  }

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

  assembleGrid(data) {
    let superficieChassi = data;

    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);

    var imageWidth = this.width;
    var imageHeight = this.height;

    // espessura das linhas do grid
    ctx.lineWidth = 2;

    // essas vars irão manter a posição inicial do mouse
    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;

    startX = (imageWidth / 100) * superficieChassi.inicioX;
    endX = (imageWidth / 100) * superficieChassi.fimX;

    startY = ((imageHeight / 100) * superficieChassi.inicioY) + 5.5;
    endY = ((imageHeight / 100) * superficieChassi.fimY) + 8.5;

    ctx.strokeStyle = superficieChassi.cor;

    var width = endX - startX;
    var height = endY - startY;
  }

  return(){
    // this.navCtrl.push(QualidadeMenuPage);
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
      veiculoID: this.formData.veiculo.id > 0 ? this.formData.veiculo.id : 0,
      momentoID: this.formData.momento.id > 0 ? this.formData.momento.id : 0,
      avariaID: this.avaria.id != undefined ? this.avaria.id : this.formData.avaria.id,
      tipoAvariaID: this.formData.avaria.tipoAvaria.id,
      gravidadeAvariaID: this.formData.gravidadeAvaria.id,
      nivelGravidadeAvariaID: this.form.controls.nivelGravidadeAvaria.value,
      observacao: this.form.controls.observacao.value,
      quadrante: this.form.controls.subArea.value,
      arquivos: imagesToSend,
    };

    this.avariaService.salvar(model)
    .pipe(
      finalize(() => {
        $('#subAreaCombo').addClass("hidden");
        this.authService.hideLoading();
      })
      )
      .subscribe((response:any) => {
        this.alertService.showInfo('Avaria salva com sucesso!');

        const modal: Modal = this.modal.create(ModalNovoLancamentoAvariaPage);
        modal.present();

        modal.onWillDismiss((data) => {
          if (data.continue) {
            this.images = [];
            this.form.patchValue({
              grupoAvaria: null,
              superficieChassiParte: '',
              tipoAvaria: null,
              subArea: 1,
              gravidadeAvaria: null,
              nivelGravidadeAvaria: null,
              observacao: null,
              partePeca: null,
              responsabilidadeAvaria: null
            });
          }
          else{
            this.view.dismiss();
          }
        });

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
