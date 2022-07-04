import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, Content, ModalController, NavController, NavParams, Platform, ToastController, ViewController, LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';

import { File, FileEntry } from '@ionic-native/File';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path';
import { CameraOptions, PictureSourceType } from '@ionic-native/camera/index';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';
import { PosicaoSuperficieChassi } from '../../model/PosicaoSuperficieChassi';
import { Parte } from '../../model/parte';
import { SuperficieChassiParte } from '../../model/superficieChassiParte';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators';
import { Avaria } from '../../model/avaria';
import { Veiculo } from '../../model/veiculo';
import { Momento } from '../../model/Momento';
import { GravidadeAvaria } from '../../model/gravidadeAvaria';
import { OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

// const IMAGE_DIR = '';
const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'page-lancamento-avaria-selecao-superficie',
templateUrl: 'lancamento-avaria-selecao-superficie.html',
  // providers: [Camera]
})
export class LancamentoAvariaSelecaoSuperficiePage { //implements OnInit {
  title: string;
  avarias: Array<Avaria> = [];
  posicoesAvaria: Array<PosicaoSuperficieChassi> = [];
  gravidadesAvaria: Array<GravidadeAvaria> = [];
  partesAvaria: Array<Parte> = [];
  formSelecaoSuperficie: FormGroup;

  images: any[] = [];
  convertedImages: FormData[] = [];

  avaria = new Avaria();
  posicaoAvaria = new PosicaoSuperficieChassi();
  parteAvaria = new Parte();
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
    id: 0,
    observacao: '',
    quadrante: null,

