import { Component, ViewChild } from "@angular/core";
import { IonicPage,  NavController, Modal, ModalController, ViewController } from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { HomePage } from "../home/home";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { ModalSucessoComponent } from "../../components/modal-sucesso/modal-sucesso";
import { Select } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import * as $ from "jquery";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { ListarAvariasPage } from "../listar-avarias/listar-avarias";
import { Usuario } from "../../model/usuario";
import { QualidadeMenuPage } from "../qualidade-menu/qualidade-menu";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "page-buscar-avarias",
  templateUrl: "buscar-avarias.html",
})
export class BuscarAvariasPage {
  @ViewChild('chassiInput') chassiInput;
  @ViewChild('select') select: Select;

  title: string;
  url: string;
  inputChassi: string;
  partes: any;
  modelos: any;
  tipoAvarias: any;
  nivelAvarias: any;
  chassis: any = [];
  modoOperacao: number;
  showModal: Boolean = false;

  formData = {
    "token": "",
    "skip": 0,
    "take": 10,
    "localID": 0,
    "veiculoID": 0,
    "chassi":"",
    "veiculoDesc": "",
    "data": "",
    "parteAvariadaID": 0,
    "parteAvariaDesc": "",
    "modelo": "",
    "tipoAvariaID": 0,
    "tipoAvariaDesc": "",
    "gravidadeID": 0,
    "gravidadeDesc": ""
  };

  userData: Usuario;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  qrCodeText: string;
  options: BarcodeScannerOptions;
  car: any;

  formControlChassi = new FormControl("");
  public form: FormGroup

  constructor(
    public http: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public authService: AuthService,
    private barcodeScanner: BarcodeScanner,
    private formBuilber: FormBuilder,
    private view: ViewController,
  ) {
    this.title = "BUSCAR AVARIAS";
    console.log("BuscarAvariasPage");
    this.url = this.authService.getUrl();
    this.userData = this.authService.getUserData();

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

    this.form = this.formBuilber.group({
      chassi: [''],
      data: [null],
      parte: [0],
      modelo: [0],
      tipoAvaria: [0],
      nivelAvaria: [0],
    });

    this.formControlChassi.valueChanges.debounceTime(500).subscribe((value) => {
      if (value && value.length) {
        if (value.length >= 6) {
          let chassi = value.replace(/[\W_]+/g, '');
          setTimeout(() => {
            this.buscarChassi(chassi, false);
            this.formData.chassi = '';
          }, 500);
        }
      }
    });

  }

  ionViewDidEnter() {
    this.ListarParte();
    this.ListarModelos();
    this.ListarTipoAvaria();
    this.ListarNivelAvaria();
    this.setLocalID();
  }

  consultarChassiAvarias() { }

  onParteChange(value) {
    var item = this.partes.find(item => item['id'] === value);
    this.formData.parteAvariadaID = item.id;
    this.formData.parteAvariaDesc = item.nome;
  }

  onModeloChange(value) {
    var item = this.modelos.find(item => item['id'] === value);
    this.formData.modelo = item.nome;
  }

  onTipoAvariaChange(value) {
    var item = this.tipoAvarias.find(item => item['id'] === value);
    this.formData.tipoAvariaID = item.id;
    this.formData.tipoAvariaDesc = item.nome;
  }

  onNivelAvariaChange(value) {
    var item = this.nivelAvarias.find(item => item['id'] === value);
    this.formData.gravidadeID = item.id;
    this.formData.gravidadeDesc = item.nome;
  }

  setLocalID() {
    this.formData.localID = this.userData.localModoOperacao;
  }

  public avancar() {
    if (this.validaCampos()) {
      if (this.inputChassi) {
        this.buscarChassi(this.inputChassi, false)
      }

      let model = {
        veiculoID: this.formData.veiculoID,
        chassi:  this.form.controls.chassi.value,
        data:  this.form.controls.data.value,
        parteAvariadaID:  this.form.controls.parte.value,
        modelo:  this.form.controls.modelo.value,
        tipoAvariaID:  this.form.controls.tipoAvaria.value,
        gravidadeID:  this.form.controls.nivelAvaria.value
      }

      console.clear();
      console.log(model);
      this.navCtrl.push(ListarAvariasPage, model);
    }
    else {
      this.openModalErro('Preencha os campos da busca');
    }
  }

  validaCampos() {
    if (this.form.controls.data.value || this.form.controls.parte.value || this.form.controls.modelo.value || this.form.controls.tipoAvaria.value || this.form.controls.nivelAvaria.value)
      return true;

    return false;
  }

