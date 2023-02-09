import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service/auth-service';
import { DataRetorno } from '../model/dataretorno';

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class NavioDataService {
  urlApi: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.urlApi = this.authService.getUrl();
  }

  public carregarNavios(
    somenteDisponiveis: boolean,
    somenteComConferenciaConfigurada?: boolean,
    somenteComConferenciaFinalizada?: boolean,
    somenteDisponiveisParaConfiguracao?: boolean,
    somenteDisponiveisParaFechamento?: boolean
  ) {
    let url = this.urlApi + '/navios?token=' + this.authService.getToken();
    if (somenteDisponiveis) {
      url += '&somenteDisponiveis=true';
    }
    if (somenteComConferenciaConfigurada!=null) {
      url += '&somenteComConferenciaConfigurada=' + somenteComConferenciaConfigurada;
    }
    if (somenteComConferenciaFinalizada!=null) {
      url += '&somenteComConferenciaFinalizada=' + somenteComConferenciaFinalizada;
    }
    if (somenteDisponiveisParaConfiguracao!=null) {
      url += '&somenteDisponiveisParaConfiguracao=' + somenteDisponiveisParaConfiguracao;
    }
    if (somenteDisponiveisParaFechamento!=null) {
      url += '&somenteDisponiveisParaFechamento=' + somenteDisponiveisParaFechamento;
    }

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarNavioOperacoes(navioId: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/operacoes?token=' +
      this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarNavioOperacoesCrossConferenciaLote(navioId: number, conferenciaLoteGUI: string) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/operacoes-cross-conferencia-lote?token=' +
      this.authService.getToken() + '&conferenciaLoteGUI=' + conferenciaLoteGUI;
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarNavioComEscala(navioId: number, comChassis: boolean) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/?token=' +
      this.authService.getToken() +
      '&comChassis=' +
      comChassis;
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarTipoOperacoes(navioId: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/tipos-operacoes?token=' +
      this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarDestinos(navioId: number, tipoOperacao?: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/destinos?token=' +
      this.authService.getToken();

    if (tipoOperacao) {
      url += '&tipoOperacao=' + tipoOperacao;
    }
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public carregarTotais(navioId: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/totais/?token=' +
      this.authService.getToken();

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public atualizarDisponibilidadeConferencia(
    navioId: number,
    disponivelConferencia: boolean
  ) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/disponivel-conferencia?disponivelConferencia=' +
      disponivelConferencia +
      '&token=' +
      this.authService.getToken();

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  public liberarConferencia(navioId: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/liberar-conferencia?token=' +
      this.authService.getToken();

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  public finalizarConferencia(navioId: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/finalizar-conferencia?token=' +
      this.authService.getToken();

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  public reabrirConferencia(navioId: number) {
    let url =
      this.urlApi +
      '/navios/' +
      navioId +
      '/reabrir-conferencia?token=' +
      this.authService.getToken();

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  public carregarNaviosVistoria() {
    let url = this.urlApi + '/navios/vistoria/lista?token=' + this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public listar() {
    let url = this.urlApi + '/navios/listar';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

}
