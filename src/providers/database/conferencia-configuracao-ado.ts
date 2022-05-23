import { Pagination } from './../../model/pagination';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from './database';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Local } from '../../model/Local';
import { Observable } from 'rxjs';
import { ConferenciaSumDestino } from '../../model/conferencia-sum-destino';
import { ConferenciaSumModelo } from '../../model/conferencia-sum-modelo';
import { Veiculo } from '../../model/veiculo';
import { Conferencia } from '../../model/Conferencia';
import {
  ConferenciaResumoTurno,
  ConferenciaResumoTurnoItem,
} from '../../model/conferencia-resumo-turno';
import {
  ConferenciaResumoHora,
  ConferenciaResumoHoraItem,
} from '../../model/conferencia-resumo-hora';
import { exhaustMap, tap, concat, mapTo, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ConferenciaAnulacao } from '../../model/conferencia-anulacao';
import { from } from 'rxjs/observable/from';

@Injectable()
export class ConferenciaConfiguracaoADO {
  constructor(public dbProvider: DatabaseProvider) {}

  private sqlConferenciaConfiguracaoINSERT =
    'INSERT INTO ConferenciaConfiguracao (id, areaId, areaNome, conferenciaID) VALUES (?,?,?,?)';
  private sqlConferenciaOperacaoLoteINSERT =
    'INSERT INTO ConferenciaOperacaoLote (operacaoLoteId, conferenciaConfiguracaoId, operacaoId, quantidadePrevista, quantidadeVinculada, modeloId, modeloNome, destinoId, destinoNome) VALUES (?,?,?,?,?,?,?,?,?)';
  private sqlTurnoINSERT =
    'INSERT INTO Turno (id, conferenciaConfiguracaoId, nome, turnoInicio, turnoFim) VALUES (?,?,?,?,?)';
  private sqlVeiculoINSERT =
    'INSERT INTO Veiculo (chassi, conferenciaConfiguracaoId, operacaoLoteId,  modeloId, modelo) VALUES (?,?,?,?,?)';
  private sqlConferenciaINSERT =
    'INSERT INTO Conferencia (chassi, conferenciaConfiguracaoId, dataHora, nome, turnoId, sincronizar, conferenciaVeiculoMotivoId) VALUES (?,?,?,?,?,?,?)';
  private sqlConferenciaDELETE =
    'DELETE FROM Conferencia WHERE chassi = ? AND conferenciaConfiguracaoId = ?';