  find(qrCodeText:any){
    let partChassi = this.qrCodeText.substr(qrCodeText.length - 17, 17);
  }

  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0,
    };
    this.authService.showLoading();
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.qrCodeText = barcodeData.text;
        if (this.qrCodeText && this.qrCodeText.length) {
          let partChassi = this.qrCodeText.substr(this.qrCodeText.length - 17, 17);
          this.formData['chassi'] = partChassi;
          this.buscarChassi(partChassi, true);
        }
      },
      (err) => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data);
      }
    );
  }

  buscarChassi(partChassi, byScanner: boolean) {

    let uriBuscaChassi = '/veiculos/ConsultarChassi?token=' + this.authService.getToken() + '&chassi=' + partChassi;
    this.authService.showLoading();
    this.formData.token = this.authService.getToken();

    this.http.get(this.url + uriBuscaChassi).subscribe(
      (res) => {
        this.car = res;
        if (this.car.sucesso) {
          this.chassis = this.car.retorno;
          this.showModal = true;

          this.form.patchValue({
            chassi: partChassi,
            veiculoID: this.car.retorno.id
          });
          this.authService.hideLoading();
        }
        else {
          if (this.modoOperacao == 1 || partChassi.length < 17) {
            this.openModalErro(this.car.mensagem);
          }
          else if (this.car.dataErro == 'CHASSI_ALREADY_RECEIVED') {
            this.openModalErro(this.car.mensagem);
          }
          else if (
            this.modoOperacao == 2 &&
            this.car.dataErro == 'CHASSI_NOT_FOUND'
          ) {
            // this.openModalLancamentoAvaria([partChassi], byScanner);
          }
          else {
            this.openModalErro(this.car.mensagem);
          }
        }
      },
      (error) => {
        this.openModalErro(error.status + ' - ' + error.statusText);
      }
    );
  }

  ListarParte() {
    this.http.get(this.url + "/Parte/Partes?token=" + this.authService.getToken())
      .subscribe( (resultado) => {
          this.car = resultado;
          if (this.car.sucesso)
            this.partes = this.car.retorno;
          else
            this.openModalErro(this.car.mensagem);
        },
        (error) => {

          this.openModalErro(
            "Erro ao carregar as partes, volte ao menu e tente novamente!"
          );
          console.log(error);
        }
      );
  }

  ListarModelos() {
    this.http
      .get(this.url + "/Modelo/Listar?token=" + this.authService.getToken())
      .subscribe((resultado) => {
          this.car = resultado;
          if (this.car.sucesso)
            this.modelos = this.car.retorno;
          else
            this.openModalErro(this.car.mensagem);
        },
        (error) => {

          this.openModalErro( "Erro ao carregar os modelos, volte ao menu e tente novamente!" );
        }
      );


  }

  ListarTipoAvaria() {
    this.http.get(this.url + "/tipoavaria/ListarTiposAvaria?token=" + this.authService.getToken())
      .subscribe((resultado) => {
          this.car = resultado;
          if (this.car.sucesso)
            this.tipoAvarias = this.car.retorno;

          else
            this.openModalErro(this.car.mensagem);
        },
        (error) => {

          this.openModalErro("Erro ao carregar o layout, volte ao menu e tente novamente!");
        }
      );
  }

  ListarNivelAvaria() {
    this.http
      .get(this.url + "/nivelgravidadeavaria/ListarNivelGravidadeAvaria?token=" + this.authService.getToken())
      .subscribe((resultado) => {
          this.car = resultado;
          if (this.car.sucesso)
            this.nivelAvarias = this.car.retorno;
          else
            this.openModalErro(this.car.mensagem);
        },
        (error) => {

          this.openModalErro(
            "Erro ao carregar o layout, volte ao menu e tente novamente!"
          );
        }
      );
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.inputChassi = ''; // this.cleanInput(byScanner);
    });
  }

  cleanInput(byScanner: boolean) {
    if (!byScanner) {
      setTimeout(() => {
        this.chassiInput.setFocus();
        this.inputChassi = '';
      }, 1000);
    }
    this.formData.veiculoID = 0;
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    });
    chassiModal.onWillDismiss((data) => {
      console.log("data");
      console.log(data);
    });
  }

  navigateToHomePage() {
    this.navCtrl.push(QualidadeMenuPage);
  }

  isEmpty(obj) {
    for (var x in obj) {
      if (obj.hasOwnProperty(x)) return false;
    }
    return true;
  }

  onChassisChange(selectedValue) {
    // this.novoChassi = selectedValue;
    $('.login-content').css('display', 'block');
  }

  closeModal() {
    const data = {
      name: 'Hingo',
      cargo: 'Front',
    };
    this.select.close();
    this.view.dismiss(data);
  }

  openModalChassis() {
    this.showModal = false;

    // const chassiModal: Modal = this.modal.create(LancamentoAvariaPage, {
    //   data: this.responseData[0],
    // });
    // chassiModal.present();

    // chassiModal.onDidDismiss((data) => {
    //   this.cleanInput(true);
    // });
  }

}
