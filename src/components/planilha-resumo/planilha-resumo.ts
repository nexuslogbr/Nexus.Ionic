import { Component, Input, SimpleChanges } from '@angular/core';
import { ConfiguracaoService } from '../../providers/configuracao-service';
import { Navio } from '../../model/navio';
import { ConferenciaChassiResumo } from '../../model/conferencia-chassi-resumo';
import { Arquivo } from '../../model/arquivo';

@Component({
  selector: 'planilha-resumo',
  templateUrl: 'planilha-resumo.html'
})
export class PlanilhaResumoComponent {
  @Input('conferencias') conferencias: Array<ConferenciaChassiResumo>;
  @Input('destino') destino: any;
  @Input('arquivo') arquivo: Arquivo;
  quantidade: number;
  quantidadeConferida: number;

  constructor(public configService: ConfiguracaoService) {
    //console.log('constructor PlanilhaResumoComponent');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    if (changes['conferencias'] && changes['conferencias'].currentValue) {
      //this.atualizarLotes(changes['navio'].currentValue);
      this.quantidade = 0;
      this.quantidadeConferida = 0;

      let conferenciasArray = changes['conferencias'].currentValue;

      if (conferenciasArray && conferenciasArray.length) {
        conferenciasArray.forEach(conferencia => {
          if (conferencia.veiculos && conferencia.veiculos.length) {
            conferencia.quantidade = 0;
            conferencia.quantidadeConferida = 0;
            conferencia.veiculos.forEach(v => {
              this.quantidade++;
              conferencia.quantidade++;
              if (v.conferido) {
                this.quantidadeConferida++;
                conferencia.quantidadeConferida++;
              }
            });
          } else {
            this.quantidade += conferencia.quantidade;
            this.quantidadeConferida += conferencia.quantidadeConferida;
          }
        });
      }
    }
  }

  ngAfterViewInit() {
    //console.log('ngAfterViewInit PlanilhaResumoComponent');
  }

}