    veiculo: new Veiculo(),
    momento: new Momento(),
    posicaoSuperficieChassi: new PosicaoSuperficieChassi(),
    superficieChassiParte: new SuperficieChassiParte(),
    avaria: new Avaria(),
    tipoAvaria: new TipoAvaria(),
    gravidadeAvaria: new GravidadeAvaria()
  };

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  private view: ViewController,
  private formBuilder: FormBuilder,
  private platform: Platform,
  // private camera: Camera,
  private file: File,
  private webview: WebView,
  private actionSheetController: ActionSheetController,
  private toastController: ToastController,
  private storage: Storage,
  private ref: ChangeDetectorRef,
  private filePath: FilePath,
  public alertService: AlertService,

  private modal: ModalController,
  private avariaService: AvariaDataService,
  private gravidadeService: GravidadeDataService,
  public authService: AuthService,
) {
    this.title = 'Lançamento de Avaria';
    let data = this.navParams.get('data');
    this.formData = data;

    let posicaoAvaria = this.formData.posicaoSuperficieChassi == undefined ? '' : this.formData.posicaoSuperficieChassi.id;
    let superficieChassiParte = this.formData.superficieChassiParte == undefined ? '' : this.formData.superficieChassiParte.parteID;
    let tipoAvaria = this.formData.avaria == undefined ? '' : this.formData.avaria.tipoAvaria.id;
    let subArea = this.formData.quadrante == undefined ? '' : this.formData.quadrante;
    let gravidadeAvaria = this.formData.gravidadeAvaria == undefined ? '' : this.formData.gravidadeAvaria.id;
    let observacao = this.formData.observacao == undefined ? '' : this.formData.observacao;

    this.formSelecaoSuperficie = formBuilder.group({
      chassi: [this.formData.veiculo.chassi, Validators.required],
      modelo: [this.formData.veiculo.modelo, Validators.required],
      partePeca: [false, Validators.required],


      posicaoAvaria: [posicaoAvaria, Validators.required],
      superficieChassiParte: [superficieChassiParte, Validators.required],
      tipoAvaria: [tipoAvaria, Validators.required],
      subArea: [subArea],
      gravidadeAvaria: [gravidadeAvaria, Validators.required],
      observacao: [observacao],
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

  // async ngOnInit() {
  //   this.loadFiles();
  // }

  ionViewWillEnter() {
    this.authService.showLoading();

    if (this.formData.veiculo.chassi) {
      this.avariaService.consultarChassi({
        chassi: this.formData.veiculo.chassi,
        token: ''
      })
      .subscribe((res: any) => {
        // this.urlImagem = res.retorno.imagem;
        this.urlImagem = res.retorno.imagem;

        let imagem = document.getElementById('image')
        this.width = imagem.clientWidth;
        this.height = (imagem.clientHeight * 10); //+ 3;

        this.getImageDimenstion(this.width,this.height);

        if (this.formData.id > 0) {
          this.assembleGrid(this.formData.superficieChassiParte);
        }

        this.loadPartes();
      });
    }
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  styleObject(): Object {
    return {
      'background-color': this.avaria.tipoAvaria.cor,
      'transform': "translate(" + this.abcissaX + "px," + this.ordenadaY + "px)",
    }
  }

  getImageDimenstion(width: number, height: number){
    this.canvasElement = this.canvas.nativeElement;
    this.platform.width() + '';
    // this.canvasElement.height = height;
    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }

  loadPartes(){
    this.avariaService.listarPartes({
      chassi: this.formData.veiculo.chassi,
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
      this.avarias = res.retorno;
      this.loadGravidade();
    })
  }

  loadGravidade(){
    this.gravidadeService.carregarGravidades()
    .subscribe(res => {
      if (this.formData.superficieChassiParte && this.formData.superficieChassiParte.tipoSelecao == 1) {
        $('#subAreaCombo').removeClass("hidden");
      }

      this.gravidadesAvaria = res.retorno;
      this.authService.hideLoading();
    })
  }

  selectTipoAvariaChange(id:number){
    this.avaria = this.avarias.filter(x => x.id == id).map(x => x)[0]
    this.formSelecaoSuperficie.patchValue({
      // tipoAvaria: this.avaria.tipoAvaria.nome,
      partePeca: true
    });

    if(this.divideEmPartes == 1){
      if (this.formSelecaoSuperficie.controls.subArea.value > 0) {
        let pos = this.posicoesSubArea.filter(x => x.posicao == this.formSelecaoSuperficie.controls.subArea.value).map(x => x)[0];
        this.abcissaX = pos.coordenadaX;
        this.ordenadaY = pos.coordenadaY;
      }
      // else if(this.formSelecaoSuperficie.controls.subArea.value == 0){
      //   let pos = this.posicoesSubArea.filter(x => x.posicao == 1).map(x => x)[0];
      //   this.abcissaX = pos.coordenadaX;
      //   this.ordenadaY = pos.coordenadaY;
      // }
    }
    else if (this.divideEmPartes == 0){
      this.abcissaX = this.radiusX;
      this.ordenadaY = this.radiusY;
    }
  }

  selectPosicaoAvariaChange(event){
    this.posicaoAvaria = this.posicoesAvaria.filter(x => x.id == event).map(x => x)[0]
    // this.formSelecaoSuperficie.patchValue({
    //   posicaoAvaria: this.posicaoAvaria.nome
    // });
  }

  selectPartesAvariaChange(event){
    this.parteAvaria = this.partesAvaria.filter(x => x.id == event).map(x => x)[0]
    this.formSelecaoSuperficie.patchValue({
      // posicaoAvaria: event,
      partePeca: false,
    });

    this.assembleGrid(this.parteAvaria.superficieChassiParte);
  }

  selectSubareaChange(subArea: number){
    let pos = this.posicoesSubArea.filter(x => x.posicao == subArea).map(x => x)[0];
    this.abcissaX = pos.coordenadaX;
    this.ordenadaY = pos.coordenadaY;
  }

  selectGravidadeChange(id){
    this.gravidadeAvaria = this.gravidadesAvaria.filter(x => x.id == id).map(x => x)[0]
    // this.formSelecaoSuperficie.patchValue({
    //   gravidadeAvaria: this.gravidadeAvaria.nome
    // });

    // this.assembleGrid(this.parteAvaria.superficieChassiParte);
  }

  touched(event){
    // this.ordenadaY = -245;

    // var canvasPosition = this.canvasElement.getBoundingClientRect();
    // this.saveX = event.touches[0].pageX - canvasPosition.x;
    // this.saveY = event.touches[0].pageY - canvasPosition.y;

    // this.abcissaX = event.touches[0].pageX - canvasPosition.x;
    // this.ordenadaY -= ((event.touches[0].pageY - canvasPosition.y)* -1);
  }

  moved(event) {
    // var canvasPosition = this.canvasElement.getBoundingClientRect();

    // let ctx = this.canvasElement.getContext('2d');
    // let currentX = event.touches[0].pageX - canvasPosition.x;
    // let currentY = event.touches[0].pageY - canvasPosition.y;

    // ctx.lineJoin = 'round';
    // ctx.strokeStyle = '#FF0000';
    // ctx.lineWidth = 3;

    // ctx.beginPath();
    // ctx.moveTo(this.saveX, this.saveY);
    // ctx.lineTo(currentX, currentY);
    // ctx.closePath();

    // ctx.stroke();

    // this.saveX = currentX;
    // this.saveY = currentY;
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
    var $canvas = $("#canvas");
    var canvasOffset = $canvas.offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var scrollX = $canvas.scrollLeft();
    var scrollY = $canvas.scrollTop();
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

    // var clickPosition = 0;

    //Capturar o evento de click do mouse
    // $("#canvas").mousedown(function (e) {

    //     let mouseX = document.documentElement.scrollLeft;
    //     let mouseY = document.documentElement.scrollTop;

    //     // Salvar as coordenadas X e Y do início do retângulo
    //     let clickX = (e.clientX - offsetX) + mouseX;
    //     let clickY = (e.clientY - offsetY) + mouseY;
    //     this.abcissaX = (e.clientX - offsetX) + mouseX;
    //     this.ordenadaY = (e.clientY - offsetY) + mouseY;

    //     let larguraQuadro = (endX - startX) / 3;
    //     let alturaQuadro = (endY - startY) / 3;

    //     var larguraTerco1 = startX + larguraQuadro;
    //     var alturaTerco1 = startY + alturaQuadro;

    //     var larguraTerco2 = startX + (larguraQuadro * 2);
    //     var alturaTerco2 = startY + (alturaQuadro * 2);

    //     var larguraTerco3 = startX + (larguraQuadro * 3);
    //     var alturaTerco3 = startY + (alturaQuadro * 3);

    //     // Pegar o click de coluna 1
    //     if (clickX > startX && clickX <= (larguraTerco1)) {

    //       // Pegar o click de linha
    //       if (clickY > startY && clickY <= (alturaTerco1)) {
    //         clickPosition = 7;
    //       }
    //       else if (clickY > alturaTerco1 && clickY <= alturaTerco2) {
    //         clickPosition = 8;
    //       }
    //       else if (clickY > alturaTerco2 && clickY <= alturaTerco3) {
    //         clickPosition = 9;
    //       }
    //     }
    //     // Pegar o click de coluna 2
    //     else if (clickX > larguraTerco1 && clickX <= larguraTerco2) {
    //       // Pegar o click de linha
    //       if (clickY > startY && clickY <= (alturaTerco1)) {
    //         clickPosition = 4;
    //       }
    //       else if (clickY > alturaTerco1 && clickY <= alturaTerco2) {
    //         clickPosition = 5;
    //       }
    //       else if (clickY > alturaTerco2 && clickY <= alturaTerco3) {
    //         clickPosition = 6;
    //       }
    //     }
    //     // Pegar o click de coluna 3
    //     else if (clickX > larguraTerco2 && clickX <= larguraTerco3) {
    //       // Pegar o click de linha
    //       if (clickY > startY && clickY <= (alturaTerco1)) {
    //         clickPosition = 1;
    //       }
    //       else if (clickY > alturaTerco1 && clickY <= alturaTerco2) {
    //         clickPosition = 2;
    //       }
    //       else if (clickY > alturaTerco2 && clickY <= alturaTerco3) {
    //         clickPosition = 3;
    //       }
    //     }

    //     for (let coluna = 3; coluna >= 1; coluna--) {
    //       for (let linha = 1; linha <= 3; linha++) {
    //         if (coluna == clickPosition && linha == clickPosition) {
    //           var combo = document.getElementById("subareaID");
    //           // console.log(combo.value);
    //           // combo.value = parseInt(clickPosition);
    //         }
    //       }
    //     }
    // });

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
                numeroQuadrante++;
            }
        }
    }
    else if (this.divideEmPartes == 0) {
        $('#subAreaCombo').addClass("hidden");
    }

    // this.radiusX =
    // this.radiusY =
    this.radiusX = startX + ((endX - startX)/2);
    this.radiusY = startY + ((endY - startY)/2);
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  }

  voltar(){
    this.navCtrl.push(QualidadeMenuPage);
    // this.view.dismiss();
    // const chassiModal: Modal = this.modal.create(QualidadeMenuPage, {
    //   data: this.formData
    // });
    // chassiModal.present();
  }

  save(){
    this.authService.showLoading();

    this.images.forEach(image => {
      this.convertBase64ToFormData(image.path);
    });

    let model  = {
      id: this.formData.id > 0 ? this.formData.id : 0,
      veiculoID: this.formData.veiculo.id > 0 ? this.formData.veiculo.id : 0,
      momentoID: this.formData.momento.id > 0 ? this.formData.momento.id : 0,
      posicaoSuperficieChassiID: this.posicaoAvaria.id != undefined ? this.posicaoAvaria.id : this.formSelecaoSuperficie.controls.posicaoAvaria.value,
      avariaID: this.avaria.id != undefined ? this.avaria.id : this.formData.avaria.id,
      tipoAvariaID: this.avaria.id != undefined ? this.avaria.tipoAvaria.id : this.formData.avaria.tipoAvaria.id,
      parteID: this.parteAvaria.id != undefined ? this.parteAvaria.id : this.formData.superficieChassiParte.parteID,
      superficieChassiParteID: this.parteAvaria.id != undefined ? this.parteAvaria.superficieChassiParte.id : this.formData.superficieChassiParte.superficieChassiID,
      gravidadeAvariaID: this.gravidadeAvaria.id != undefined ? this.gravidadeAvaria.id : this.formData.gravidadeAvaria.id,
      nivelGravidadeAvariaID: this.gravidadeAvaria.id != undefined ? this.gravidadeAvaria.nivelGravidadeAvaria.id : this.formData.gravidadeAvaria.nivelGravidadeAvaria.id,
      observacao: this.formSelecaoSuperficie.controls.observacao.value,
      quadrante: this.formSelecaoSuperficie.controls.subArea.value,
      formFile: this.convertedImages
    };

    this.avariaService.salvar(model)
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
        if (model.id > 0) {
          this.alertService.showInfo('Avaria alterada com sucesso');
        }
        else{
          this.alertService.showInfo('Avaria cadastrada com sucesso');
        }
        setTimeout(() => {
          this.voltar();
        }, 500);
      })
    )
    .subscribe((response:any) => {
      console.log(response);
    }, (error: any) => {
      this.alertService.showError('Erro ao salvar avaria');
    });
  }





  /// Selecionar uma imagem da biblioteca do dispositivo
  // selectImage() {
  //   const actionSheet = this.actionSheetController.create({
  //       title: 'Selecionar imagem',
  //       buttons: [{
  //               text: 'Galeria',
  //               handler: () => {
  //                 this.setImage(CameraSource.Photos);
  //               }
  //           },
  //           {
  //               text: 'Camera',
  //               handler: () => {
  //                 this.setImage(CameraSource.Camera);
  //               }
  //           },
  //           {
  //             text: 'Cancelar', role: 'cancel'
  //           }
  //       ]
  //   });
  //   actionSheet.present();
  // }

  // async setImage(sourceType: CameraSource) {
  async selectImage() {

    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    if (image) {
      this.saveImage(image)
    }
  }

  // Criar novo arquivo para a captura de imagem
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + '.jpeg';

    this.images.push({
      path: base64Data,
      name: fileName
    });

    // const savedFile = await Filesystem.writeFile({
    //     path: `${IMAGE_DIR}/${fileName}`,
    //     data: base64Data,
    //     directory: Directory.Documents
    // });
    // Recarregar a lista de arquivos
    // this.loadFileData(array);
  }

  // async loadFiles() {
  //   this.images = [];

  //   Filesystem.readdir({
  //     path: IMAGE_DIR,
  //     directory: Directory.Data,
  //   }).then(result => {
  //     this.loadFileData(result.files);
  //   },
  //     async (err) => {
  //       // Pasta ainda não existe!
  //       await Filesystem.mkdir({
  //         path: IMAGE_DIR,
  //         directory: Directory.Data,
  //       });
  //     }
  //   ).then(_ => {
  //     this.authService.hideLoading();
  //   });
  // }

  // async loadFiles() {
  //   try {
  //     let files = await Filesystem.readdir({
  //       path: IMAGE_DIR,
  //       directory: Directory.Documents
  //     }).then(result => {
  //       console.log("Diretorio existente e Arquivos carregados");
  //       alert("Diretorio existente e Arquivos carregados");
  //     });
  //   } catch (e) {
  //     let ret = await Filesystem.mkdir({
  //       path: IMAGE_DIR,
  //       directory: Directory.Documents,
  //       recursive: false,
  //     });
  //     console.log("Diretorio não existente, foi criado com os arquivo do Directory");
  //     alert("Diretorio não existente, foi criado com os arquivo do Directory");
  //   }
  // }


  // Obter os dados da imagem em base64

  // async loadFileData(files: string[]) {
  //   for (let file of files) {
  //     const filePath = `${IMAGE_DIR}/${file}`;

  //     const readFile = await Filesystem.readFile({
  //       path: filePath,
  //       directory: Directory.Data,
  //     });

  //     this.images.push({
  //       name: file,
  //       path: filePath,
  //       data: `data:image/jpeg;base64,${readFile.data}`,
  //     });
  //   }
  // }

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
          path: photo.path
      });

      return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  convertBase64ToFormData(fileToUpload: string){
    let input = new FormData();
    input.append("", fileToUpload);

    this.convertedImages.push(input);
  }

  // Converte de base64 para blob data e crie formData com ele
  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name);
    this.uploadData(formData);
  }

  // Upload o formData para a API
  async uploadData(formData: FormData) {
    this.authService.showLoading();

    this.avariaService.uploadImagens(formData)
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe((response: any) => {
      var data = response;
      console.log(data);
    }, (error:any) => {
      console.log(error);
    });
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
        directory: Directory.Data,
        path: file.path
    });
    // this.loadFiles();
  }
}
