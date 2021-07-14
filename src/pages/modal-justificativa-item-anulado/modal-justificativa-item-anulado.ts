import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
//import { ConferenciaVeiculoMotivo } from '../../model/conferencia-veiculo-motivo';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-modal-justificativa-item-anulado',
  templateUrl: 'modal-justificativa-item-anulado.html',
})
export class ModalJustificativaItemAnuladoPage {

  //motivos: Array<ConferenciaVeiculoMotivo>;
  //motivoSelecionado: ConferenciaVeiculoMotivo;
  motivo: string;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public conferenciaDataService: ConferenciaDataService,
    public alertService: AlertService,
    private authService: AuthService,
    public navParams: NavParams) {
    //this.motivos = new Array();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalJustificativaItemAnuladoPage');
    //this.authService.showLoading();
    // this.conferenciaDataService.listarConferenciaMotivos().subscribe(res => {
    //   this.authService.hideLoading();
    //   if (res.sucesso) {
    //     this.motivos = res.retorno.filter(m => m.conferenciaVeiculoMotivoCategoriaID === 2);
    //   }
    // }, error => {
    //   this.authService.hideLoading();
    //   this.showErrorAlert(error)
    // });
  }

  // onChangeMotivo(id) {
  //   this.motivoSelecionado = this.motivos.find(m => m.id == id);
  // }

  continuar() {
    //this.showInfoAlert('A CONFERÊNCIA DESTE ITEM SERÁ ANULADA.<BR/>DESEJA PROSSEGUIR?');
    this.alertService.showAlert('A CONFERÊNCIA DESTE ITEM SERÁ ANULADA.', 'DESEJA PROSSEGUIR?', () => { this.viewCtrl.dismiss({ motivo: this.motivo });}, ()=> {});
  }

  voltar() {
    this.viewCtrl.dismiss({});
  }

  // showErrorAlert(message: string) {
  //   let alert = this.alertCtrl.create({
  //     title: 'Erro!',
  //     message: message,
  //     buttons: [
  //       {
  //         text: 'Continuar',
  //         role: 'cancel',
  //         handler: () => {
  //           this.navCtrl.pop();
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // showInfoAlert(message: string) {

  //   let alert = this.alertCtrl.create({
  //     title: 'Alerta!',
  //     message: message,
  //     buttons: [
  //       {
  //         text: 'Confirmar',
  //         role: 'cancel',
  //         handler: () => {
  //           this.viewCtrl.dismiss({ motivo: this.motivo });
  //         }
  //       },
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         handler: () => {
  //           // nothing..
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

}
