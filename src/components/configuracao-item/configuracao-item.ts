import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';

@Component({
  selector: 'configuracao-item',
  templateUrl: 'configuracao-item.html'
})
export class ConfiguracaoItemComponent {
  @Input() configuracao: ConferenciaConfiguracao;
  @Output() gotoPage = new EventEmitter();
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(public navCtrl: NavController) {
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
  }

  gotoPageClick() {
    this.gotoPage.emit();
  }

}
