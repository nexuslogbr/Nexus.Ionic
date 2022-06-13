import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, Content, LoadingController, Modal, ModalController, NavController, NavParams, normalizeURL, Platform, Select, ToastController, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { NivelGravidadeAvaria } from '../../model/NivelGravidadeAvaria';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';
import { LancamentoAvariaPage } from '../lancamento-avaria/lancamento-avaria';
import { AuthService } from '../../providers/auth-service/auth-service';

import { File, FileEntry } from '@ionic-native/File';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/index';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';
import { PosicaoSuperficieChassi } from '../../model/PosicaoSuperficieChassi';
import { Parte } from '../../model/Parte';
import { SuperficieChassiParte } from '../../model/superficieChassiParte';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'page-lancamento-avaria-selecao-superficie',
  templateUrl: 'lancamento-avaria-selecao-superficie.html',
  providers: [Camera]
})
export class LancamentoAvariaSelecaoSuperficiePage {
  title: string;
  tiposAvaria: Array<TipoAvaria> = [];
  posicoesAvaria: Array<PosicaoSuperficieChassi> = [];
  nivelGravidadeAvaria: Array<NivelGravidadeAvaria> = [];
  partesAvaria: Array<Parte> = [];
  formSelecaoSuperficie: FormGroup;
  images = [];
  tipoAvaria = new TipoAvaria();
  posicaoAvaria = new PosicaoSuperficieChassi();
  parteAvaria = new Parte();
  @Output() onSuperficieParteChassiInputed: EventEmitter<SuperficieChassiParte> = new EventEmitter<SuperficieChassiParte>();

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;
  abcissaX: number = 1;
  ordenadaY: number = -245;

  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;

  urlImagem = 'http://nexus.luby.com.br/Arquivos/Empresas/';
  image = new Image();

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  formData = {
    id: 0,
    chassi: '',
    modelo: '',
    posicaoAtual: '',
    cor: '',
    status: '',
    observacao: '',
    momento: ''
  };

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  private view: ViewController,
  private formBuilder: FormBuilder,
  private platform: Platform,
  private camera: Camera,
  private file: File,
  private webview: WebView,
  private actionSheetController: ActionSheetController,
  private toastController: ToastController,
  private storage: Storage,
  private ref: ChangeDetectorRef,
  private filePath: FilePath,

