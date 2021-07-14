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

  constructor(public navCtrl: NavController) {}

  gotoPageClick() {
    this.gotoPage.emit();
  }

}
