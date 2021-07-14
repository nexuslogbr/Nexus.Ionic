import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service/auth-service';
import { ConferenciaNavioLote } from '../model/conferencia-navio-lote';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ConferenciaNavioLoteDataService {

  urlApi: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.urlApi = this.authService.getUrl();
  }

  public listarLotes(navioId: number) {
    let url =
      this.urlApi +
      '/conferencias/lotes/navios/' + navioId + '/?token=' +
      this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public carregarLote(id: number) {
    let url =
      this.urlApi +
      '/conferencias/lotes/' + id + '/?token=' +
      this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public abrirLote(lote: ConferenciaNavioLote) {
    let url =
      this.urlApi +
      '/conferencias/lotes/navios/' + lote.navioID + '/abrir-lote?token=' +
      this.authService.getToken();
    return this.http.post<any>(url, JSON.stringify(lote), { headers: headers });
  }

  public reabrirLote(id: number) {
    let url =
      this.urlApi +
      '/conferencias/lotes/' + id + '/reabrir?token=' +
      this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public fecharLote(id: number) {
    let url =
      this.urlApi +
      '/conferencias/lotes/' + id + '/fechar?token=' +
      this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

}
