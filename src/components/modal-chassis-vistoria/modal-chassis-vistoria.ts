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
import { StakeHolder } from '../../model/stakeholder';
import { Observable } from 'rxjs/Observable';
import { enumVeiculoStatus } from '../../providers/enumerables/enum';
import { Checkpoint } from '../../model/GeneralMotors/checkpoint';
import { Place } from '../../model/GeneralMotors/place';
import { Company } from '../../model/GeneralMotors/company';
import { Ship } from '../../model/GeneralMotors/ship';
import { Trip } from '../../model/GeneralMotors/trip';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { LancamentoAvariaSelecaoSuperficiePage } from '../../pages/lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { Surveyor } from '../../model/GeneralMotors/surveyor';

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
    stakeholderOrigem: new StakeHolder(),
    stakeholderDestino: new StakeHolder(),
  };

  modelGM = {
    company: new Company(),
    place: new Place(),
    checkpoint: new Checkpoint(),
    surveyor: new Surveyor(),
    companyOrigin: new Company(),
    companyDestination: new Company(),
    ship: new Ship(),
    trip: new Trip(),
  };

  checklists: Array<Checklist> = [];
  veiculo: Veiculo;
  retorno: DataRetorno;

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
    if (data.vistoriaGM) {
      this.modelGM = data;
    }
    else {
      this.model = data;
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
      empresa: [this.model.empresa ? this.model.empresa.nome : this.modelGM.company.companyName],
      local: [this.model.empresa ? this.model.local.nome : this.modelGM.place.localDescription],
      momento: [this.model.empresa ? this.model.momento.nome : this.modelGM.checkpoint.checkpointDescription],
      stakeholderOrigem: [this.model.empresa ? this.model.stakeholderOrigem : this.modelGM.companyOrigin.companyName],
      stakeholderDestino: [this.model.empresa ? this.model.stakeholderDestino : this.modelGM.companyDestination.companyName],
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
          this.veiculo = null;
          this.authService.hideLoading();
          this.alertService.showError(veiculo$.mensagem);
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

  semAvaria() {
    this.authService.showLoading();

    forkJoin([
      this.vistoriaService.vistoriarVeiculo(this.veiculo.id)
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
        this.veiculo = null;
      })
    )
    .subscribe(arrayResult => {
      let vistoria$ = arrayResult[0];

      if (vistoria$.sucesso) {
        if (vistoria$.tipo == enumVeiculoStatus.Vistoriado) {
          this.alertService.showAlert(vistoria$.mensagem);
        }
        else {
          this.alertService.showInfo(vistoria$.mensagem);
        }
      }
      else if (!vistoria$.sucesso) {
        this.alertService.showError(vistoria$.mensagem);
      }
    }, error => {
      this.alertService.showError(error);
    })
  }

  comAvaria(gm = false){
    this.authService.showLoading();

    if (gm) {
      const chassiModal: Modal = this.modal.create(LancamentoAvariaVistoriaPage,
        {
          data:
          {
            veiculo: this.veiculo,
            momento: this.model.momento
          }
        });

      chassiModal.present();
    }
    else{
      const chassiModal: Modal = this.modal.create(LancamentoAvariaSelecaoSuperficiePage,
        {
          data:
          {
            veiculo: this.veiculo,
            momento: this.model.momento
          }
        });

      chassiModal.present();
    }
  }

  close() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.view.dismiss(data);
  }
}
