import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth-service/auth-service";
import { DataRetorno } from "../model/DataRetorno";

const headers = new HttpHeaders({
    "Content-Type": "application/json"
});

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    })
};

@Injectable()
export class CarregamentoExportacaoDataService {
    urlApi: string;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.urlApi = this.authService.getUrl();
    }

    public carregarCarregamentoStatus(navioId: number, tipoOperacao: number, destinoLocalId: number) {
        let url = this.urlApi + "/CarregarExportacao/carregamento-status?token=" + this.authService.getToken();
        url = url + "&navioId=" + navioId;
        url = url + "&tipoOperacao=" + tipoOperacao;
        url = url + "&destinoLocalId=" + destinoLocalId;
        return this.http.get<DataRetorno>(url, { headers: headers });
    }



}
