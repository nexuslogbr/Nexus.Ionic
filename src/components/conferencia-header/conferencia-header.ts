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

  constructor() {

  }

  gotoPageClick() {
    console.log('clicou....')
    this.gotoPage.emit();
  }

}
