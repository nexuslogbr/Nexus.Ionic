import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Navio } from "../../model/navio";

@Injectable()
export class NavioStorageProvider {

    private prefixKey: string = "_navio";

    constructor(public storage: Storage) {

    }

    public persistNavio(navio: Navio, ususarioId: number): Promise<any> {
        let key = this.prefixKey + "_" + ususarioId + "_" + navio.id;
        return this.storage.set(key, navio);
    }

    public getNaviosIds(ususarioId: number) {
        let subprefix = this.prefixKey + "_" + ususarioId + "_";
        return this.storage.keys().then((keys) => {
            return Promise.resolve(keys.filter(k => k.includes(subprefix)).map(k => { return parseInt(k.replace(subprefix, '')); }))
        }).catch(error => { return Promise.reject(error); });
    }

    public getNavio(navioId: number, ususarioId: number) {
        let key = this.prefixKey + "_" + ususarioId + "_" + navioId;
        return this.storage.get(key);
    }
    
}