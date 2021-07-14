import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { ConferenciaConfiguracaoADO } from '../../providers/database/conferencia-configuracao-ado';
import { ConferenciaResumoTurno } from '../../model/conferencia-resumo-turno';

@Component({
  selector: 'conferencia-resumo-turno',
  templateUrl: 'conferencia-resumo-turno.html'
})
export class ConferenciaResumoTurnoComponent implements OnChanges {
  @Input() configuracao: ConferenciaConfiguracao;
  public resumos: Array<ConferenciaResumoTurno>;

  constructor(public conferenciaConfiguracaoADO: ConferenciaConfiguracaoADO) {
    this.resumos = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('configuracao', this.configuracao);
    this.atualizarDados();
  }

  atualizarDados() {
    this.conferenciaConfiguracaoADO
      .loadResumoPorTurno(this.configuracao.id)
      .subscribe(res => (this.resumos = res), error => console.error(error));
  }
}
