import { Component, Input, OnDestroy } from '@angular/core';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'sincronizacao-info',
  templateUrl: 'sincronizacao-info.html',
})
export class SincronizacaoInfoComponent {
  @Input('conferenciaConfiguracaoId') conferenciaConfiguracaoId: number;

  possuiConferenciaEmFila: boolean;

  constructor(conferenciaDataService: ConferenciaDataService) {

    if (this.conferenciaConfiguracaoId && this.conferenciaConfiguracaoId > 0) {
    conferenciaDataService.possuiConferenciaPendenteEmFila(this.conferenciaConfiguracaoId)
        .pipe(take(1))
          .subscribe((res) => {
            this.possuiConferenciaEmFila = res.retorno;
          });
      }
  }

  // ngOnDestroy(): void {
  //   this.subscription = null;
  //   // this.subscription.unsubscribe();
  // }
}
