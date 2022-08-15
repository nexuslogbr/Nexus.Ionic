import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ModalErrorComponent } from '../modal-error/modal-error';
import { Select } from 'ionic-angular';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalSucessoComponent } from '../modal-sucesso/modal-sucesso';
import { VistoriaPage } from '../../pages/vistoria/vistoria';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from '../../model/veiculo';
import { CheckpointDataService } from '../../providers/checkpoint-service';
import { AlertService } from '../../providers/alert-service';
import { finalize } from 'rxjs/operators/finalize';
import { DataRetorno } from '../../model/dataretorno';
import { VistoriaDataService } from '../../providers/vistoria-service';
import { VeiculoDataService } from '../../providers/veiculo-data-service';

@Component({
  selector: 'modal-chassis-vistoria',
  templateUrl: 'modal-chassis-vistoria.html',
})

export class ModalChassisVistoriaComponent {
  @ViewChild('select') select: Select;
  title: string;
  chassis: any;
  url: string;
  formControl = new FormControl("");
  public form: FormGroup
  @ViewChild('chassiInput') chassiInput;

  formData = {
    chassi: "",
  };

  modoOperacao: number;
  responseData:any;
  success = false;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  model: any;
  veiculo: Veiculo;

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

  ionViewDidEnter() {
    setTimeout(() => {
      this.chassiInput.setFocus();
    }, 1000);

    this.authService.hideLoading();
   }

  initializeFormControl(data:any){
    this.form = this.formBuilder.group({
      empresa: [data.empresa.value, Validators.required],
      local: [data.local.value, Validators.required],
      momento: [data.momento.value, Validators.required],
      stakeholderOrigem: [data.stakeholderOrigem.value, Validators.required],
      stakeholderDestino: [data.stakeholderDestino.value, Validators.required]
    });
  }

  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
      this.navCtrl.push(VistoriaPage);

    })
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();
  }

  closeModal() {
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

  cancelar() {
    this.view.dismiss();
    this.select.close();
    this.navCtrl.push(RecebimentoPage);
  }

  buscarChassi(chassi: string) {
    this.authService.showLoading();

    this.veiculoService.busarVeiculoStakeholder(chassi)
    .subscribe((res) => {
        this.responseData = res;
        if (this.responseData.sucesso) {
          this.veiculo = this.responseData.retorno;
          // this.vistoriarChassi(this.veiculo);
        }
        else {
          this.authService.hideLoading();
          if (chassi.length < 17) {
            this.success = false;
            this.alertService.showError(this.responseData.mensagem);
          }
          else if (this.responseData.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.success = false;
            this.alertService.showAlert(this.responseData.mensagem);
          }
          else if (this.responseData.dataErro == 'CHASSI_NOT_FOUND') {
            this.alertService.showError(this.responseData.mensagem);
          }
          else {
            this.success = false;
            this.openModalErro(this.responseData.mensagem);
          }
        }
      },
      (error) => {
        this.authService.hideLoading();
        this.openModalErro(error.status + ' - ' + error.statusText);
      }
    );
  }

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
        this.success = true;
      }
      else {
        this.alertService.showAlert(this.responseData.mensagem);
      }
    });
  }

}