  private modal: ModalController,
  private avariaService: AvariaDataService,
  private gravidadeService: GravidadeDataService,
  public authService: AuthService,
) {
    this.title = 'Lançamento de Avaria';
    this.formData = this.navParams.get('data');

    this.formSelecaoSuperficie = formBuilder.group({
      observacao: [''],
      chassi: [this.formData.chassi, Validators.required],
      modelo: [this.formData.modelo, Validators.required],
      tipoAvaria: ['', Validators.required],
      posiçãoAvaria: ['', Validators.required]
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

  ionViewDidEnter() {

  if (this.formData.chassi) {
    this.avariaService.consultarChassi({
      chassi: this.formData.chassi,
      token: ''}).subscribe((res: any) => {
        this.urlImagem += res.retorno.imagem;

        this.image.src = this.urlImagem;
        this.image.onload = function (event) {
            let  loadedImage = event.currentTarget;
            let width =  loadedImage['width'];
            let height = loadedImage['height'];
            console.log('height: '+height);
            console.log('width: '+width);
          }

          let imagem = document.getElementById('image')
          var width = imagem.clientWidth;
          var height = imagem.clientHeight;

          this.getImageDimenstion(width,height);
          this.loadPartes();
      });
    }

  }

  styleObject(): Object {
    return {
      'background-color': this.tipoAvaria.cor,
      'transform': "translate(" + this.abcissaX + "px," + this.ordenadaY + "px)",
    }
  }

  getImageDimenstion(width: number, height: number){

    console.log('height getImageDimenstion: '+ this.image.height);
    console.log('width getImageDimenstion: '+ this.image.width);

    this.canvasElement = this.canvas.nativeElement;
    this.platform.width() + '';
    // this.canvasElement.height = height;
    this.canvasElement.width = width;
    this.canvasElement.height = 285;
  }

  touched(event){
    this.ordenadaY = -245;

    var canvasPosition = this.canvasElement.getBoundingClientRect();
    this.saveX = event.touches[0].pageX - canvasPosition.x;
    this.saveY = event.touches[0].pageY - canvasPosition.y;

    this.abcissaX = event.touches[0].pageX - canvasPosition.x;
    this.ordenadaY -= ((event.touches[0].pageY - canvasPosition.y)* -1);
  }

  moved(event) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    let currentX = event.touches[0].pageX - canvasPosition.x;
    let currentY = event.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }


  assembleGrid (data) {

    let coordenadas = data;
    let ctx = this.canvasElement.getContext('2d');

    // obter referências para a tela e contexto
    // var canvas = document.getElementById("canvas");
    // var overlay = document.getElementById("overlay");

    ctx.clearRect(0, 0, ctx.width, ctx.height);

    var imageWidth = ctx.width;
    var imageHeight = ctx.height;

    // estilize o contexto
    ctx.lineWidth = 3;

    // calcular onde a tela está na janela
    // (usado para ajudar a calcular mouseX/mouseY)
    var $canvas = $("#canvas");
    var canvasOffset = $canvas.offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();
    var divideEmPartes = coordenadas.TipoSelecao;

    // essas vars irão manter a posição inicial do mouse
    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;

    startX = (imageWidth / 100) * coordenadas.InicioX;
    endX = (imageWidth / 100) * coordenadas.FimX;

    startY = (imageHeight / 100) * coordenadas.InicioY;
    endY = (imageHeight / 100) * coordenadas.FimY;

    ctx.clearRect(0, 0, ctx.width, ctx.height);

    ctx.strokeStyle = coordenadas.Cor;

    var width = endX - startX;
    var height = endY - startY;

    var clickPosition = 0;

    //Capturar o evento de click do mouse
    $("#canvas").mousedown(function (e) {

        let mouseX = document.documentElement.scrollLeft;
        let mouseY = document.documentElement.scrollTop;

        // Salvar as coordenadas X e Y do início do retângulo
        // let clickX = parseInt((e.clientX - offsetX) + mouseX);
        // let clickY = parseInt((e.clientY - offsetY) + mouseY);

        // // Definir o flag que indica que um retângulo está sendo desenhado agora
        // isDown = true;

        let larguraQuadro = (endX - startX) / 3;
        let alturaQuadro = (endY - startY) / 3;

        var larguraTerco1 = startX + larguraQuadro;
        var alturaTerco1 = startY + alturaQuadro;

        var larguraTerco2 = startX + (larguraQuadro * 2);
        var alturaTerco2 = startY + (alturaQuadro * 2);

        var larguraTerco3 = startX + (larguraQuadro * 3);
        var alturaTerco3 = startY + (alturaQuadro * 3);

        // // Pegar o click de coluna 1
        // if (clickX > startX && clickX <= (larguraTerco1)) {

        //     // Pegar o click de linha
        //     if (clickY > startY && clickY <= (alturaTerco1)) {
        //         // alert("7");
        //         clickPosition = 7;
        //     }
        //     else if (clickY > alturaTerco1 && clickY <= alturaTerco2) {
        //         // alert("8");
        //         clickPosition = 8;
        //     }
        //     else if (clickY > alturaTerco2 && clickY <= alturaTerco3) {
        //         // alert("9");
        //         clickPosition = 9;
        //     }
        // }
        // // Pegar o click de coluna 2
        // else if (clickX > larguraTerco1 && clickX <= larguraTerco2) {

        //     // Pegar o click de linha
        //     if (clickY > startY && clickY <= (alturaTerco1)) {
        //         // alert("4");
        //         clickPosition = 4;
        //     }
        //     else if (clickY > alturaTerco1 && clickY <= alturaTerco2) {
        //         // alert("5");
        //         clickPosition = 5;
        //     }
        //     else if (clickY > alturaTerco2 && clickY <= alturaTerco3) {
        //         // alert("6");
        //         clickPosition = 6;
        //     }
        // }
        // // Pegar o click de coluna 3
        // else if (clickX > larguraTerco2 && clickX <= larguraTerco3) {

        //     // Pegar o click de linha
        //     if (clickY > startY && clickY <= (alturaTerco1)) {
        //         // alert("1");
        //         clickPosition = 1;
        //     }
        //     else if (clickY > alturaTerco1 && clickY <= alturaTerco2) {
        //         // alert("2");
        //         clickPosition = 2;
        //     }
        //     else if (clickY > alturaTerco2 && clickY <= alturaTerco3) {
        //         // alert("3");
        //         clickPosition = 3;
        //     }
        // }

        // for (coluna = 3; coluna >= 1; coluna--) {
        //     for (linha = 1; linha <= 3; linha++) {
        //         if (coluna == clickPosition && linha == clickPosition) {

        //             var combo = document.getElementById("subareaID");
        //             console.log(combo.value);
        //             combo.value = parseInt(clickPosition);
        //         }
        //     }
        // }
    });

    if (divideEmPartes == 1) {
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
        ctx.fillStyle = coordenadas.Cor;
        ctx.textAlign = "center";
        var numeroQuadrante = 1;
        // for (coluna = 3; coluna >= 1; coluna--) {
        //     for (linha = 1; linha <= 3; linha++) {
        //         var quadrante = [larguraTerco * (coluna - 0.5), alturaTerco * (linha - 0.30)];
        //         ctx.fillText(numeroQuadrante, startX + quadrante[0], startY + quadrante[1]);
        //         numeroQuadrante++;
        //     }
        // }
    }
    else if (divideEmPartes == 0) {
        $('#subAreaCombo').addClass("hidden");
    }

    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  }
















  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  loadPartes(){
    this.authService.showLoading();
    this.avariaService.listarPartes({
      chassi: this.formData.chassi,
    })
    .subscribe(res => {
      this.partesAvaria = res.retorno;
      this.loadPosicaoAvaria();
    });
  }

  loadPosicaoAvaria(){
    this.avariaService.carregarPosicaoAvarias()
    .subscribe(res => {
      this.posicoesAvaria = res.retorno;
      this.loadTipoAvaria();
    });
  }

  loadTipoAvaria(){
    this.avariaService.carregarTipoAvarias()
    .subscribe(res => {
      this.tiposAvaria = res.retorno;
      this.loadGravidade();
    })
  }

  loadGravidade(){
    this.gravidadeService.carregarGravidades()
    .subscribe(res => {
      this.nivelGravidadeAvaria = res.retorno;
      this.authService.hideLoading();
    })
  }

  selectTipoAvariaChange(event:any){
    this.tipoAvaria = this.tiposAvaria.filter(x => x.id == event).map(x => x)[0]
    this.formSelecaoSuperficie.patchValue({
      tipoAvaria: this.tipoAvaria.nome
    });
  }

  selectPosicaoAvariaChange(event){
    this.posicaoAvaria = this.posicoesAvaria.filter(x => x.id == event).map(x => x)[0]
    this.formSelecaoSuperficie.patchValue({
      posiçãoAvaria: this.posicaoAvaria.nome
    });
  }

  selectPartesAvariaChange(event){
    this.parteAvaria = this.partesAvaria.filter(x => x.id == event).map(x => x)[0]
    this.formSelecaoSuperficie.patchValue({
      posiçãoAvaria: event
    });

    this.onSuperficieParteChassiInputed.emit(this.parteAvaria.superficieChassiParte);
  }




  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFile(file))
        })
        .catch(err => {
            this.presentToast('Erro ao ler o arquivo.');
        });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        formData.append('file', imgBlob, file.name);
        this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {

    // const loading = await this.loadingController.create({
    //     message: 'Carregando imagem...',
    // });
    // await loading.present();

    // this.http.post("http://localhost:9945/uploadImage", formData)
    //     .pipe(
    //         finalize(() => {
    //             loading.dismiss();
    //         })
    //     )
    //     .subscribe(res => {
    //         if (res['success']) {
    //             this.presentToast('File upload complete.')
    //         } else {
    //             this.presentToast('File upload failed.')
    //         }
    //     });
  }

  // loadStoredImages() {
  //   this.storage.get(STORAGE_KEY).then(images => {
  //     if (images) {
  //       let arr = JSON.parse(images);
  //       this.images = [];
  //       for (let img of arr) {
  //         let filePath = this.file.dataDirectory + img;
  //         let resPath = this.pathForImage(filePath);
  //         this.images.push({ name: img, path: resPath, filePath: filePath });
  //       }
  //     }
  //   });
  // }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  async selectImage() {
      const actionSheet = await this.actionSheetController.create({
          title: 'Selecionar imagem',
          buttons: [{
                  text: 'Galeria',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                  }
              },
              {
                  text: 'Camera',
                  handler: () => { this.takePicture(this.camera.PictureSourceType.CAMERA); }
              },
              { text: 'Cancelar', role: 'cancel' }
          ]
      });
      await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
      var options: CameraOptions = {
          quality: 100,
          sourceType: sourceType,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };

      this.camera.getPicture(options).then(imagePath => {
          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
              this.filePath.resolveNativePath(imagePath)
                  .then(filePath => {
                      let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                      let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                  });
          } else {
              var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
              var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
      });

  }

  createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
          this.updateStoredImages(newFileName);
      }, error => {
          this.presentToast('Erro ao salvar o arquivo.');
      });
  }

  updateStoredImages(name) {
      this.storage.get(STORAGE_KEY).then(images => {
          let arr = JSON.parse(images);
          if (!arr) {
              let newImages = [name];
              this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
          } else {
              arr.push(name);
              this.storage.set(STORAGE_KEY, JSON.stringify(arr));
          }

          let filePath = this.file.dataDirectory + name;
          let resPath = this.pathForImage(filePath);

          let newEntry = {
              name: name,
              path: resPath,
              filePath: filePath
          };

          this.images = [newEntry, ...this.images];
          this.ref.detectChanges();
      });
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.presentToast('File removed.');
        });
    });
  }

  voltar(){
    // this.navCtrl.push(QualidadeMenuPage);
    this.view.dismiss();
    // const chassiModal: Modal = this.modal.create(QualidadeMenuPage, {
    //   data: this.formData
    // });
    // chassiModal.present();
  }
}
