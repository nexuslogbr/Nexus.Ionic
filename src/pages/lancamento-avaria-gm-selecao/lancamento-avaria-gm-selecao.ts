import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, Content, Modal, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';
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
import { GrupoSuperficieChassi } from '../../model/grupoSuperficieChassi';
import { DataRetorno } from '../../model/dataretorno';
import { ResponsabilidadeAvaria } from '../../model/responsabilidadeAvaria';
import { ResponsabilidadeAvariaDataService } from '../../providers/responsabilidade-avaria-service';
import { NivelGravidadeAvaria } from '../../model/nivelGravidadeAvaria';
import { GeneralMotorsDataService } from '../../providers/general-motors-data-service';

@Component({
  selector: 'page-lancamento-avaria-gm-selecao',
  templateUrl: 'lancamento-avaria-gm-selecao.html',
})
export class LancamentoAvariaGmSelecaoPage {
  title: string;
  partesAvaria: Array<Parte> = [];
  avarias: Array<Avaria> = [];
  gravidadesAvaria: Array<GravidadeAvaria> = [];

  form: FormGroup;

  images: any[] = [];
  imagesToSend: any[] = [];

  parteAvaria = new Parte();
  avaria = new Avaria();
  gravidadeAvaria = new GravidadeAvaria();

  @Output() onSuperficieParteChassiInputed: EventEmitter<SuperficieChassiParte> = new EventEmitter<SuperficieChassiParte>();

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;
  abcissaX: number = 1;
  ordenadaY: number = -245;
  width = 0;
  height = 0;
  posicoesSubArea = [];
  divideEmPartes: number;
  radiusX = 0;
  radiusY = 0;

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
    let data = this.navParams.get('data');
    this.formData = data;

