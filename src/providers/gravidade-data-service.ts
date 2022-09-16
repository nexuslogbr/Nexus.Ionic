import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataRetorno } from "../model/dataretorno";
import { AuthService } from "./auth-service/auth-service";

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable()
export class GravidadeDataService{
  urlApi: string;

  constructor(
      private http: HttpClient,
      private authService: AuthService
    )
    {
    this.urlApi = this.authService.getUrl();
  }

  public carregarGravidades() {
    let url = this.urlApi + '/gravidadeAvaria/Listar?token=' + this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }
}
