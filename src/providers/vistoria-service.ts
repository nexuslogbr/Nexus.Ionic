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
export class VistoriaDataService {
  urlApi: string;

  constructor(
      private http: HttpClient,
      private authService: AuthService
    )
    {
    this.urlApi = this.authService.getUrl();
  }

  public vistoriarChassi(veiculoID) {
    let url = this.urlApi + '/Vistoriar/VistoriarVeiculo?token=' + this.authService.getToken() + '&veiculoID=' +  veiculoID;
    return this.http.put<DataRetorno>(url, { });
  }

  public vistoriadores() {
    let url = this.urlApi + '/Vistoriar/Vistoriadores';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

}
