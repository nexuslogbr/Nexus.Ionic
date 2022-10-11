import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso';
import { VistoriaPage } from '../../pages/vistoria/vistoria';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from '../../model/veiculo';
import { CheckpointDataService } from '../../providers/checkpoint-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators/finalize';
import { DataRetorno } from '../../model/dataretorno';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { VeiculoDataService } from '../../providers/veiculo-data-service';
import { ModelChecklistPage } from '../../pages/model-checklist/model-checklist';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Checklist } from '../../model/checklist';

@Component({
  selector: 'modal-chassis-vistoria',
  templateUrl: 'modal-chassis-vistoria.html',
})

export class ModalChassisVistoriaComponent {
  title: string;
  url: string;
  formControl = new FormControl("");
  public form: FormGroup
  @ViewChild('chassiInput') chassiInput;

  formData = {
    chassi: "",
  };

  modoOperacao: number;
  responseData:any;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  model: any;
  checklists: Array<Checklist> = [];
  checklist: Checklist;

  constructor(
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public alertService: AlertService,
    private checklistService: CheckpointDataService,
  ) {
    this.title = 'Vistoria';
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();

    this.model = this.navParam.get('data');

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

    this.formControl.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        {
          if (value.length >= 6) {
            let chassi = value.replace(/[\W_]+/g, '');
            setTimeout(() => {
              this.buscarChassi(chassi);
            }, 500);
          }
        }
      }
    });

    this.initializeFormControl(this.navParam.get('data'));
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
    this. loadChecklists();
  }

  initializeFormControl(data:any){
    this.form = this.formBuilder.group({
      empresa: [data.empresa.value],
      local: [data.local.value],
      momento: [data.momento.value],
      stakeholderOrigem: [data.stakeholderOrigem.value],
      stakeholderDestino: [data.stakeholderDestino.value],
      checklist: [null, Validators.required]
    });
  }

  loadChecklists(){
    this.authService.showLoading();
    this.checklistService.listar()
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe((r: DataRetorno) => {
      if (r.retorno != null) {
        this.checklists = r.retorno;
      }
      else {
        this.alertService.showAlert(r.mensagem);
      }
    }, error => {
      this.alertService.showAlert(error.message);
    })
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

  buscarChassi(chassi: string) {

    if (this.form.valid) {
      this.authService.showLoading();

      forkJoin([
        this.checklistService.carregar({id: this.form.controls.checklist.value})
      ])
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
          this.formData.chassi = '';
        })
      )
      .subscribe(arrayResult => {
        let checklist$ = arrayResult[0];

        if (checklist$.sucesso) {
          this.checklist = checklist$.retorno;

          const chassiModal: Modal = this.modal.create(ModelChecklistPage, {data: this.checklist });
          chassiModal.present();
        }
        else {
          this.authService.hideLoading();
          if (chassi.length < 17) {
            this.alertService.showError(checklist$.mensagem);
          }
          else if (checklist$.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.alertService.showAlert(checklist$.mensagem);
          }
          else if (checklist$.dataErro == 'CHASSI_NOT_FOUND') {
            this.alertService.showError('Fabricante sem checklist');
          }
          else {
            this.alertService.showError(checklist$.mensagem);
          }
        }
      },
      (error) => {
        this.alertService.showError(error.status + ' - ' + error.statusText);
      });
    }
    else {
      this.alertService.showAlert('Selecione um checklist!');
    }
  }
}
