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
export class GravidadeDataService{
  urlApi: string;
  token: string;

  constructor(
      private http: HttpClient,
      private authService: AuthService
    )
    {
    this.urlApi = this.authService.getUrl();
    this.token = this.authService.getToken();
  }

  public listar() {
    let url = this.urlApi + '/gravidadeAvaria/Listar';
    return this.http.post<DataRetorno>(url, {token: this.token}, httpOptions);
  }
}
