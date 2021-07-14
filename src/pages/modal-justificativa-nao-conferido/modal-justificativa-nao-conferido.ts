import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ConferenciaVeiculoMotivo } from '../../model/conferencia-veiculo-motivo';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-modal-justificativa-nao-conferido',
  templateUrl: 'modal-justificativa-nao-conferido.html',
})
export class ModalJustificativaNaoConferidoPage {

  motivo: string;
  //motivos: Array<ConferenciaVeiculoMotivo>;
  //motivoSelecionado: ConferenciaVeiculoMotivo;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public conferenciaDataService: ConferenciaDataService,
    public alertService: AlertService,
    private authService: AuthService,
    public navParams: NavParams) {
    //this.motivos = new Array();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalJustificativaNaoConferidoPage');
    // this.authService.showLoadingWhite();
    // this.conferenciaDataService.listarConferenciaMotivos().subscribe(res => {
    //   this.authService.hideLoadingWhite();
    //   if (res.sucesso) {
    //     this.motivos = res.retorno.filter(m => m.conferenciaVeiculoMotivoCategoriaID === 1);
    //   }
    // }, error => {
    //   this.authService.hideLoadingWhite();
    //   this.alertService.showError(error, null, () => { this.navCtrl.pop(); });
    // });
  }

  // onChangeMotivo(id) {
  //   this.motivoSelecionado = this.motivos.find(m => m.id == id);
  // }

  continuar() {
    this.viewCtrl.dismiss({ motivo: this.motivo });
  }

  voltar() {
    this.viewCtrl.dismiss({});
  }

}