  public saveConferenciaConfiguracao(
    conferenciaConfiguracao: ConferenciaConfiguracao
  ) {
    let params = [
      conferenciaConfiguracao.id,
      conferenciaConfiguracao.areaID,
      conferenciaConfiguracao.area.nome,
      conferenciaConfiguracao.conferenciaID,
    ];

    var p = this.dbProvider
      .query(this.sqlConferenciaConfiguracaoINSERT, params)
      .then((queryResult) => {
        if (conferenciaConfiguracao.conferenciaOperacaoLotes) {
          conferenciaConfiguracao.conferenciaOperacaoLotes.forEach((col) => {
            this.dbProvider
              .query(this.sqlConferenciaOperacaoLoteINSERT, [
                col.operacaoLoteID,
                conferenciaConfiguracao.id,
                col.operacaoID,
                col.quantidadePrevista,
                col.quantidadeVinculada,
                col.modelo.id,
                col.modelo.nome,
                col.tipoOperacao == 1 ? col.origem.id : col.destino.id,
                col.tipoOperacao == 1 ? col.origem.nome : col.destino.nome,
              ])
              .then((res) =>
                console.log('sqlConferenciaOperacaoLoteINSERT', res)
              )
              .catch((error) => console.error(error));

            if (col.veiculos && col.veiculos.length) {
              this.dbProvider
                .queryBulk(
                  this.sqlVeiculoINSERT,
                  col.veiculos.map((v) => [
                    v.chassi,
                    conferenciaConfiguracao.id,
                    col.operacaoLoteID,
                    col.modelo.id,
                    col.modelo.nome,
                  ])
                )
                .then((res) => {
                  console.log('sqlVeiculoINSERT', res);
                })
                .catch((error) => console.error(error));

              col.veiculos.forEach((v) => {
                if (v.conferenciaVeiculo) {
                  this.syncConferencia(
                    Object.assign(new Conferencia(), {
                      chassi: v.chassi,
                      conferenciaConfiguracaoID:
                        v.conferenciaVeiculo.conferenciaConfiguracaoID,
                      dataHoraConferencia:
                        v.conferenciaVeiculo.dataHoraConferencia,
                      nomeUsuario: v.conferenciaVeiculo.nomeUsuario,
                      turnoID: v.conferenciaVeiculo.turnoID,
                      sincronizar: false,
                    })
                  );
                }
              });
            }
          });

          if (
            conferenciaConfiguracao.turnos &&
            conferenciaConfiguracao.turnos.length
          ) {
            conferenciaConfiguracao.turnos.forEach((turno) => {
              this.dbProvider
                .query(this.sqlTurnoINSERT, [
                  turno.id,
                  conferenciaConfiguracao.id,
                  turno.nome,
                  turno.turnoInicioString,
                  turno.turnoFimString,
                ])
                .then((res) =>
                  console.log('sqlConferenciaOperacaoLoteINSERT', res)
                )
                .catch((error) => console.error(error));
            });
          }
        }
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public saveConferenciaConfiguracao2(
    conferenciaConfiguracao: ConferenciaConfiguracao
  ) {




    let params = [
      conferenciaConfiguracao.id,
      conferenciaConfiguracao.areaID,
      conferenciaConfiguracao.area.nome,
      conferenciaConfiguracao.conferenciaID,
    ];

    var sqlConferenciaConfiguracaoINSERT$ = fromPromise(
      this.dbProvider.query(this.sqlConferenciaConfiguracaoINSERT, params)
    );

    return sqlConferenciaConfiguracaoINSERT$.pipe(
      exhaustMap((queryResult) => {
        // Insere os lotes...
        if (conferenciaConfiguracao.conferenciaOperacaoLotes) {
          return forkJoin(
            conferenciaConfiguracao.conferenciaOperacaoLotes.map((col) =>
              fromPromise(
                this.dbProvider.query(this.sqlConferenciaOperacaoLoteINSERT, [
                  col.operacaoLoteID,
                  conferenciaConfiguracao.id,
                  col.operacaoID,
                  col.quantidadePrevista,
                  col.quantidadeVinculada,
                  col.modelo.id,
                  col.modelo.nome,
                  col.tipoOperacao == 1 ? col.portoDescarga.id : col.destino.id,
                  col.tipoOperacao == 1
                    ? col.portoDescarga.nome
                    : col.destino.nome,
                ])
              )
            )
          );
        } else {
          return forkJoin(of(1));
        }
      }),
      tap((res) => console.log('res1', res)),
      tap((res) => console.log('Insere os veículos......', res)),
      exhaustMap((res) => {
        // Insere os veículos...
        if (conferenciaConfiguracao.conferenciaOperacaoLotes) {
          let veiculos = conferenciaConfiguracao.conferenciaOperacaoLotes
            .filter((col) => col.veiculos && col.veiculos.length)
            .map((col) =>
              col.veiculos.map(
                (v) =>
                  (v = {
                    ...v,
                    operacaoLoteId: col.operacaoLoteID,
                    modeloId: col.modelo.id,
                    modelo: col.modelo.nome,
                  })
              )
            )
            .reduce((cur, next) => [...cur, ...next], []);

          let query$ = fromPromise(
            this.dbProvider.queryBulk(
              this.sqlVeiculoINSERT,
              veiculos.map((v) => [
                v.chassi,
                conferenciaConfiguracao.id,
                v.operacaoLoteId,
                v.modeloId,
                v.modelo,
              ])
            )
          );
          return query$;
        } else {
          return of(null);
        }
      }),
      tap((res) => console.log('res2', res)),

      tap((res) => console.log('Deleta as conferências...')),
      exhaustMap((queryResult) => {
        // Deleta as conferências...
        if (conferenciaConfiguracao.conferenciaOperacaoLotes) {
          let veiculos = conferenciaConfiguracao.conferenciaOperacaoLotes
            .filter((col) => col.veiculos && col.veiculos.length)
            .reduce(
              (acc, current) => [
                ...acc,
                ...current.veiculos.filter((v) => v.conferenciaVeiculo),
              ],
              []
            );
          if (veiculos.length) {
            return fromPromise(
              this.dbProvider.queryBulk(
                this.sqlConferenciaDELETE,
                veiculos.map((v) => [
                  v.chassi,
                  v.conferenciaVeiculo.conferenciaConfiguracaoID,
                ])
              )
            );

            // let observables = veiculos.map((v) =>
            //   fromPromise(
            //     this.dbProvider.query(this.sqlConferenciaDELETE, [
            //       v.chassi,
            //       v.conferenciaVeiculo.conferenciaConfiguracaoID,
            //     ])
            //   )
            // );
            // return forkJoin(observables);
          } else {
            return forkJoin(of(1));
          }
        } else {
          return forkJoin(of(1));
        }
      }),
      tap((res) => console.log('res3', res)),

      tap((res) => console.log('Insere as conferências...', res)),
      exhaustMap((queryResult) => {
        // Insere as conferências...
        if (conferenciaConfiguracao.conferenciaOperacaoLotes) {
          let veiculos = conferenciaConfiguracao.conferenciaOperacaoLotes
            .filter((col) => col.veiculos && col.veiculos.length)
            .reduce(
              (acc, current) => [
                ...acc,
                ...current.veiculos.filter((v) => v.conferenciaVeiculo),
              ],
              []
            );

          if (veiculos.length) {
            return fromPromise(
              this.dbProvider.queryBulk(
                this.sqlConferenciaINSERT,
                veiculos.map((v) => [
                  v.chassi,
                  v.conferenciaVeiculo.conferenciaConfiguracaoID,
                  v.conferenciaVeiculo.dataHoraConferencia,
                  v.conferenciaVeiculo.nomeUsuario,
                  v.conferenciaVeiculo.turnoID,
                  false,
                  v.conferenciaVeiculo.conferenciaVeiculoMotivoID,
                ])
              )
            );
          } else {
            return forkJoin(of(1));
          }
        } else {
          return forkJoin(of(1));
        }
      }),
      tap((res) => console.log('res4', res)),
      tap((res) => console.log('Insere os turnos...', res)),
      exhaustMap((queryResult) => {
        // Insere os turnos...
        if (
          conferenciaConfiguracao.turnos &&
          conferenciaConfiguracao.turnos.length
        ) {
          return forkJoin(
            conferenciaConfiguracao.turnos.map((turno) =>
              fromPromise(
                this.dbProvider.query(this.sqlTurnoINSERT, [
                  turno.id,
                  conferenciaConfiguracao.id,
                  turno.nome,
                  turno.turnoInicioString,
                  turno.turnoFimString,
                ])
              )
            )
          );
        } else {
          return forkJoin(of(1));
        }
      })
    );
  }

  public loadConferenciaConfiguracao(id: number) {
    const sql = 'SELECT * FROM ConferenciaConfiguracao WHERE id = ?';
    let params = [id];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadTurnos(conferenciaConfiguracaoId: number) {
    const sql = 'SELECT * FROM Turno WHERE conferenciaConfiguracaoId = ?';
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadResumoPorDestino(
    conferenciaConfiguracaoId: number,
    destinoId?: number
  ): Observable<Array<ConferenciaSumDestino>> | any {
    let sql =
      'SELECT COL.destinoId, COL.destinoNome, COUNT(V.chassi) AS quantidadeVeiculos, SUM(CASE WHEN C.Chassi IS NOT NULL THEN 1 ELSE 0 END) AS quantidadeConferidos FROM ConferenciaOperacaoLote COL INNER JOIN Veiculo V ON COL.operacaoLoteId = V.operacaoLoteId AND COL.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.conferenciaConfiguracaoId = C.conferenciaConfiguracaoId AND V.chassi = C.chassi WHERE COL.conferenciaConfiguracaoId = ? GROUP BY COL.destinoId ';
    let params = [conferenciaConfiguracaoId];

    if (destinoId) {
      sql =
        'SELECT COL.destinoId, COL.destinoNome, COUNT(V.chassi) AS quantidadeVeiculos, SUM(CASE WHEN C.Chassi IS NOT NULL THEN 1 ELSE 0 END) AS quantidadeConferidos  FROM ConferenciaOperacaoLote COL INNER JOIN Veiculo V ON COL.operacaoLoteId = V.operacaoLoteId AND COL.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.conferenciaConfiguracaoId = C.conferenciaConfiguracaoId AND V.chassi = C.chassi WHERE COL.conferenciaConfiguracaoId = ? AND COL.destinoId = ? GROUP BY COL.destinoId ';
      params = [conferenciaConfiguracaoId, destinoId];
    }

    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let destinos = new Array<ConferenciaSumDestino>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new ConferenciaSumDestino(), {
              destinoId: row.destinoId,
              destinoNome: row.destinoNome,
              quantidadeVeiculos: row.quantidadeVeiculos,
              quantidadeConferidos: row.quantidadeConferidos,
            });
            destinos.push(destino);
          }
        }
        return Promise.resolve(destinos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  // public loadResumoPorTurno(
  //   conferenciaConfiguracaoId: number
  // ): Observable<Array<ConferenciaResumoTurno>> {
  //   let sql =
  //     "SELECT strftime('%Y-%m-%d', C.dataHora) AS data, C.turnoId, count(*) as total, t.nome as turnoNome, t.turnoInicio, t.turnoFim FROM Conferencia C INNER JOIN Turno T ON C.TurnoId = T.id WHERE C.conferenciaConfiguracaoId = ? GROUP BY data, turnoId ORDER BY data, turnoId";
  //   let params = [conferenciaConfiguracaoId];

  //   var p = this.dbProvider
  //     .query(sql, params)
  //     .then(queryResult => {
  //       let resumos = new Array<ConferenciaResumoTurno>();
  //       if (queryResult.rows && queryResult.rows.length) {
  //         for (let i = 0; i < queryResult.rows.length; i++) {
  //           let row = queryResult.rows[i];
  //           let resumo = Object.assign(new ConferenciaResumoTurno(), {
  //             data: row.data,
  //             turnoId: row.turnoId,
  //             turnoNome: row.turnoNome,
  //             turnoInicio: new Date(row.turnoInicio),
  //             turnoFim: new Date(row.turnoFim),
  //             total: row.total,
  //             detalhes: new Array<ConferenciaResumoTurnoItem>()
  //           });

  //           resumos.push(resumo);
  //         }
  //       }
  //       return Promise.resolve(resumos);
  //     })
  //     .catch(error => {
  //       return Promise.reject(error);
  //     });

  //   return fromPromise(p);
  // }

  public loadResumoPorTurno(
    conferenciaConfiguracaoId: number
  ): Observable<Array<ConferenciaResumoTurno>> {
    let sql =
      "SELECT strftime('%Y-%m-%d', C.dataHora) AS data, C.turnoId, count(*) as total, t.nome as turnoNome, t.turnoInicio, t.turnoFim FROM Conferencia C INNER JOIN Turno T ON C.TurnoId = T.id AND T.conferenciaConfiguracaoId = C.conferenciaConfiguracaoId WHERE C.conferenciaConfiguracaoId = ? GROUP BY data, turnoId ORDER BY data, turnoId";
    let sqlDetalhes =
      "SELECT strftime('%Y-%m-%d', C.dataHora) AS data, C.turnoId, count(*) as total, v.modeloId, v.modelo as modelo FROM Conferencia C INNER JOIN Veiculo V ON C.chassi = V.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE C.conferenciaConfiguracaoId = ? and C.turnoId = ?  and strftime('%Y-%m-%d', C.dataHora) = ? GROUP BY v.modeloId";
    let params = [conferenciaConfiguracaoId];

    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let resumos = new Array<ConferenciaResumoTurno>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let resumo = Object.assign(new ConferenciaResumoTurno(), {
              data: row.data,
              turnoId: row.turnoId,
              turnoNome: row.turnoNome,
              turnoInicio: new Date(row.turnoInicio),
              turnoFim: new Date(row.turnoFim),
              total: row.total,
            });

            this.dbProvider
              .query(sqlDetalhes, [
                conferenciaConfiguracaoId,
                row.turnoId,
                row.data,
              ])
              .then((queryResultDetalhe) => {
                resumo.detalhes = new Array<ConferenciaResumoTurnoItem>();
                for (let j = 0; j < queryResultDetalhe.rows.length; j++) {
                  let row = queryResultDetalhe.rows[j];

                  let detalhe = Object.assign(
                    new ConferenciaResumoTurnoItem(),
                    {
                      modelo: row.modelo,
                      totalConferidos: row.total,
                    }
                  );
                  resumo.detalhes.push(detalhe);
                }
              });

            resumos.push(resumo);
          }
        }
        return Promise.resolve(resumos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadResumoPorHora(
    conferenciaConfiguracaoId: number
  ): Observable<Array<ConferenciaResumoHora>> {
    let sql =
      "SELECT strftime('%Y-%m-%d', C.dataHora) AS data, strftime('%H:00', C.dataHora) AS hora, count(*) as total FROM Conferencia C  WHERE C.conferenciaConfiguracaoId = ? GROUP BY data, hora ORDER BY data, hora";
    let sqlDetalhes =
      "SELECT strftime('%Y-%m-%d', C.dataHora) AS data, strftime('%H:00', C.dataHora) AS hora, count(*) as total, v.modeloId, v.modelo as modelo FROM Conferencia C INNER JOIN Veiculo V ON C.chassi = V.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE C.conferenciaConfiguracaoId = ? and data = ? and hora= ? GROUP BY v.modeloId ORDER BY data, hora";
    let params = [conferenciaConfiguracaoId];

    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let resumos = new Array<ConferenciaResumoHora>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let resumo = Object.assign(new ConferenciaResumoHora(), {
              data: row.data,
              hora: row.hora,
              total: row.total,
            });

            this.dbProvider
              .query(sqlDetalhes, [
                conferenciaConfiguracaoId,
                row.data,
                row.hora,
              ])
              .then((queryResultDetalhe) => {
                resumo.detalhes = new Array<ConferenciaResumoHoraItem>();
                console.log('queryResultDetalhe', queryResultDetalhe);
                for (let j = 0; j < queryResultDetalhe.rows.length; j++) {
                  let row = queryResultDetalhe.rows[j];

                  let detalhe = Object.assign(new ConferenciaResumoHoraItem(), {
                    modelo: row.modelo,
                    totalConferidos: row.total,
                  });

                  resumo.detalhes.push(detalhe);
                  console.log('detalhe', detalhe);
                }
              });

            resumos.push(resumo);
          }
        }
        return Promise.resolve(resumos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadModelosPorDestino(
    conferenciaConfiguracaoId: number,
    destinoId: number
  ): Observable<Array<ConferenciaSumModelo>> | any {
    const sql =
      'SELECT COL.modeloId, COL.modeloNome, COUNT(V.chassi) AS quantidadeVeiculos, SUM(CASE WHEN C.chassi IS NOT NULL THEN 1 ELSE 0 END) AS quantidadeConferidos FROM ConferenciaOperacaoLote COL INNER JOIN Veiculo V ON COL.operacaoLoteId = V.operacaoLoteId AND COL.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.conferenciaConfiguracaoId = C.conferenciaConfiguracaoId AND V.chassi = C.chassi WHERE COL.conferenciaConfiguracaoId = ? AND COL.destinoId = ? GROUP BY COL.modeloId, COL.modeloNome ORDER BY COL.modeloNome';
    let params = [conferenciaConfiguracaoId, destinoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let modelos = new Array<ConferenciaSumModelo>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let modelo = Object.assign(new ConferenciaSumModelo(), {
              modeloId: row.modeloId,
              modeloNome: row.modeloNome,
              quantidadeVeiculos: row.quantidadeVeiculos,
              quantidadeConferidos: row.quantidadeConferidos,
            });
            modelos.push(modelo);
          }
        }
        return Promise.resolve(modelos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadDestinos(
    conferenciaConfiguracaoId: number
  ): Observable<Array<Local>> | any {
    const sql =
      'SELECT DISTINCT destinoId, destinoNome FROM ConferenciaOperacaoLote WHERE conferenciaConfiguracaoId = ?';
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let destinos = new Array<Local>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Local(), {
              id: row.destinoId,
              nome: row.destinoNome,
            });
            destinos.push(destino);
          }
        }
        return Promise.resolve(destinos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadTotalDeConferenciasParaSincronizar(
    conferenciaConfiguracaoId: number
  ): Observable<number> {
    const sql =
      "SELECT count(*) as total FROM Conferencia WHERE conferenciaConfiguracaoId = ? AND sincronizar = 'true'";
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult.rows[0].total);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadVeiculos(
    conferenciaConfiguracaoId: number,
    destinoId?: number,
    chassi?: string,
    somenteConferidos?: boolean,
    somenteSelecionados?: boolean
  ): Observable<Array<Veiculo>> {
    let params = [conferenciaConfiguracaoId];
    let sql =
      'SELECT V.*, (CASE WHEN C.chassi IS NULL THEN 0 ELSE 1 END) AS conferido, (CASE WHEN C.conferenciaVeiculoMotivoId IS NULL THEN 0 ELSE 1 END) AS justificado, C.conferenciaVeiculoMotivoId FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ? ';

    if (destinoId) {
      sql += 'AND COL.destinoId = ? ';
      params = [...params, destinoId];
    }

    if (chassi && chassi.length) {
      sql += "AND V.chassi LIKE '%" + chassi + "'";
    }

    if (somenteConferidos != null) {
      if (somenteConferidos) {
        sql += ' AND C.chassi IS NOT NULL';
      } else {
        sql += ' AND C.chassi IS NULL';
      }
    }

    if (somenteSelecionados != null) {
      if (somenteSelecionados) {
        sql += ' AND V.selecionado = 1';
      } else {
        sql += ' AND V.selecionado = 0';
      }
    }

    //let params = [conferenciaConfiguracaoId, destinoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let veiculos = new Array<Veiculo>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Veiculo(), {
              chassi: row.chassi,
              conferenciaConfiguracaoId: row.conferenciaConfiguracaoId,
              conferido: eval(row.conferido),
              justificado: eval(row.justificado),
              modelo: row.modelo,
              modeloId: row.modeloId,
              operacaoLoteId: row.operacaoLoteId,
              conferenciaVeiculoMotivoId: row.conferenciaVeiculoMotivoId,
            });
            veiculos.push(destino);
          }
        }
        return Promise.resolve(veiculos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadVeiculosPaginado(
    conferenciaConfiguracaoId: number,
    pagination: Pagination<Veiculo>,
    destinoId?: number,
    chassi?: string,
    somenteConferidos?: boolean,
    somenteSelecionados?: boolean
  ): Observable<Pagination<Veiculo>> {
    let sql =
      'SELECT V.*, (CASE WHEN C.chassi IS NULL THEN 0 ELSE 1 END) AS conferido, (CASE WHEN C.conferenciaVeiculoMotivoId IS NULL THEN 0 ELSE 1 END) AS justificado, C.conferenciaVeiculoMotivoId FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ? ';

    let total =
      'SELECT count(*) as total FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ? ';

    let params = [conferenciaConfiguracaoId];

    if (destinoId) {
      sql += ' AND COL.destinoId = ?';
      total += ' AND COL.destinoId = ?';
      params.push(destinoId);
    }

    if (chassi && chassi.length) {
      sql += " AND V.chassi LIKE '%" + chassi + "'";
      total += " AND V.chassi LIKE '%" + chassi + "'";
    }

    if (somenteConferidos != null) {
      if (somenteConferidos) {
        sql += ' AND C.chassi IS NOT NULL';
        total += ' AND C.chassi IS NOT NULL';
      } else {
        sql += ' AND C.chassi IS NULL';
        total += ' AND C.chassi IS NULL';
      }
    }

    if (somenteSelecionados != null) {
      if (somenteSelecionados) {
        sql += ' AND V.selecionado = 1';
        total += ' AND V.selecionado = 1';
      } else {
        sql += ' AND V.selecionado = 0';
        total += ' AND V.selecionado = 0';
      }
    }

    sql = sql += ` LIMIT ${pagination.totalPerPage} OFFSET ${
      pagination.totalPerPage * pagination.page
    }`;

    var queryPromise = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        pagination.data = new Array<Veiculo>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Veiculo(), {
              chassi: row.chassi,
              conferenciaConfiguracaoId: row.conferenciaConfiguracaoId,
              conferido: eval(row.conferido),
              selecionado: eval(row.selecionado),
              justificado: eval(row.justificado),
              modelo: row.modelo,
              modeloId: row.modeloId,
              operacaoLoteId: row.operacaoLoteId,
              conferenciaVeiculoMotivoId: row.conferenciaVeiculoMotivoId,
            });
            pagination.data.push(destino);
          }
        }

