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
export class ResponsabilidadeAvariaDataService{
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
    return this.http.get<DataRetorno>(this.urlApi + "/responsabilidadeAvaria/Listar?token=" + this.token, httpOptions);
  }

}
