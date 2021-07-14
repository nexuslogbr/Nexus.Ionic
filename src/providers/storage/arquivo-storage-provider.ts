import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Arquivo } from "../../model/arquivo";

@Injectable()
export class ArquivoStorageProvider {

    private prefixKey: string = "_arquivo";

    constructor(public storage: Storage) {

    }

    public persistArquivo(arquivo: Arquivo, ususarioId: number): Promise<any> {
        let key = this.prefixKey + "_" + ususarioId + "_" + arquivo.id;
        return this.storage.set(key, arquivo);
    }

    public getArquivoIds(ususarioId: number) {
        let subprefix = this.prefixKey + "_" + ususarioId + "_";
        return this.storage.keys().then((keys) => {
            return Promise.resolve(keys.filter(k => k.includes(subprefix)).map(k => { return parseInt(k.replace(subprefix, '')); }))
        }).catch(error => { return Promise.reject(error); });
    }

    public getArquivo(arquivoId: number, ususarioId: number) {
        let key = this.prefixKey + "_" + ususarioId + "_" + arquivoId;
        return this.storage.get(key);
    }

}
