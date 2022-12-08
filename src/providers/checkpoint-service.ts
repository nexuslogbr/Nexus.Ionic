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
export class CheckpointDataService {
  urlApi: string;

  constructor(
      private http: HttpClient,
      private authService: AuthService
  )
  {
    this.urlApi = this.authService.getUrl();
  }

  public carregar(model:any) {
    model.Token = this.authService.getToken();
    let url = this.urlApi + '/checklist/Carregar';
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public listar() {
    let url = this.urlApi + '/checklist/listar';
    return this.http.post<DataRetorno>(url, { token: this.authService.getToken() }, httpOptions);
  }

  public CarregarChecklist(model:any) {
    model.Token = this.authService.getToken();
    let url = this.urlApi + '/checklist/CarregarChecklist';
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }
}
