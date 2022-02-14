import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { Navio } from '../../model/navio';
import { Arquivo } from '../../model/arquivo';
import { Subject } from 'rxjs';

@Component({
  selector: 'conferencia-header',
  templateUrl: 'conferencia-header.html'
})
export class ConferenciaHeaderComponent {


  @Input() configuracao: ConferenciaConfiguracao;
  @Input() totalConferidos: number;
  @Input() totalVeiculos: number;

  @Output() gotoPage = new EventEmitter();

  navio: Navio;
  arquivo: Arquivo;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor() {
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
    console.log('clicou....')
    this.gotoPage.emit();
  }

}
