import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, Platform } from 'ionic-angular';
import * as $ from 'jquery';
import { NivelGravidadeAvaria } from '../../model/NivelGravidadeAvaria';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
// import { Directory, Filesystem } from '@capacitor/filesystem'
import { CustomEvent } from 'events'

const IMAGE_DIR = 'stored-images';

@Component({
  selector: 'page-lancamento-avaria-selecao-superficie',
  templateUrl: 'lancamento-avaria-selecao-superficie.html',
})
export class LancamentoAvariaSelecaoSuperficiePage {
  title: string;
  tiposAvaria: Array<TipoAvaria> = [];
  nivelGravidadeAvaria: Array<NivelGravidadeAvaria> = [];
  formSelecaoSuperficie: FormGroup;
  imagePath = '../../assets/images/camera-model.png';

  formData = {
    chassi: '',
    modelo: '',
    posicaoAtual: '',
    cor: '',
    status: '',
    observacao: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private avariaService: AvariaDataService,
    private gravidadeService: GravidadeDataService,
    private formBuilder: FormBuilder,
    private platform: Platform
  ) {
    this.title = 'Lançamento de Avaria';
    this.formData = this.navParams.get('data');

    this.formSelecaoSuperficie = formBuilder.group({
      observacao: [this.formData.observacao],
      chassi: [this.formData.chassi, Validators.required],
      modelo: [this.formData.modelo, Validators.required],
      tipoAvaria: ['', Validators.required]
    });
  }

  ionViewDidEnter() {
    this.loadTipoAvaria();
    this.loadGravidade();
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  loadTipoAvaria(){
    this.avariaService.carregarTipoAvarias()
    .subscribe(res => {
      this.tiposAvaria = res.retorno;
    })
  }

  loadPosicaoAvaria(){
    // this.
  }

  loadGravidade(){
    this.gravidadeService.carregarGravidades()
    .subscribe(res => {
      this.nivelGravidadeAvaria = res.retorno
    })
  }

  onTipoAvariaChange(event){
    this.formSelecaoSuperficie.patchValue({
      tipoAvaria: event
    });
  }

  // async selectImage(){
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Photos
  //   });

  //   console.log(image);
  //   if (image) {
  //     this.saveImage(image);
  //   }
  // }

  // async saveImage(image:Photo){
  //   const base64Data = await this.readAsBase64(image);
  //   console.log(base64Data);

  //   const fileName = new Date().getTime() + '.jpeg';
  //   const savedImage = await Filesystem.writeFile({
  //     directory: Directory.Data,
  //     path: `${IMAGE_DIR}/${fileName}`,
  //     data: base64Data
  //   });

  //   console.log('Saved: ', savedImage);
  // }

  //  async readAsBase64(photo: Photo) {
  //   // "hybrid" will detect Cordova or Capacitor
  //   if (this.platform.is('hybrid')) {
  //     // Read the file into base64 format
  //     const file = await Filesystem.readFile({
  //       path: photo.path
  //     });

  //     return file.data;
  //   }
  //   else {
  //     // Fetch the photo, read as a blob, then convert to base64 format
  //     const response = await fetch(photo.webPath);
  //     const blob = await response.blob();

  //     return await this.convertBlobToBase64(blob) as string;
  //   }
  // }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    }
    reader.readAsDataURL(blob);
  });
}
