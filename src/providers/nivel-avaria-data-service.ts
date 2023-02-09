import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service/auth-service';
import { DataRetorno } from '../model/dataRetorno';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class NivelAvariaDataService {
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
    let url = this.urlApi + '/nivelgravidadeavaria/ListarNivelGravidadeAvaria?token=' + this.token;
    return this.http.get<DataRetorno>(url, { headers: headers });
  }
}