        return Promise.resolve(pagination);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    var totalPromise = this.dbProvider
      .query(total, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    var result = forkJoin(from(queryPromise), from(totalPromise)).pipe(
      map((results) => {
        results[0].totalRecords = results[1].rows[0].total;
        return results[0];
      })
    );

    return result;
  }

  public loadVeiculosSemDestino(
    conferenciaConfiguracaoId: number,
    chassi: string
  ): Observable<Array<Veiculo>> {
    const sql =
      "SELECT V.*, (CASE WHEN C.chassi IS NULL THEN  0 ELSE 1 END) AS conferido, (CASE WHEN C.conferenciaVeiculoMotivoId IS NULL THEN 0 ELSE 1 END) AS justificado, COL.destinoId FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ? AND V.chassi LIKE '%" +
      chassi +
      "'";
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let veiculos = new Array<Veiculo>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Veiculo(), {
              chassi: row.chassi,
              conferenciaConfiguracaoId: row.conferenciaConfiguracaoId,
              conferido: eval(row.conferido),
              justificado: eval(row.justificado),
              modelo: row.modelo,
              modeloId: row.modeloId,
              operacaoLoteId: row.operacaoLoteId,
              destinoId: row.destinoId,
            });
            veiculos.push(destino);
          }
        }
        return Promise.resolve(veiculos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadAllVeiculos(
    conferenciaConfiguracaoId: number
  ): Observable<Array<Veiculo>> {
    const sql =
      'SELECT V.*, (CASE WHEN C.chassi IS NULL THEN  0 ELSE 1 END) AS conferido, (CASE WHEN C.conferenciaVeiculoMotivoId IS NULL THEN 0 ELSE 1 END) AS justificado, C.conferenciaVeiculoMotivoId FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ?';
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let veiculos = new Array<Veiculo>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Veiculo(), {
              chassi: row.chassi,
              conferenciaConfiguracaoId: row.conferenciaConfiguracaoId,
              conferido: eval(row.conferido),
              justificado: eval(row.justificado),
              modelo: row.modelo,
              modeloId: row.modeloId,
              operacaoLoteId: row.operacaoLoteId,
              conferenciaVeiculoMotivoId: row.conferenciaVeiculoMotivoId,
            });
            veiculos.push(destino);
          }
        }
        return Promise.resolve(veiculos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadVeiculosPorConfiguracao(
    conferenciaConfiguracaoId: number,
    destinoId: number
  ): Observable<Array<Veiculo>> {
    const sql =
      'SELECT V.*, (CASE WHEN C.chassi IS NULL THEN  0 ELSE 1 END) AS conferido FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ?';
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let veiculos = new Array<Veiculo>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Veiculo(), {
              chassi: row.chassi,
              conferenciaConfiguracaoId: row.conferenciaConfiguracaoId,
              conferido: eval(row.conferido),
              modelo: row.modelo,
              modeloId: row.modeloId,
              operacaoLoteId: row.operacaoLoteId,
            });
            veiculos.push(destino);
          }
        }
        return Promise.resolve(veiculos);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  // public loadVeiculos(
  //   conferenciaConfiguracaoId: number
  // ): Observable<Array<Veiculo>> {
  //   const sql =
  //     "SELECT V.*, (CASE WHEN C.chassi IS NULL THEN  0 ELSE 1 END) AS conferido FROM Veiculo V INNER JOIN ConferenciaOperacaoLote COL ON V.operacaoLoteId = COL.operacaoLoteID AND V.conferenciaConfiguracaoId = COL.conferenciaConfiguracaoId LEFT JOIN Conferencia C ON V.chassi = C.chassi AND C.conferenciaConfiguracaoId = V.conferenciaConfiguracaoId WHERE V.conferenciaConfiguracaoId = ? AND COL.destinoId = ? AND V.chassi LIKE '%" +
  //     chassi +
  //     "'";
  //   let params = [conferenciaConfiguracaoId, destinoId];
  //   var p = this.dbProvider
  //     .query(sql, params)
  //     .then(queryResult => {
  //       let veiculos = new Array<Veiculo>();
  //       if (queryResult.rows && queryResult.rows.length) {
  //         for (let i = 0; i < queryResult.rows.length; i++) {
  //           let row = queryResult.rows[i];
  //           let destino = Object.assign(new Veiculo(), {
  //             chassi: row.chassi,
  //             conferenciaConfiguracaoId: row.conferenciaConfiguracaoId,
  //             conferido: eval(row.conferido),
  //             modelo: row.modelo,
  //             modeloId: row.modeloId,
  //             operacaoLoteId: row.operacaoLoteId
  //           });
  //           veiculos.push(destino);
  //         }
  //       }
  //       return Promise.resolve(veiculos);
  //     })
  //     .catch(error => {
  //       return Promise.reject(error);
  //     });

  //   return fromPromise(p);
  // }

  public updateVeiculo(
    conferenciaConfiguracaoId: number,
    veiculo: Veiculo
  ): Observable<Veiculo> {
    const sql =
      "UPDATE Veiculo SET conferido = ?  WHERE conferenciaConfiguracaoId = ? AND chassi LIKE '%" +
      veiculo.chassi +
      "'";
    let params = [veiculo.conferido, conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        console.log('queryResult', queryResult);
        return Promise.resolve(veiculo);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public existsConferenciaConfiguracao(id: number) {
    const sql =
      'SELECT COUNT(*) AS Total FROM ConferenciaConfiguracao WHERE id = ?';
    let params = [id];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult.rows[0].Total > 0);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public dropConferenciaConfiguracao(id: number) {
    let params = [id];

    return fromPromise(
      Promise.all([
        this.dbProvider.query('DELETE FROM Veiculo'),
        this.dbProvider.query('DELETE FROM Turno'),
        this.dbProvider.query('DELETE FROM ConferenciaOperacaoLote'),
        this.dbProvider.query('DELETE FROM ConferenciaConfiguracao'),
        this.dbProvider.query(
          "DELETE FROM Conferencia WHERE sincronizar = 'false'"
        ),
      ])
    );
  }

  public syncConferencia(conferencia: Conferencia) {
    let paramsConferencia = [
      conferencia.chassi,
      conferencia.conferenciaConfiguracaoID,
      conferencia.dataHoraConferencia,
      conferencia.nomeUsuario,
      conferencia.turnoID,
      conferencia.sincronizar,
      conferencia.conferenciaVeiculoMotivoID,
    ];

    var p = this.dbProvider
      .query(this.sqlConferenciaDELETE, [
        conferencia.chassi,
        conferencia.conferenciaConfiguracaoID,
      ])
      .then((queryResultDelete) => {
        console.log('queryResultDelete', queryResultDelete);
        this.dbProvider
          .query(this.sqlConferenciaINSERT, paramsConferencia)
          .then((queryResult) => {
            return Promise.resolve(queryResult);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public saveConferencia(conferencia: Conferencia) {
    let params = [
      conferencia.chassi,
      conferencia.conferenciaConfiguracaoID,
      conferencia.dataHoraConferencia,
      conferencia.nomeUsuario,
      conferencia.turnoID,
      conferencia.sincronizar,
      conferencia.conferenciaVeiculoMotivoID,
    ];

    var p = this.dbProvider
      .query(this.sqlConferenciaINSERT, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public anularConferencia(conferenciaAnulacao: ConferenciaAnulacao) {
    let params = [
      conferenciaAnulacao.chassi,
      conferenciaAnulacao.conferenciaConfiguracaoID,
    ];

    var p = this.dbProvider
      .query(this.sqlConferenciaDELETE, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadConferencia(
    conferenciaConfiguracaoId: number,
    chassi: string
  ): Observable<Conferencia> {
    const sql =
      'SELECT * FROM Conferencia WHERE conferenciaConfiguracaoId = ? AND chassi = ?';
    let params = [conferenciaConfiguracaoId, chassi];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        let conferencia: Conferencia = null;
        if (queryResult.rows && queryResult.rows.length) {
          let row = queryResult.rows[0];
          conferencia = Object.assign(new Conferencia(), {
            chassi: row.chassi,
            conferenciaConfiguracaoID: row.conferenciaConfiguracaoId,
            dataHora: row.dataHora,
            nome: row.nome,
            turnoId: row.turnoId,
            conferenciaVeiculoMotivoID: row.conferenciaVeiculoMotivoId,
          });
        }
        return Promise.resolve(conferencia);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public loadConferenciasPendentes(
    conferenciaConfiguracaoId: number
  ): Observable<Array<Conferencia>> {
    const sql =
      "SELECT * FROM Conferencia WHERE conferenciaConfiguracaoId = ? AND sincronizar = 'true'";
    let params = [conferenciaConfiguracaoId];
    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {

        console.log('LOAD CONFERENCIA' ,  queryResult)

        let conferencias = new Array<Conferencia>();
        if (queryResult.rows && queryResult.rows.length) {
          for (let i = 0; i < queryResult.rows.length; i++) {
            let row = queryResult.rows[i];
            let destino = Object.assign(new Conferencia(), {
              chassi: row.chassi,
              conferenciaConfiguracaoID: row.conferenciaConfiguracaoId,
              dataHoraConferencia: row.dataHora,
              sincronizar: eval(row.sincronizar),
              turnoID: row.turnoId,
              nomeUsuario: row.nome,
              conferenciaVeiculoMotivoID: row.conferenciaVeiculoMotivoId,
            });
            conferencias.push(destino);
          }
        }
        return Promise.resolve(conferencias);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public excluirConferencia(
    conferenciaConfiguracaoId: number,
    chassi?: string
  ) {
    let sql = 'DELETE FROM Conferencia WHERE conferenciaConfiguracaoId = ?';
    let params = [conferenciaConfiguracaoId.toString()];

    if (chassi) {
      sql += ' AND chassi = ?';
      params = [...params, chassi];
    }

    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }

  public alterarStatusSelecaoVeiculo(
    selecionado: boolean,
    conferenciaConfiguracaoId: number,
    chassi?: string,
    somenteConferidos?: boolean
  ) {
    let params = [conferenciaConfiguracaoId.toString()];
    let sql =
      'UPDATE Veiculo SET selecionado = ' +
      (selecionado ? 1 : 0) +
      ' WHERE conferenciaConfiguracaoId = ?';

    if (chassi && chassi.length) {
      sql += " AND chassi LIKE '%" + chassi + "'";
    }

    if (somenteConferidos != null) {
      if (somenteConferidos) {
        sql +=
          ' AND EXISTS (SELECT chassi FROM Conferencia WHERE Conferencia.conferenciaConfiguracaoId = Veiculo.conferenciaConfiguracaoId AND Conferencia.chassi = Veiculo.chassi)';
      } else {
        sql +=
          ' AND NOT EXISTS (SELECT chassi FROM Conferencia WHERE Conferencia.conferenciaConfiguracaoId = Veiculo.conferenciaConfiguracaoId AND Conferencia.chassi = Veiculo.chassi)';
      }
    }

    console.log('sql', sql);

    var p = this.dbProvider
      .query(sql, params)
      .then((queryResult) => {
        return Promise.resolve(queryResult);
      })
      .catch((error) => {
        return Promise.reject(error);
      });

    return fromPromise(p);
  }
}
