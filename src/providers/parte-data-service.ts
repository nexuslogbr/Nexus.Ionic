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
export class ParteDataService{
  url: string;
  token: string;

  constructor(
    public http: HttpClient,
    public authService: AuthService
  )
  {
    this.url = this.authService.getUrl();
    this.token = this.authService.getToken();
  }

  public listar() {
    let url = this.url + '/Parte/Listar';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

}
