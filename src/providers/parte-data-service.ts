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
    return this.http.get<DataRetorno>(this.url + "/Parte/Partes?token=" + this.authService.getToken(), httpOptions);
  }

}
