import {
  Component,
  Input,
  SimpleChanges
} from '@angular/core';
import { ConfiguracaoService } from '../../providers/configuracao-service';
import { Navio } from '../../model/navio';

@Component({
  selector: 'escala-resumo',
  templateUrl: 'escala-resumo.html'
})
export class EscalaResumoComponent {
  @Input('navio') navio: any;
  @Input('destino') destino: any;
  @Input('showConferencia') showConferencia: boolean = true;

  public lotes: any[] = [];

  constructor(public configService: ConfiguracaoService) {
    console.log('constructor EscalaResumoComponent');
  }

  toggleSection(index) {
    this.lotes[index].opened = !this.lotes[index].opened;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    if (changes['navio']) {
      this.atualizarLotes(changes['navio'].currentValue);
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit EscalaResumoComponent');
    //this.atualizarLotes(this.navio);
    //console.log('navio', this.navio);
  }

  atualizarLotes(navio: Navio) {

    this.lotes = [];
    if (navio != null) {

      if (navio.operacoes && navio.operacoes.length) {

        // Totaliza os lotes
        navio.operacoes.forEach(o => {
          o.lotes.forEach(l => {

            l.quantidadePrevista = 0;
            l.quantidadeConferida = 0;
            l.quantidadeVinculada = 0;

            l.invoices.forEach(i => {
              l.quantidadePrevista += i.quantidadePrevista;
              l.quantidadeConferida += i.quantidadeConferida;
              l.quantidadeVinculada += i.quantidadeVinculada;
            });

          })
        });

        console.warn('this.destino', this.destino);

        if (this.destino != null) {
          // só passa conforme a operação e os com destino a Rio Grande....
          navio.operacoes.forEach(o => {
            if (o.lotes && o.lotes.length) {
              o.lotes.forEach(l => {

                if (l.destino.id == this.destino.id || l.destino.id == navio.porto.id) {
                  this.lotes.push(l);
                }
              });
            }
          });
        } else {
          navio.operacoes.forEach(o => {
            if (o.lotes && o.lotes.length) {
              o.lotes.forEach(l => (l.navioOperacao = o));
              this.lotes.push(...o.lotes);
            }
          });
        }
      }

      if (this.lotes.length) {
        this.lotes.forEach((l, index) => (l.opened = index == 0));
      }
    }
  }

}
