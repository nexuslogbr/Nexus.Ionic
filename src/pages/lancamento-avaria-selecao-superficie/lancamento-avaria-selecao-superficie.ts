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
  urlImagem = 'http://nexus.luby.com.br/Arquivos/Empresas/';
  // @ViewChild('tipoAvaria') tipoAvaria: Select;
  tipoAvaria = new TipoAvaria();
  posicaoAvaria = new PosicaoSuperficieChassi();
  parteAvaria = new Parte();
  @Output() onSuperficieParteChassiInputed: EventEmitter<SuperficieChassiParte> = new EventEmitter<SuperficieChassiParte>();

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;

  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;

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

    if (this.formData.chassi) {
      this.avariaService.consultarChassi({
        chassi: this.formData.chassi,
        token: ''}).subscribe((res: any) => {
          this.urlImagem += res.retorno.imagem;
          this.canvas = this.urlImagem;
        });
      }

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
      this.loadPartes();

      // https://github.com/ionic-team/ionic/issues/9071#issuecomment-362920591
    // Get the height of the fixed item
    // let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    let scroll = this.content.getScrollElement();

    // Add preexisting scroll margin to fixed container size
    // itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
    // scroll.style.marginTop = itemHeight + 'px';
    }

    ionViewDidLoad() {
      // Set the Canvas Element and its size
      this.canvasElement = this.canvas.nativeElement;
      this.canvasElement.width = 381;
      this.canvasElement.height = 241;
    }

    touched(event){
      var canvasPosition = this.canvasElement.getBoundingClientRect();
      this.saveX = event.touches[0].pageX - canvasPosition.x;
      this.saveY = event.touches[0].pageY - canvasPosition.y;
    }

    startDrawing(event){
      var canvasPosition = this.canvasElement.getBoundingClientRect();

      this.saveX = event.touches[0].pageX - canvasPosition.x;
      this.saveY = event.touches[0].pageY - canvasPosition.y;
    }

    moved(event) {
      var canvasPosition = this.canvasElement.getBoundingClientRect();

      let ctx = this.canvasElement.getContext('2d');
      let currentX = event.touches[0].pageX - canvasPosition.x;
      let currentY = event.touches[0].pageY - canvasPosition.y;

      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(this.saveX, this.saveY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();

      ctx.stroke();

      this.saveX = currentX;
      this.saveY = currentY;
    }

    saveCanvasImage() {
      var dataUrl = this.canvasElement.toDataURL();

      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

      var data = dataUrl.split(',')[1];
    }

    storeImage(imageName) {
      let saveObj = { img: imageName };
      // this.storedImages.push(saveObj);
      // this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      //   setTimeout(() =>  {
      //     this.content.scrollToBottom();
      //   }, 500);
      // });
    }

    getImagePath(imageName) {
      let path = this.urlImagem;
      // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
      path = normalizeURL(path);
      return path;
    }

    // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
    b64toBlob(b64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 512;
      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
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
    this.navCtrl.push(QualidadeMenuPage);
    // this.view.dismiss();
    // const chassiModal: Modal = this.modal.create(QualidadeMenuPage, {
    //   data: this.formData
    // });
    // chassiModal.present();
  }
}
