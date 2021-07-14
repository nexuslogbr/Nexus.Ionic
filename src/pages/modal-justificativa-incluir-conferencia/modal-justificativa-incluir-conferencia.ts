import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { Turno } from '../../model/turno';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-modal-justificativa-incluir-conferencia',
  templateUrl: 'modal-justificativa-incluir-conferencia.html',
})
export class ModalJustificativaIncluirConferenciaPage {

  turnos: Array<Turno>;
  turnoSelecionado: Turno;
  data: string = '';
  hora: string = '';
  motivo: string = '';
  diaValido: boolean = true;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public conferenciaDataService: ConferenciaDataService,
    public alertService: AlertService,
    public navParams: NavParams) {
    this.turnos = navParams.data.turnos;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalJustificativaIncluirConferenciaPage');
  }

  onTurnoChange(id: number) {
    this.turnoSelecionado = this.turnos.find(t => t.id == id);
  }

  continuar() {
    let data = "20" + this.data.substring(6, 8) + "-" + this.data.substring(3, 5) + "-" + this.data.substring(0, 2);
    var date = new Date(data + " " + this.hora);
    var now = new Date();

    if (date.toString() === 'Invalid Date') {
      this.alertService.showError('A data e hora informada é inválida');
    } else if (date > now) {
      this.alertService.showError('A data e hora informada é superior a data e hora atual');
    } else {
      this.viewCtrl.dismiss({ motivo: this.motivo, turno: this.turnoSelecionado, data: data, hora: this.hora });
    }
  }

  voltar() {
    this.viewCtrl.dismiss({});
  }

  gotoNextField(nextElement) {
    if (this.data.length >= 8) {
      nextElement.setFocus();
    }
  }

  gotoNextField3(nextElement) {
    if (this.hora.length >= 5) {
      nextElement.open();
    }
  }

}
