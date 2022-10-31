import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, Content, Modal, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import * as $ from 'jquery';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';
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
@Component({
  selector: 'page-lancamento-avaria-vistoria',
  templateUrl: 'lancamento-avaria-vistoria.html',
})
export class LancamentoAvariaVistoriaPage {
  title: string;
  avarias: Array<Avaria> = [];
  gruposAvaria: Array<GrupoSuperficieChassi> = [];
  gravidadesAvaria: Array<GravidadeAvaria> = [];
  nivelGravidadesAvaria: Array<NivelGravidadeAvaria> = [];
  responsabilidadeAvarias: Array<ResponsabilidadeAvaria> = [];
  partesAvaria: Array<Parte> = [];
  formSelecaoSuperficie: FormGroup;

  images: any[] = [];
  imagesToSend: any[] = [];

  avaria = new Avaria();
  grupoAvaria = new GrupoSuperficieChassi();
  parteAvaria = new Parte();
  gravidadeAvaria = new GravidadeAvaria();
  nivelGravidadeAvaria = new NivelGravidadeAvaria();
  responsabilidadeAvaria = new ResponsabilidadeAvaria();

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
  formData = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    public alertService: AlertService,
    private avariaService: AvariaDataService,
    private gravidadeService: GravidadeDataService,
    public authService: AuthService,
    private alertController: AlertController,
    private modal: ModalController,
    private view: ViewController,
    private responsabilidadeAvariaService: ResponsabilidadeAvariaDataService
  ) {
    this.title = 'Selecione a área';

    this.formSelecaoSuperficie = formBuilder.group({
      chassi: null,
      modelo: null,
      partePeca: null,
      grupoAvaria: null,
      superficieChassiParte: null,
      tipoAvaria: null,
      subArea: null,
      gravidadeAvaria: null,
      nivelGravidadeAvaria: null,
      responsabilidadeAvaria: null,
      observacao: null,
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

  ionViewWillLoad() {
    const data = this.navParams.get('data');
    this.formData = data;
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
    this.ordenadaY = 0;
    this.abcissaX = 0;

    this.ordenadaY = 4;

    // Obter as coordenadas X e Y do do click na imagem
    var canvasPosition = this.canvasElement.getBoundingClientRect();
    this.ordenadaY -= (event.touches[0].pageY - canvasPosition.y) * -1;
    this.abcissaX = event.touches[0].pageX - canvasPosition.x;

    // Obter a dimensoões da imagem
    let imagem = document.getElementById('image')
    let imagemLargura = imagem.clientWidth;
    let imagemAltura = imagem.clientHeight;
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
      this.formSelecaoSuperficie.patchValue({
        superficieChassiParte: null,
        tipoAvaria: null,
        partePeca: false
      });

      this.formSelecaoSuperficie.controls.superficieChassiParte.enable();
      this.formSelecaoSuperficie.controls.tipoAvaria.disable();

      this.grupoAvaria = this.gruposAvaria.filter(x => x.id == event).map(x => x)[0];

      this.avariaService.listarPartes({
        grupoSuperficieChassiID: this.grupoAvaria.id
       })
       .subscribe((x:DataRetorno) => {
        this.partesAvaria = x.retorno;
        this.authService.hideLoading();
       });
    }
  }

  selectPartesAvariaChange(event){
    if (event.length > 0) {
      this.parteAvaria = this.partesAvaria.filter(x => x.id == event).map(x => x)[0];
      this.formSelecaoSuperficie.patchValue({
        tipoAvaria: null,
        partePeca: false,
      });

      this.formSelecaoSuperficie.controls.tipoAvaria.enable();
      this.formSelecaoSuperficie.controls.partePeca.enable();
    }
  }

  selectTipoAvariaChange(id:number){
    this.avaria = this.avarias.filter(x => x.tipoAvaria.id == id).map(x => x)[0];
    this.formSelecaoSuperficie.patchValue({
      partePeca: true
    });

    if(this.divideEmPartes == 1){
      if (this.formSelecaoSuperficie.controls.subArea.value > 0) {
        let pos = this.posicoesSubArea.filter(x => x.posicao == this.formSelecaoSuperficie.controls.subArea.value).map(x => x)[0];
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
      this.nivelGravidadesAvaria = this.gravidadeAvaria.nivelGravidadeAvaria;
    }
    else{
      this.nivelGravidadesAvaria = [];
    }
  }

  selectNivelGravidadeChange(id){
    this.nivelGravidadeAvaria = this.nivelGravidadesAvaria.filter(x => x.id == id).map(x => x)[0]
  }

  selectResponsabilidadeAvariaChange(id){
    this.responsabilidadeAvaria = this.responsabilidadeAvarias.filter(x => x.id == id).map(x => x)[0]
  }

  return(){
    this.view.dismiss();
  }

  save(){
    this.authService.showLoading();

    let model  = {};

    this.avariaService.salvar(model)
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
      )
      .subscribe((response:any) => {
        this.alertService.showInfo('Avaria salva com sucesso!');

        const modal: Modal = this.modal.create(ModalNovoLancamentoAvariaPage);
        modal.present();

        modal.onWillDismiss((data) => { });

      }, (error: any) => {
        this.alertService.showError('Erro ao salvar avaria');
    });
  }
}
