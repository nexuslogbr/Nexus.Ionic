import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service/auth-service';
import { ConferenciaConfiguracaoCriacao } from '../model/conferencia-configuracao-criacao';
import { ConferenciaVeiculoMotivos } from '../model/conferencia-veiculo-motivos';
import { Conferencia } from '../model/Conferencia';
import { ConferenciaAnulacao } from '../model/conferencia-anulacao';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class ConferenciaDataService {
  urlApi: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.urlApi = this.authService.getUrl();
  }

  public carregarConfiguracoes() {
    let url = this.urlApi + '/conferencias/configuracoes?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public carregarConfiguracao(id: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/configuracoes/' + id + '/?token=' + token;
    return this.http.get<any>(url, { headers: headers });
  }

  public async carregarConfiguracaoAsync(id: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/configuracoes/' + id + '/?token=' + token;
    return this.http.get<any>(url, { headers: headers });
  }

  public consultarChassi(chassi: string, parteChassi: string, navioId: number, destinoLocalId: number
  ) {
    let url = this.urlApi + '/conferencias/chassis/navio?token=' + this.authService.getToken();

    if (chassi && chassi.length) {
      url += '&chassi=' + chassi;
    }

    if (parteChassi && parteChassi.length) {
      url += '&parteChassi=' + parteChassi;
    }

    url += '&navioId=' + navioId;
    url += '&destinoLocalId=' + destinoLocalId;

    return this.http.get<any>(url, { headers: headers });
  }

  public consultarChassiPlanilha(chassi: string, arquivoId: number) {
    let url = this.urlApi + '/conferencias/chassis/planilha?token=' + this.authService.getToken();

    url += '&chassi=' + chassi;
    url += '&arquivoId=' + arquivoId;

    return this.http.get<any>(url, { headers: headers });
  }

  conferirChassiNavio(data: {
    chassi: string;
    navioId: number;
    destinoId: number;
    areaId?: number;
    tipoConferenciaId: number;
    turnoId?: number;
    nomeUsuario: string;
    conferenciaLoteGUI: string;
  }): any {
    let url = this.urlApi + '/conferencias/navio/chassis?token=' + this.authService.getToken();
    return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  }

  conferirChassiPlanilha(data: { chassi: string; arquivoId: number }): any {
    let url = this.urlApi + '/conferencias/planilhas/chassis?token=' + this.authService.getToken();
    return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  }

  public listarConferenciaChassiResumo(arquivoId: number) {
    let url = this.urlApi + '/conferencias/planilhas/' + arquivoId + '/resumo?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  //conferencias/arquivos/{arquivoId}/disponivel-conferencia
  public atualizarDisponibilidadeArquivoConferencia( arquivoId: number, disponivelConferencia: boolean ) {
    let url = this.urlApi + '/conferencias/arquivos/' + arquivoId + '/disponivel-conferencia?disponivelConferencia=' + disponivelConferencia + '&token=' + this.authService.getToken();
    return this.http.put<any>(url, {}, { headers: headers });
  }

  public listarPlanilhas( somenteDisponiveisParaConferencia: boolean, somenteFinalizados?: boolean
  ) {
    //DisponivelConferencia
    let url = this.urlApi + '/arquivos?token=' + this.authService.getToken() + '&somenteDisponiveisParaConferencia=' + somenteDisponiveisParaConferencia + '&arquivoTipo=5';

    if (somenteFinalizados) {
      url += '&somenteFinalizados=true';
    } else {
      url += '&somenteFinalizados=false';
    }

    return this.http.get<any>(url, { headers: headers });
  }

  public carregarPlanilha(arquivoId: number, comChassis: boolean) {
    let url = this.urlApi + '/conferencias/planilhas/' + arquivoId + '?token=' + '&comChassis=' + comChassis;
    return this.http.get<any>(url, { headers: headers });
  }

  public listarNavioAreas(navioId: number) {
    let url = this.urlApi + '/conferencias/navios/' + navioId + '/areas/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public listarNavioDispositivos(navioId: number) {
    let url = this.urlApi + '/conferencias/navios/' + navioId + '/dispositivos/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public listarArquivoDispositivos(arquivoId: number) {
    let url = this.urlApi + '/conferencias/arquivos/' + arquivoId + '/dispositivos/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public listarArquivoAreas(navioId: number) {
    let url = this.urlApi + '/conferencias/arquivos/' + navioId + '/areas/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public listarArquivoConferenciaConfiguracoes(arquivoId: number) {
    let url = this.urlApi + '/conferencias/arquivos/' +  arquivoId + '/configuracoes/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public listarNavioConferenciaConfiguracoes(navioId: number) {
    let url = this.urlApi + '/conferencias/navios/' + navioId + '/configuracoes/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public listarConferenciaTipos() {
    let url = this.urlApi + '/conferencias/tipos/' + '?token=' + this.authService.getToken();
    return this.http.get<any>(url, { headers: headers });
  }

  public salvarConferenciaConfiguracoes( configuracoes: ConferenciaConfiguracaoCriacao ) {
    let url = this.urlApi + '/conferencias/configuracoes?token=' + this.authService.getToken();
    return this.http.post<any>(url, JSON.stringify(configuracoes), { headers: headers, });
  }

  listarConfiguracoesDisponiveisDispositivo() {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/configuracoes/disponiveis?token=' + token;
    return this.http.get<any>(url, { headers: headers, });
  }

  listarConfiguracoesFechamento(navioID?: number, arquivoID?: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/configuracoes/para-fechamento?token=' + token;

    if (navioID) {
      url += '&navioID=' + navioID;
    }

    if (arquivoID) {
      url += '&arquivoID=' + arquivoID;
    }

    return this.http.get<any>(url, {
      headers: headers,
    });
  }

  // conferirChassi(data: {
  //   chassi: string;
  //   turnoId: number;
  //   nomeUsuario: string;
  //   conferenciaConfiguracaoID: number;
  //   dataHoraConferencia: string;
  //   conferenciaVeiculoMotivoID: ConferenciaVeiculoMotivos;
  //   motivo?: string;
  // }): any {
  //   let url =
  //     this.urlApi +
  //     '/conferencias/chassis?token=' +
  //     this.authService.getToken();

  //   return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  // }

  /// Cria um lote na fila e retorna o GUID como identificador do lote.
  conferirChassisEmLote(data: Conferencia[], conferenciaConfiguracaoID: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/' + conferenciaConfiguracaoID + '/upload/?token=' + token;
    return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  }

  /// Cria um lote na fila e retorna o GUID como identificador do lote.
  async conferirChassisEmLotesAsync(data: Conferencia[], conferenciaConfiguracaoID: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/' + conferenciaConfiguracaoID + '/upload/?token=' + token;
    let result = this.http.post<any>(url, JSON.stringify(data), { headers: headers });
    return result;
  }

  // anularConferencia(data: {
  //   chassi: string;
  //   conferenciaConfiguracaoID: number;
  //   motivo: string;
  // }): any {
  //   let url =
  //     this.urlApi +
  //     '/conferencias/anular-conferencia?token=' +
  //     this.authService.getToken();
  //   return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  // }

  anularConferenciaEmLote(data: ConferenciaAnulacao[],conferenciaConfiguracaoID: number): any {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/' + conferenciaConfiguracaoID + '/anular-conferencia/?token=' + token;
    return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  }

  public listarConferenciaMotivos() {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/motivos/' + '?token=' + token;
    return this.http.get<any>(url, { headers: headers });
  }

  public finalizarConferencia(id: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/' + id + '/finalizar?token=' + token;
    return this.http.post<any>(url, JSON.stringify({}), { headers: headers });
  }

  public possuiConferenciaPendenteEmFila(conferenciaConfiguracaoId: number) {
    let token = this.authService.getToken();
    let url = this.urlApi + '/conferencias/' + conferenciaConfiguracaoId + '?token=' + token;
    return this.http.get<any>(url, { headers: headers });
  }
}
