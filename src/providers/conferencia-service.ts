import { Injectable, OnDestroy } from '@angular/core';
import { ConferenciaConfiguracaoADO } from './database/conferencia-configuracao-ado';
import { ConferenciaConfiguracao } from '../model/conferencia-configuracao';
import { Local } from '../model/Local';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConferenciaSumDestino } from '../model/conferencia-sum-destino';
import { of } from 'rxjs/observable/of';
import { Veiculo } from '../model/veiculo';
import { Conferencia } from '../model/Conferencia';
import { ConferenciaResumoTurno } from '../model/conferencia-resumo-turno';
import { ConferenciaResumoHora } from '../model/conferencia-resumo-hora';

@Injectable()
export class ConferenciaService implements OnDestroy {
  private _configuracao: ConferenciaConfiguracao;
  get configuracao(): ConferenciaConfiguracao {
    return this._configuracao;
  }
  set configuracao(value: ConferenciaConfiguracao) {
    this._configuracao = value;
    this.update();
  }

  public _destino: Local;
  get destino(): Local {
    return this._destino;
  }
  set destino(value: Local) {
    this._destino = value;
    this.update();
  }

  public sumDestinos$ = new BehaviorSubject<Array<ConferenciaSumDestino>>(
    new Array<ConferenciaSumDestino>()
  );

  public sumTurnos$ = new BehaviorSubject<Array<ConferenciaResumoTurno>>(
    new Array<ConferenciaResumoTurno>()
  );

  public sumHoras$ = new BehaviorSubject<Array<ConferenciaResumoHora>>(
    new Array<ConferenciaResumoHora>()
  );

  public totalConferidos$ = new BehaviorSubject<number>(0);
  public totalVeiculos$ = new BehaviorSubject<number>(0);
  public saldoConferencia$ = new BehaviorSubject<number>(0);
  public totalUpload$ = new BehaviorSubject<number>(0);

  public onError$ = new Subject<any>();

  constructor(public conferenciaConfiguracaoADO: ConferenciaConfiguracaoADO) {}

  public update() {
    if (this._configuracao) {
      this.loadResumoPorDestino();
      this.loadResumoPorTurno();
      this.loadResumoPorHora();
      this.loadConferenciasPendentes();
    }
  }

  private loadConferenciasPendentes() {
    this.conferenciaConfiguracaoADO
      .loadTotalDeConferenciasParaSincronizar(this.configuracao.id)
      .pipe(tap((r) => console.log('aqui', r)))
      .subscribe(
        (res) => this.totalUpload$.next(res),
        (error) => {
          console.error(error);
          this.onError$.next(error);
        }
      );
  }

  private loadResumoPorHora() {
    this.conferenciaConfiguracaoADO
      .loadResumoPorHora(this.configuracao.id)
      .subscribe(
        (res) => this.sumHoras$.next(res),
        (error) => {
          console.error(error);
          this.onError$.next(error);
        }
      );
  }

  private loadResumoPorTurno() {
    this.conferenciaConfiguracaoADO
      .loadResumoPorTurno(this.configuracao.id)
      .subscribe(
        (res) => this.sumTurnos$.next(res),
        (error) => {
          console.error(error);
          this.onError$.next(error);
        }
      );
  }

  private loadResumoPorDestino() {
    this.conferenciaConfiguracaoADO
      .loadResumoPorDestino(this._configuracao.id, null)
      .pipe(tap((r) => console.log('loadResumoPorDestino', r)))
      .subscribe(
        (res) => {
          let quantidadeConferidos = res
            .map((d) => d.quantidadeConferidos)
            .reduce((p, n) => p + n, 0);
          this.totalConferidos$.next(quantidadeConferidos);

          let quantidadeVeiculos = res
            .map((d) => d.quantidadeVeiculos)
            .reduce((p, n) => p + n, 0);
          this.totalVeiculos$.next(quantidadeVeiculos);

          this.saldoConferencia$.next(
            quantidadeVeiculos - quantidadeConferidos
          );

          res.forEach((d) => {
            if (this._destino) {
              d.desabilitar = d.destinoId != this._destino.id;
            }

            this.conferenciaConfiguracaoADO
              .loadModelosPorDestino(this.configuracao.id, d.destinoId)
              .subscribe(
                (resm) => (d.modelos = resm),
                (error) => console.error(error)
              );
          });

          this.sumDestinos$.next(res);
        },
        (error) => {
          this.onError$.next(error);
        }
      );
  }

  conferirVeiculo(veiculo: Veiculo, usuario: string, turnoId: number) {
    return this.conferenciaConfiguracaoADO
      .loadConferencia(this.configuracao.id, veiculo.chassi)
      .switchMap((res) => {
        if (res == null) {
          let date = new Date();
          let now =
            date.getFullYear() +
            '-' +
            (date.getMonth() + 1 < 10
              ? '0' + (date.getMonth() + 1)
              : date.getMonth() + 1) +
            '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
            'T' +
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
            ':' +
            (date.getMinutes() < 10
              ? '0' + date.getMinutes()
              : date.getMinutes()) +
            ':' +
            (date.getSeconds() < 10
              ? '0' + date.getSeconds()
              : date.getSeconds()) +
            '.000';

          let conferencia: Conferencia = Object.assign(new Conferencia(), {
            chassi: veiculo.chassi,
            conferenciaConfiguracaoID: this.configuracao.id,
            dataHoraConferencia: now,
            nomeUsuario: usuario,
            turnoID: turnoId,
            sincronizar: true,
            conferenciaVeiculoMotivoID: 1,
          });

          return of(conferencia);
        }
      })
      .switchMap((conferencia) => {
        return this.conferenciaConfiguracaoADO
          .saveConferencia(conferencia)
          .pipe(tap((res) => this.update()));
      });
  }

  public sincronizar() {
    if (this._configuracao) {
      //this.conferenciaConfiguracaoADO.loadDeConferenciasParaSincronizar()
    }
  }

  ngOnDestroy(): void {
    this.totalConferidos$.complete();
    this.totalUpload$.complete();
    this.totalVeiculos$.complete();
    this.sumDestinos$.complete();
    this.sumHoras$.complete();
    this.sumTurnos$.complete();
    this.saldoConferencia$.complete();
    console.log('ngOnDestroy ConferenciaService');
  }
}
