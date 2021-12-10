import { Usuario } from './../../model/usuario';
import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';
import { NavController, ModalController, Modal } from 'ionic-angular';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { ModalDeviceComponent } from '../../components/modal-device/modal-device';
import { HomePage } from '../home/home';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { MenuCePage } from '../menu-ce/menu-ce';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators/finalize';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  responseData: any;
  userData: any;
  loginData: any;
  formData = { code: '', user: '', pass: '' };
  //formData =  {"code": "","user":"Derwy","pass":"25021990"};//dev   HIDUR0JNDF
  //formData = { code: "", user: "admin", pass: "abc123456*" }; //dev   HIDUR0JNDF
  // formData =  {"code": "","user":"mob1","pass":"123"};//patio

  public disconnect: boolean = false;
  // formData: any = { "token": this.token,"chassi": this.chassi };
  // private url: string = "Receber/ConsultarChassi";
  private url: string;
  private version: string = '1.0.0'; // = '1.0.0';
  // private code: any = "";// = 'HIDUR0JNDF' devpatio;
  // private code: any;// = 'IYNXYCVWT7' devpatioro;
  private code: void; // = 'QUZL9HDM53' patioautomotivo principal; derwy/25021990
  // private code: any;// = 'EVE4U7BSU4' patio;

  //
  constructor(
    private httpClient: HttpClient,
    private modal: ModalController,
    public navCtrl: NavController,
    public storage: Storage,
    public modalCtrl: ModalController,
    private appVersion: AppVersion,
    private authService: AuthService
  ) {
    console.log('LoginPage');

    this.url = this.authService.getUrl();

    this.appVersion
      .getVersionNumber()
      .then((ver) => {
        this.appVersion = ver;
        this.version = ver;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  ionViewDidLoad() {
    this.authService.getLoginData().then((loginData) => {
      if (loginData != null) {
        this.authService
          .setLoginData(loginData)
          .then((res) => this.navCtrl.push(HomePage, this.responseData));
      } else {
        this.authService.showLoading();
        this.storage.ready().then(() => {
          this.storage.get('dispositivo').then((data) => {
            if (data != null) {
              this.code = data;
              this.ConsultarDispositivo(this.code);
              this.authService.hideLoading();
            } else {
              //console.log('2');
              this.authService.hideLoading();
              this.openModalDevice(this.code);
              //console.log(this.code);
            }
          });
          // this.authService.hideLoading();
        });
      }
    });
  }

  openModalDevice(code) {
    let modalDevice = this.modalCtrl.create(ModalDeviceComponent, {
      data: code,
    });
    modalDevice.present();

    modalDevice.onDidDismiss((data) => {
      this.code = data;
      this.ConsultarDispositivo(this.code);
    });
    modalDevice.onWillDismiss((data) => {});
  }

  ConsultarDispositivo(code) {
    this.authService.showLoading();

    let consultarDispositivo =
      this.authService.getUrl() +
      '/Dispositivo/Consultar?code=' +
      code +
      '&version=1.0.0/';

    this.httpClient
      .get(consultarDispositivo)
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        (data) => {
          debugger
          this.responseData = data;
          if (this.responseData.sucesso) {
            this.code = this.responseData.retorno;
          } else {
            this.storage.remove('dispositivo');
            this.openModalDevice(this.code);
          }
        },
        (err) => {
          this.openModalErro(err.status + ' - ' + err.statusText);
          console.log(err);
        }
      );
  }

  Login() {
    this.authService.showLoading();

    this.userData = {
      code: this.code,
      user: this.formData['user'],
      pass: this.formData['pass'],
    };

    let loginUser = this.url + '/Usuario/Login';

    this.httpClient
      .post(loginUser, this.userData, httpOptions)
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        (data) => {
          this.responseData = data;

          if (this.responseData.sucesso) {
            this.authService
              .setLoginData(this.responseData.retorno)
              .then((res: Usuario) => {
                if (!this.responseData.retorno['clienteExterno']) {
                  this.navCtrl.push(HomePage);
                } else {
                  this.navCtrl.push(MenuCePage);
                }
              });
          } else {
            this.openModalErro(this.responseData.mensagem);
          }
        },
        (err) => {
          this.openModalErro(err.status + ' - ' + err.statusText);
          console.error(err);
        }
      );
  }

  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      console.log(data);
    });
    chassiModal.onWillDismiss((data) => {});
  }

  openModalErroCode(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.openModalDevice(this.code);
    });
    chassiModal.onWillDismiss((data) => {});
  }

  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data,
    });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {});
    chassiModal.onWillDismiss((data) => {});
  }
}
