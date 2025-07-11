import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service/auth-service';
import { Arquivo } from '../model/arquivo';
import { DataRetorno } from '../model/dataretorno';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable()
export class ArquivoDataService {
  urlApi: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.urlApi = this.authService.getUrl();
  }

  public carregarArquivosDePlanilhasConferencia(
    somenteComConferenciaConfigurada?: boolean,
    somenteComConferenciaFinalizada?: boolean,
    somenteDisponiveisParaConfiguracao?: boolean,
    somenteDisponiveisParaFechamento?: boolean,
  ) {
    let url =
      this.urlApi +
      '/arquivos?token=' +
      this.authService.getToken() +
      '&arquivoTipo=5';

    if (somenteComConferenciaConfigurada != null) {
      url += '&somenteComConferenciaConfigurada=' + somenteComConferenciaConfigurada;
    }

    if (somenteComConferenciaFinalizada != null) {
      url += '&somenteComConferenciaFinalizada=' + somenteComConferenciaFinalizada;
    }

    if (somenteDisponiveisParaConfiguracao!=null) {
      url += '&somenteDisponiveisParaConfiguracao=' + somenteDisponiveisParaConfiguracao;
    }

    if (somenteDisponiveisParaFechamento!=null) {
      url += '&somenteDisponiveisParaFechamento=' + somenteDisponiveisParaFechamento;
    }

    return this.http.get<any>(url, { headers: headers });
  }

  public finalizarConferencia(arquivoId: number) {
    let url =
      this.urlApi +
      '/arquivos/' +
      arquivoId +
      '/finalizar-conferencia?token=' +
      this.authService.getToken();

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  public liberarConferencia(arquivoId: number) {
    let url =
      this.urlApi +
      '/arquivos/' +
      arquivoId +
      '/liberar-conferencia?token=' +
      this.authService.getToken();

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }
}
