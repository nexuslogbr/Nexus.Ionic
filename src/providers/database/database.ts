import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class DatabaseProvider {
  public db: any;
  public dbname: string = 'conferencia.db';

  constructor(public platform: Platform, public sqlite: SQLite) {}

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.sqlite.create({
            name: this.dbname,
            location: 'default'
          }).then((db: SQLiteObject) => {
            this.db = db;
            this.createTables(this.db);
          })
          .catch(error => reject(error));
      }
      else {
        // this.db = window['openDatabase'](this.dbname, '1.0', 'Test DB', -1);
        this.db = this.initIndexedDB();
        this.createTables(this.db);
      }
    });
  }

  private initIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbname, 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        this.createTables(db);
        resolve(db);
      };

      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };

      request.onerror = (event: any) => {
        console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  }

  query(q: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      params = params || [];
      {
        this.db.transaction((tx) => {
          tx.executeSql(
            q,
            params,
            (tx, res) => {
              resolve(res);
            },
            (tx, err) => {
              console.error('-->', err);
              reject(err);
            }
          );
        });
      }
    });
  }

  queryBulk(q: string, params?: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      params = params || [];
        this.db.transaction((tx) => {
          try {
            for (let i = 0; i < params.length; i++) {
              let p = params[i];
              tx.executeSql(
                q,
                p,
                (tx, res) => {
                },
                (tx, err) => {
                  reject(err);
                  console.error('-->', err);
                }
              );
            }
            resolve(true);
          } catch (ex) {
            reject(ex);
          }
        });
    });
  }

  private createTables(db: any) {
    this.query(
      'CREATE TABLE IF NOT EXISTS ConferenciaConfiguracao (id INTEGER, areaId INTEGER, conferenciaId INTEGER, areaNome TEXT)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS ConferenciaOperacaoLote (operacaoLoteId INTEGER, conferenciaConfiguracaoId INTEGER, operacaoId INTEGER, quantidadePrevista INTEGER, quantidadeVinculada INTEGER, modeloId INTEGER, modeloNome TEXT, destinoId INTEGER, destinoNome TEXT)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS Turno (id INTEGER, conferenciaConfiguracaoId INTEGER, nome TEXT, turnoInicio TEXT, turnoFim TEXT)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS Veiculo (chassi TEXT, conferenciaConfiguracaoId INTEGER, operacaoLoteId INTEGER, modeloId INTEGER, modelo TEXT, selecionado INTEGER DEFAULT 0)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS Conferencia (chassi TEXT, conferenciaConfiguracaoId INTEGER, dataHora TEXT, nome TEXT, turnoId INTEGER, sincronizar INTEGER, conferenciaVeiculoMotivoId INTEGER)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_PK ON Veiculo(chassi, conferenciaConfiguracaoId, operacaoLoteId)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_operacaoLoteId ON Veiculo(operacaoLoteId)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_CO ON Veiculo(conferenciaConfiguracaoId, operacaoLoteId)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_Chassi ON Veiculo(chassi)'
    )
      .then((res) => {
      })
      .catch((err) => {
      });

  }

}
