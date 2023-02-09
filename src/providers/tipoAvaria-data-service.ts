import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataRetorno } from "../model/dataRetorno";
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
export class TipoAvariaDataService{
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

  public listar() {
    let url = this.urlApi + '/TipoAvaria/Listar';
    return this.http.post<DataRetorno>(url, {token: this.token}, httpOptions);
  }

}
