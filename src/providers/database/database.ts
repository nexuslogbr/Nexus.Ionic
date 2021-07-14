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
      // if (this.platform.is('cordova')) {
      //   this.sqlite
      //     .create({
      //       name: this.dbname,
      //       location: 'default'
      //     })
      //     .then((db: SQLiteObject) => {
      //       this.db = db;
      //       this.createTables(this.db);
      //       console.log('db criado no SQLite!');
      //       resolve();
      //     })
      //     .catch(error => reject(error));
      // } else
      {
        this.db = window['openDatabase'](this.dbname, '1.0', 'Test DB', -1);
        this.createTables(this.db);
        console.log('db criado no WebSQL!');
        resolve();
      }
    });
  }

  query(q: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      params = params || [];
      // if (this.platform.is('cordova')) {
      //   this.db.transaction(tx => {
      //     tx.executeSql(
      //       q,
      //       params,
      //       (tx, res) => {
      //         resolve(res);
      //       },
      //       (tx, err) => {
      //         reject(err);
      //       }
      //     );
      //   });
      // } else
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
      // if (this.platform.is('cordova')) {
      //   this.db.transaction(tx => {

      //     tx.executeSql(
      //       q,
      //       params,
      //       (tx, res) => {
      //         resolve(res);
      //       },
      //       (tx, err) => {
      //         reject(err);
      //       }
      //     );

      //   });
      // } else
      {
        this.db.transaction((tx) => {
          try {
            for (let i = 0; i < params.length; i++) {
              let p = params[i];
              tx.executeSql(
                q,
                p,
                (tx, res) => {
                  //console.log('-->', res);
                },
                (tx, err) => {
                  reject(err);
                  console.error('-->', err);
                }
              );
              //console.log('executeSql->', q, p);
            }
            resolve(true);
          } catch (ex) {
            reject(ex);
          }
        });
      }
    });
  }

  private createTables(db: any) {
    this.query(
      'CREATE TABLE IF NOT EXISTS ConferenciaConfiguracao (id INTEGER, areaId INTEGER, conferenciaId INTEGER, areaNome TEXT)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS ConferenciaOperacaoLote (operacaoLoteId INTEGER, conferenciaConfiguracaoId INTEGER, operacaoId INTEGER, quantidadePrevista INTEGER, quantidadeVinculada INTEGER, modeloId INTEGER, modeloNome TEXT, destinoId INTEGER, destinoNome TEXT)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS Turno (id INTEGER, conferenciaConfiguracaoId INTEGER, nome TEXT, turnoInicio TEXT, turnoFim TEXT)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS Veiculo (chassi TEXT, conferenciaConfiguracaoId INTEGER, operacaoLoteId INTEGER, modeloId INTEGER, modelo TEXT, selecionado INTEGER DEFAULT 0)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE TABLE IF NOT EXISTS Conferencia (chassi TEXT, conferenciaConfiguracaoId INTEGER, dataHora TEXT, nome TEXT, turnoId INTEGER, sincronizar INTEGER, conferenciaVeiculoMotivoId INTEGER)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_PK ON Veiculo(chassi, conferenciaConfiguracaoId, operacaoLoteId)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_operacaoLoteId ON Veiculo(operacaoLoteId)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_CO ON Veiculo(conferenciaConfiguracaoId, operacaoLoteId)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    this.query(
      'CREATE INDEX IF NOT EXISTS IDX_Veiculo_Chassi ON Veiculo(chassi)'
    )
      .then((res) => {
        console.log('Result: ', res);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });

    // this.query(
    //   "CREATE INDEX IF NOT EXISTS IDX_Veiculo_ConferenciaConfiguracaoId ON Veiculo(conferenciaConfiguracaoId)"
    // )
    //   .then((res) => {
    //     console.log("Result: ", res);
    //   })
    //   .catch((err) => {
    //     console.log("Error: ", err);
    //   });

    // this.query(
    //   "CREATE INDEX IF NOT EXISTS IDX_ConferenciaOperacaoLote_operacaoLoteID ON ConferenciaOperacaoLote(operacaoLoteID)"
    // )
    //   .then((res) => {
    //     console.log("Result: ", res);
    //   })
    //   .catch((err) => {
    //     console.log("Error: ", err);
    //   });

    //CREATE [UNIQUE] INDEX index_name ON table_name(indexed_column);
  }

  // constructor(private sqlite: SQLite) {}

  // public getDB() {
  //   return this.sqlite.create({
  //     name: 'conferencia.db',
  //     location: 'default'
  //   });
  // }

  // public createDatabase() {
  //   return this.getDB()
  //     .then((db: SQLiteObject) => {
  //       this.createTables(db);
  //       //this.insertDefaultItems(db);
  //     })
  //     .catch(e => console.log(e));
  // }

  // private createTables(db: SQLiteObject) {
  //   db.sqlBatch([
  //     [
  //       'CREATE TABLE IF NOT EXISTS Navio ( id INTEGER NOT NULL, usuarioId INTEGER NOT NULL, nome TEXT NOT NULL, ets TEXT NOT NULL, viagem TEXT NOT NULL, CONSTRAINT PK_Navio PRIMARY KEY (id,usuarioId));'
  //     ]
  //   ])
  //     .then(() => console.log('tabelas criadas/atualizadas'))
  //     .catch(e => console.error('Erro ao criar as tabelas', e));
  // }

  // private insertDefaultItems(db: SQLiteObject) {
  //   // db.executeSql('select COUNT(id) as qtd from radios', {})
  //   //   .then((data: any) => {
  //   //     if (data.rows.item(0).qtd == 0) {
  //   //       db.sqlBatch([
  //   //         ['insert into radios (name,url,thumb) values (?,?,?)', ['radio 1', 'url de teste 1', 'thumb 1']],
  //   //         ['insert into radios (name,url,thumb) values (?,?,?)', ['radio 2', 'url de teste 2', 'thumb 2']]
  //   //       ])
  //   //         .then(() => console.log('Dados default incluídos com sucesso!'))
  //   //         .catch(e => console.error('Erro ao incluir os dados default', e));
  //   //     }
  //   //   })
  //   //   .catch(e => console.error('Erro ao consultar a qtd de radios', e));
  // }
}
