import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import * as $ from 'jquery';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from '../../model/veiculo';
import { CheckpointDataService } from '../../providers/checkpoint-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators/finalize';
import { DataRetorno } from '../../model/dataretorno';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { VeiculoDataService } from '../../providers/veiculo-data-service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Checklist } from '../../model/checklist';
import { LancamentoAvariaVistoriaPage } from '../../pages/lancamento-avaria-vistoria/lancamento-avaria-vistoria';
import { Momento } from '../../model/momento';
import { Local } from '../../model/local';
import { Survey } from '../../model/GeneralMotors/survey';
import { StakeHolder } from '../../model/stakeholder';

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

  model = {
    empresa: null,
    local: new Local(),
    momento: new Momento(),
    stakeholder: new StakeHolder(),
  };

  modelGM = new Survey();

  checklists: Array<Checklist> = [];
  veiculo: Veiculo;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public alertService: AlertService,
    public modalController: ModalController,
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    private formBuilder: FormBuilder,
    private checklistService: CheckpointDataService,
    private veiculoService: VeiculoDataService,
    private vistoriaService: VistoriaDataService
  ) {
    this.title = 'Vistoria';
    this.url = this.authService.getUrl();
    this.modoOperacao = this.authService.getLocalModoOperacao();

    let data = this.navParam.get('data');
    this.model = data;
    if (data.vistoriaGM) {
      this.modelGM.company = this.model.empresa;
      this.modelGM.local = this.model.local.id;
      this.modelGM.origin = this.model.stakeholder.origem;
      this.modelGM.destination = this.model.stakeholder.destino;
      this.modelGM.checkpoint = this.model.momento.id;
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

    this.initializeFormControl();
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);
    this. loadChecklists();
  }

  initializeFormControl(){
    this.form = this.formBuilder.group({
      empresa: [this.model.empresa.nome],
      local: [this.model.local.nome],
      momento: [this.model.momento.nome],
      stakeholderOrigem: [this.model.stakeholder.origem],
      stakeholderDestino: [this.model.stakeholder.destino],
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
        this.veiculoService.busarVeiculo(chassi)
      ])
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
          this.formData.chassi = '';
        })
      )
      .subscribe(arrayResult => {
        let veiculo$ = arrayResult[0];

        if (veiculo$.sucesso) {
          this.veiculo = veiculo$.retorno;
        }
        else {
          this.authService.hideLoading();
        }
      },
      (error) => {
        this.alertService.showError(error.status + ' - ' + error.statusText);
      });
    }
    else {
      this.alertService.showAlert('Erro!');
    }
  }

  openModal(){
    if (this.modelGM) {

    }
    this.vistoriaService.vistoriarChassi(this.veiculo.id)
    .subscribe((res: DataRetorno) => {
      if (res.sucesso) {
        const chassiModal: Modal = this.modal.create(LancamentoAvariaVistoriaPage, {data:
          {
            veiculo: this.veiculo,
            momento: this.model.momento
          } });
        chassiModal.present();

        this.view.dismiss();

      }
      else {
        this.alertService.showError(res.mensagem);
      }
    }, (error: any) => {
      this.alertService.showError('Erro');
    });
  }
}