    this.form = formBuilder.group({
      chassi: [this.formData.veiculo.chassi, Validators.required],
      modelo: [this.formData.veiculo.modelo, Validators.required],
      superficieChassiParte: [null,Validators.required],
      tipoAvaria: [ this.formData.avaria, Validators.required],
      gravidadeAvaria: [this.formData.gravidadeAvaria == undefined ? '' : this.formData.gravidadeAvaria.id, Validators.required],
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
    this.authService.showLoading();

    if (this.formData.veiculo.chassi) {
      this.avariaService.consultarChassi({
        chassi: this.formData.veiculo.chassi,
        token: ''
      })
      .subscribe((res: any) => {
        this.urlImagem = res.retorno.imagem;

        let imagem = document.getElementById('image')
        this.width = imagem.clientWidth;

        if (imagem.clientHeight < 100) {
          this.height = (imagem.clientHeight * 10);
        }
        else {
          this.height = imagem.clientHeight;
        }

        this.getImageDimenstion(this.width,this.height);
      });
    }
  }

  loadScreen(){
    this.authService.showLoading();
    forkJoin([
      this.avariaService.carregarGrupoAvarias({ chassi: this.formData.veiculo.chassi }),
      this.avariaService.carregarTipoAvarias(),
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let gruposAvaria$ = arrayResult[0];
      let tiposAvaria$ = arrayResult[1];
      let gravidades$ = arrayResult[2];
      let responsabilidadeAvaria$ = arrayResult[3];

    });
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  styleObject(): Object {
    if (this.avaria) {
      return {
        'background-color': this.avaria.tipoAvaria.cor,
        'transform': "translate(" + this.abcissaX + "px," + this.ordenadaY + "px)",
      }
    }
  }

  touched(event){

  }

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
        this.partesAvaria = x.retorno;
        this.assembleGrid({});
        this.authService.hideLoading();
       });
    }
  }

  selectPartesAvariaChange(event){
    if (event.length > 0) {
      this.parteAvaria = this.partesAvaria.filter(x => x.id == event).map(x => x)[0];
      this.form.patchValue({
        tipoAvaria: null,
        partePeca: false,
      });

      this.assembleGrid(this.parteAvaria.superficieChassiParte);
      this.form.controls.tipoAvaria.enable();
      this.form.controls.partePeca.enable();
    }
  }

  selectTipoAvariaChange(id:number){
    this.avaria = this.avarias.filter(x => x.tipoAvaria.id == id).map(x => x)[0];
    this.form.patchValue({
      partePeca: true
    });

    if(this.divideEmPartes == 1){
      if (this.form.controls.subArea.value > 0) {
        let pos = this.posicoesSubArea.filter(x => x.posicao == this.form.controls.subArea.value).map(x => x)[0];
        this.abcissaX = pos.coordenadaX;
        this.ordenadaY = pos.coordenadaY;
      }
    }
    else if (this.divideEmPartes == 0){
      this.abcissaX = this.radiusX;
      this.ordenadaY = this.radiusY;
    }
  }

  selectSubareaChange(subArea: number){
    let pos = this.posicoesSubArea.filter(x => x.posicao == subArea).map(x => x)[0];
    this.abcissaX = pos.coordenadaX;
    this.ordenadaY = pos.coordenadaY;
  }

  selectGravidadeChange(id){
    this.gravidadeAvaria = this.gravidadesAvaria.filter(x => x.id == id).map(x => x)[0]

    if (this.gravidadeAvaria && this.gravidadeAvaria.nivelGravidadeAvaria.length > 0) {
    }
  }

  assembleGrid(data) {
    this.posicoesSubArea = [];
    let superficieChassi = data;

    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);

    var imageWidth = this.width;
    var imageHeight = this.height;

    // espessura das linhas do grid
    ctx.lineWidth = 2;

    // calcular onde a tela está na janela (usado para ajudar a calcular mouseX/mouseY)
    this.divideEmPartes = superficieChassi.tipoSelecao;

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

    if (this.divideEmPartes == 1) {
        $('#subAreaCombo').removeClass("hidden");

        // Espessura da borda externa do retângulo
        ctx.lineWidth = 1;
        var alturaTerco = height / 3;
        var larguraTerco = width / 3;
        var tamanhoFonte = alturaTerco / 2;
        var linhaHor1 = [startX, startY + alturaTerco, startX + width, startY + alturaTerco];
        var linhaHor2 = [startX, startY + (alturaTerco * 2), startX + width, startY + (alturaTerco * 2)];
        var linhaVer1 = [startX + larguraTerco, startY, startX + larguraTerco, startY + height];
        var linhaVer2 = [startX + (larguraTerco * 2), startY, startX + (larguraTerco * 2), startY + height];

        ctx.beginPath();
        ctx.moveTo(linhaHor1[0], linhaHor1[1]);
        ctx.lineTo(linhaHor1[2], linhaHor1[3]);

        ctx.moveTo(linhaHor2[0], linhaHor2[1]);
        ctx.lineTo(linhaHor2[2], linhaHor2[3]);

        ctx.moveTo(linhaVer1[0], linhaVer1[1]);
        ctx.lineTo(linhaVer1[2], linhaVer1[3]);

        ctx.moveTo(linhaVer2[0], linhaVer2[1]);
        ctx.lineTo(linhaVer2[2], linhaVer2[3]);

        ctx.stroke();

        // Desenhar os números dos quadrantes
        ctx.font = tamanhoFonte + "px Arial";
        ctx.fillStyle = superficieChassi.cor;
        ctx.textAlign = "center";
        var numeroQuadrante = 1;

        for (let coluna = 3; coluna >= 1; coluna--) {
            for (let linha = 1; linha <= 3; linha++) {
                var quadrante = [larguraTerco * (coluna - 0.5), alturaTerco * (linha - 0.30)];
                ctx.fillText(numeroQuadrante, startX + quadrante[0], startY + quadrante[1]);
                this.posicoesSubArea.push({ posicao: numeroQuadrante, coordenadaX: startX + quadrante[0], coordenadaY: startY + quadrante[1] });

                if (numeroQuadrante == 1) {
                  this.ordenadaY = startY + quadrante[1];
                  this.abcissaX = startX + quadrante[0];
                }

                numeroQuadrante++;
            }
        }
    }
    else if (this.divideEmPartes == 0) {
        $('#subAreaCombo').addClass("hidden");
    }

    this.radiusX = startX + ((endX - startX)/2);
    this.radiusY = startY + ((endY - startY)/2);
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
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
      tipoAvariaID: this.avaria.id != undefined ? this.avaria.tipoAvaria.id : this.formData.avaria.tipoAvaria.id,
      gravidadeAvariaID: this.gravidadeAvaria.id != undefined ? this.gravidadeAvaria.id : this.formData.gravidadeAvaria.id,
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
