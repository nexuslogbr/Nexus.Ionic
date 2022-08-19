import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RecebimentoPage } from '../recebimento/recebimento';
import { Select } from 'ionic-angular';
import * as $ from 'jquery';
import { VistoriaPage } from '../vistoria/vistoria';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from '../../model/veiculo';
import { CheckpointDataService } from '../../providers/checkpoint-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators/finalize';
import { DataRetorno } from '../../model/dataretorno';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { VeiculoDataService } from '../../providers/veiculo-data-service';
import { Checklist } from '../../model/checklist';
import { ChecklistItem } from '../../model/checklistItem';

@Component({
  selector: 'page-model-checklist',
  templateUrl: 'model-checklist.html',
})
export class ModelChecklistPage {
  title: string;
  url: string;
  public form: FormGroup

  modoOperacao: number;
  responseData:any;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  checklist: Checklist
  checkListItens: ChecklistItem[] = [];

  constructor(
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private checkpointService: CheckpointDataService,
    public alertService: AlertService,
    private vistoriaService: VistoriaDataService,
    private veiculoService: VeiculoDataService
  ) {
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();

    this.checklist = this.navParam.get('data');

    if (this.checklist) {
      this.checkListItens = this.checklist.checkListItens;
      this.title = this.checklist.nome;
      this.authService.hideLoading();
    }

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

    this.initializeFormControl();
  }

  initializeFormControl(){
    this.form = this.formBuilder.group({ });
  }

  openModalSucesso(data){
    // const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    // chassiModal.present();

    // chassiModal.onDidDismiss((data) => {
    //   this.navCtrl.push(VistoriaPage);
    // })
  }

  openModalErro(data) {
    // const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
    //   data: data,
    // });
    // chassiModal.present();
  }

  close() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.view.dismiss(data);
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  vistoriarChassi(veiculo: Veiculo){
    this.vistoriaService.vistoriarChassi(veiculo.id)
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe((res:DataRetorno) => {

      if (this.responseData.sucesso) {
        this.alertService.showInfo("Vistoria feita com sucesso!");
      }
      else {
        this.alertService.showAlert(this.responseData.mensagem);
      }
    });
  }

  checked(i: number){
    this.checkListItens[i].isChecked = !this.checkListItens[i].isChecked;
  }

  checkedAll(e:any){
    this.checkListItens.forEach(item => {
      item.isChecked = e.value;
    });;
  }
}
