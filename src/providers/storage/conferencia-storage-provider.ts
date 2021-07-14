import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ConferenciaStorageProvider {
  private prefixKey: string = '_conferencia';

  private prefixKeyPlanilha: string = '_conferencia_planilha';

  constructor(public storage: Storage) {}

  public async persistConferenciaNavio(
    chassi: string,
    ususarioId: number,
    data: any
  ): Promise<any> {
    let key = this.prefixKey + '_' + ususarioId + '_' + chassi;
    try {
      return this.storage.set(key, data);
    } catch (exception) {
      return Promise.reject(exception);
    }
  }

  public async persistConferenciaPlanilha(
    chassi: string,
    ususarioId: number,
    data: any
  ): Promise<any> {
    let key = this.prefixKeyPlanilha + '_' + ususarioId + '_' + chassi;
    try {
      return this.storage.set(key, data);
    } catch (exception) {
      return Promise.reject(exception);
    }
  }



  // Retorna as Conferencias via Navio pendentes.
  public async getAllNavioConferencias(): Promise<any> {
    try {
      let keys = await this.getAllNavioKeys();
      let conferencias = [];
      for (let i = 0; i < keys.length; i++) {
        let data = await this.getByKey(keys[i]);
        if (data != null) {
          data.key = keys[i];
          conferencias.push(data);
        }
      }
      return Promise.resolve(conferencias);
    } catch (exception) {
      return Promise.reject(exception);
    }
  }

    // Retorna as Conferencias via Planilha pendentes.
    public async getAllPlanilhaConferencias(ususarioId: number): Promise<any> {
      try {
        let keys = await this.getAllPlanilhaKeys(ususarioId);
        let conferencias = [];
        for (let i = 0; i < keys.length; i++) {
          let data = await this.getByKey(keys[i]);
          if (data != null) {
            data.key = keys[i];
            conferencias.push(data);
          }
        }
        return Promise.resolve(conferencias);
      } catch (exception) {
        return Promise.reject(exception);
      }
    }

  // Retorna um booleano informando se existe alguma conferencia via Navio pendente.
  public async contemConferenciaNavioPendente(): Promise<any> {
    try {
      let keys = await this.getAllNavioKeys();
      return Promise.resolve(keys && keys.length);
    } catch (exception) {
      return Promise.reject(exception);
    }
  }

    // Retorna um booleano informando se existe alguma conferencia via Planilha pendente.
    public async contemConferenciaPlanilhaPendente(ususarioId: number): Promise<any> {
      try {
        let keys = await this.getAllPlanilhaKeys(ususarioId);
        return Promise.resolve(keys && keys.length);
      } catch (exception) {
        return Promise.reject(exception);
      }
    }

  // Retorna as Conferencias pendentes.
  public async deleteConferenciaByKey(key: string): Promise<any> {
    try {
      await this.storage.remove(key);
      return Promise.resolve(true);
    } catch (exception) {
      return Promise.reject(exception);
    }
  }

  private async getAllNavioKeys() {
    let subprefix = this.prefixKey + '_';
    return await this.storage
      .keys()
      .then(keys => {
        return Promise.resolve(
          keys.filter(key => {
            return key.includes(subprefix);
          })
        );
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  /// Retorna todas as chaves de Planilha relacionadas ao usuário.
  private async getAllPlanilhaKeys(ususarioId: number) {
    let subprefix = this.prefixKeyPlanilha + '_' + ususarioId + '_';
    return await this.storage
      .keys()
      .then(keys => {
        return Promise.resolve(
          keys.filter(key => {
            return key.includes(subprefix);
          })
        );
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  private getByKey(key: string): Promise<any> {
    return this.storage.get(key);
  }
}
