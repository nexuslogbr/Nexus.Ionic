import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataRetorno } from "../model/dataretorno";
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
  token: string;

  constructor(
    public http: HttpClient,
    public authService: AuthService
  )
  {
    this.urlApi = this.authService.getUrl();
    this.token = this.authService.getToken();
  }

  public listarPartes(model: any) {
    let url = this.urlApi + '/lancamentoAvaria/ListarPartesModelo';
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public carregarPosicaoAvarias() {
    let url = this.urlApi + '/posicaosuperficiechassi/ListarPosicaoSuperficieChassi?token=' + this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarTipoAvarias() {
    let url = this.urlApi + '/lancamentoAvaria/ListarTiposAvaria?token=' + this.authService.getToken();
    return this.http.post<DataRetorno>(url, { headers: headers });
  }

  public carregarAvarias(model: any){
    let url = this.urlApi + '/lancamentoAvaria/Dashboard';
    return this.http.post<string>(url, model, httpOptions);
  }

  public listarAvaria(model:any) {
    let url = this.urlApi + '/lancamentoAvaria/Listar';
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public salvar(model: any) {
    let url = this.urlApi + '/lancamentoAvaria/Salvar';
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public consultarChassi(model: any){
    let url = this.urlApi + '/lancamentoAvaria/ConsultarChassi';
    model.token = this.authService.getToken();
    return this.http.post<any>(url, JSON.stringify(model), { headers: headers });
    // return this.http.post<string>(url, model, httpOptions);
  }

  public uploadImagens(formData: FormData){
    let url = this.urlApi + '/lancamentoAvaria/xxxx';
    let model = {
      token: this.token,
      formData
    }
    return this.http.post<string>(url, model, httpOptions);
  }

  public getImagens(model:any){
    let url = this.urlApi + '/lancamentoAvaria/Imagens';
    model.token = this.token;
    return this.http.post<string>(url, model, httpOptions);
  }
}
