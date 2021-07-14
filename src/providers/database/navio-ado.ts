import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Navio } from '../../model/navio';
import { DatabaseProvider } from './database';

@Injectable()
export class NavioADO {
  // constructor(
  //   public dbProvider: DatabaseProvider
  // ) {}

  // public addNavio(navio: Navio, usuarioId: number) {
  //   debugger;
  //   const sql = "INSERT INTO Navio (usuarioId, id, nome, ets, viagem) VALUES (?,?,?,?,?)";
  //   let params = [usuarioId, navio.id, navio.nome, navio.ETS, navio.viagem];
  //   return this.dbProvider
  //     .getDB()
  //     .then((db: SQLiteObject) => {
  //       return db.executeSql(sql, params);
  //     })
  //     .catch(error=> {return Promise.reject(error)});
  // }

  // public getAllNavios(usuarioId: number) {
  //   debugger;

  //   const sql = 'SELECT * FROM Navio WHERE UsuarioId=?';
  //   let params = [usuarioId];

  //   return this.dbProvider.getDB().then((db: SQLiteObject) => {
  //     //let data: any[];
  //     db.executeSql(sql, params)
  //       .then((data: any) => {
  //         console.log('data', data);
  //         let navios = Array<Navio>();
  //         if (data.rows.length > 0) {
  //           data.rows.array.forEach(row => {
  //             navios.push(this.mapRowToNavio(row));
  //           });
  //         }
  //         console.log('navios', navios);
  //         return Promise.resolve(navios);
  //       })
  //       .catch(error => {
  //         console.log('getAllNavios->error', error);
  //         return Promise.reject(error)
  //       })
  //       .catch(error => {
  //         console.log('getAllNavios->error', error);
  //         return Promise.reject(error)
  //       });
  //   });
  // }

  // private mapRowToNavio(row: any): Navio {
  //   let navio = new Navio();
  //   navio.ETS = new Date(row.ets);
  //   navio.nome = row.nome;
  //   navio.id = row.id;
  //   navio.viagem = row.viagem;
  //   return navio;
  // }
}
