import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataRetorno } from "../model/DataRetorno";
import { AuthService } from "./auth-service/auth-service";

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AvariaDataService{
  urlApi: string;

  constructor(
    public http: HttpClient,
    public authService: AuthService
  )
  {
    this.urlApi = this.authService.getUrl();
  }

  public carregarposicaoAvarias() {
    let url = this.urlApi + '/posicaosuperficiechassi/ListarPosicaoSuperficieChassi?token=' + this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarTipoAvarias() {
    let url = this.urlApi + '/tipoavaria/listartiposavaria?token=' + this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarAvarias(model: any){
    let url = this.urlApi + '/lancamentoAvaria/Dashboard';
    return this.http.post<string>(url, model, httpOptions);
  }

  public listarAvaria(model:any) {
    let url = this.urlApi + '/lancamentoAvaria/Listar';
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public salvar() {
    let url = this.urlApi + '/tipoavaria/Salvar';
    return this.http.post<DataRetorno>(url, { headers: headers });
  }

  public consultarChassi(model: any){
    let url = this.urlApi + '/lancamentoAvaria/ConsultarChassi';
    model.token = this.authService.getToken();
    return this.http.post<string>(url, model, httpOptions);
  }
}
