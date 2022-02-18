import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, LoadingController, NavController, NavParams, Platform, ToastController, ViewController } from 'ionic-angular';
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

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'page-lancamento-avaria-selecao-superficie',
  templateUrl: 'lancamento-avaria-selecao-superficie.html',
  providers: [Camera]
})
export class LancamentoAvariaSelecaoSuperficiePage {
  title: string;
  tiposAvaria: Array<TipoAvaria> = [];
  nivelGravidadeAvaria: Array<NivelGravidadeAvaria> = [];
  formSelecaoSuperficie: FormGroup;
  imagePath = '../../assets/images/camera-model.png';
  images = [];

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
    private avariaService: AvariaDataService,
    private gravidadeService: GravidadeDataService,
    private view: ViewController,
    private formBuilder: FormBuilder,
    private platform: Platform,
    public authService: AuthService,

    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath
  ) {
    this.title = 'Lançamento de Avaria';
    // this.formData = this.navParams.get('data');

    this.formData.chassi = "3GNAX9EX9JS513954"
    this.formData.id = 5304
    this.formData.modelo = "EQUINOX"
    this.formData.momento = ""
    this.formData.posicaoAtual = "Principal - T3 - 3 - 5"
    this.formData.status = "Carregado"

    this.formSelecaoSuperficie = formBuilder.group({
      observacao: [this.formData.observacao],
      chassi: [this.formData.chassi, Validators.required],
      modelo: [this.formData.modelo, Validators.required],
      tipoAvaria: ['', Validators.required]
    });
  }

  ionViewDidEnter() {
    this.loadGravidade();
    this.loadTipoAvaria();
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  loadTipoAvaria(){
    this.authService.showLoading();
    this.avariaService.carregarTipoAvarias()
    .subscribe(res => {
      this.tiposAvaria = res.retorno;
      this.authService.hideLoading();
    })
  }

  loadPosicaoAvaria(){
    // this.
  }

  loadGravidade(){
    this.gravidadeService.carregarGravidades()
    .subscribe(res => {
      this.nivelGravidadeAvaria = res.retorno;
    })
  }

  onTipoAvariaChange(event){
    this.formSelecaoSuperficie.patchValue({
      tipoAvaria: event
    });
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

    // this.http.post("http://localhost:8888/upload.php", formData)
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

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

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
    this.view.dismiss();
    this.navCtrl.push(LancamentoAvariaPage);
  }
}
