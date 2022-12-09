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
  token: string;

  constructor(
      private http: HttpClient,
      private authService: AuthService
    )
    {
    this.urlApi = this.authService.getUrl();
    this.token = this.authService.getToken();
  }

  public vistoriarVeiculo(veiculoID) {
    let url = this.urlApi + '/Vistoriar/VistoriarVeiculo';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken(), veiculoID: veiculoID}, httpOptions);
  }

  public consultarChassi(chassi:string) {
    let url = this.urlApi + '/Vistoriar/ConsultarChassi';
    let model = {
      chassi: chassi,
      token: this.token
    }
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public vistoriadores() {
    let url = this.urlApi + '/Vistoriar/Vistoriadores';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

}
