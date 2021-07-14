import { Component, Input, OnDestroy } from '@angular/core';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'sincronizacao-info',
  templateUrl: 'sincronizacao-info.html',
})
export class SincronizacaoInfoComponent implements OnDestroy {
  @Input('conferenciaConfiguracaoId') conferenciaConfiguracaoId: number;

  subscription: Subscription;
  possuiConferenciaEmFila: boolean;

  constructor(conferenciaDataService: ConferenciaDataService) {
    let checkTimer = timer(0, 10000);
    this.subscription = checkTimer.subscribe((t) => {
      conferenciaDataService
        .possuiConferenciaPendenteEmFila(this.conferenciaConfiguracaoId)
        .pipe(take(1))
        .subscribe((res) => {
          this.possuiConferenciaEmFila = res.retorno;
        });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
