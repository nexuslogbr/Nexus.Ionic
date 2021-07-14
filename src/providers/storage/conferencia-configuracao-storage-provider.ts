import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Navio } from "../../model/navio";

@Injectable()
export class ConferenciaConfiguracaoStorageProvider {

    private prefixKey: string = "_conferenciaConfiguracao";

    constructor(public storage: Storage) {

    }

    public persistConfiguracao(configuracao: any, ususarioId: number): Promise<any> {
        let key = this.getKey(ususarioId)
        return this.storage.set(key, configuracao);
    }

    public getConfiguracao(ususarioId: number) {
        let key = this.getKey(ususarioId);
        return this.storage.get(key);
    }

    private getKey(ususarioId: number) {
        return this.prefixKey + "_" + ususarioId;
    }

}
