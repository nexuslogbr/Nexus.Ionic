import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { NivelGravidadeAvaria } from '../../model/NivelGravidadeAvaria';
import { TipoAvaria } from '../../model/TipoAvaria';
import { AvariaDataService } from '../../providers/avaria-data-service';
import { GravidadeDataService } from '../../providers/gravidade-data-service';

@Component({
  selector: 'page-lancamento-avaria-selecao-superficie',
  templateUrl: 'lancamento-avaria-selecao-superficie.html',
})
export class LancamentoAvariaSelecaoSuperficiePage {
  title: string;
  tiposAvaria: Array<TipoAvaria> = [];
  nivelGravidadeAvaria: Array<NivelGravidadeAvaria> = [];

  formSelecaoSuperficie: FormGroup

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
    private formBuilder: FormBuilder
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
}
