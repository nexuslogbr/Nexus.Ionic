import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  Select,
  ViewController
} from 'ionic-angular';

@Component({
  selector: 'page-modal-selecao-chassi',
  templateUrl: 'modal-selecao-chassi.html'
})
export class ModalSelecaoChassiPage {
  @ViewChild('selectChassis') selectChassis: Select;
  chassis: any[] = [];

  chassiSelecionado: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public view: ViewController
  ) {
    this.chassis = navParams.data.chassis;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.chassis) {
        if (this.chassis.length > 1) {
          this.selectChassis.open();
        } else {
          //this.selectChassis.selectedText = this.chassis[0];
          this.selectChassis.setValue(this.chassis[0]);
        }
      }
    }, 150);
  }

  onChassisChange(chassiSelecionado) {
    this.chassiSelecionado = chassiSelecionado;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalSelecaoChassiPage');
  }

  conferir() {
    this.view.dismiss({ chassiSelecionado: this.chassiSelecionado });
  }

  cancelar() {
    this.view.dismiss({});
  }
}
