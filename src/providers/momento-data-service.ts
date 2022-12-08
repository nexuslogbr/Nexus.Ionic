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
export class MomentoDataService {
  urlApi: string;

  constructor(
      private http: HttpClient,
      private authService: AuthService
    )
    {
    this.urlApi = this.authService.getUrl();
  }

  public listar() {
    let url = this.urlApi + '/momento/Listar';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }
}
