import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth-service/auth-service";
import { Romaneio } from "../model/romaneio";
import { DataRetorno } from "../model/dataretorno";
import { RomaneioDetalhe } from "../model/romaneioDetalhe";
import { Local } from "../model/local";

const headers = new HttpHeaders({
  "Content-Type": "application/json"
});

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable()
export class DataService {
  urlApi: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    ///console.log('Hello DataServiceProvider Provider');
    this.urlApi = this.authService.getUrl();
  }

  public cancelarChassi(romaneio: Romaneio) {
    let url =
      this.urlApi +
      "/Carregar/CancelarChassi?romaneioId=" +
      romaneio.romaneioId +
      "&romaneioDetalheId=" +
      romaneio.romaneioDetalheId +
      "&chassi=" +
      romaneio.chassi +
      "&token=" +
      this.authService.getToken() +
      "&cancelarFaturamento=false";

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  public consultarRomaneio(romaneio: Romaneio) {
    let url =
      this.urlApi +
      "/Carregar/ConsultarRomaneio?romaneioId=" +
      romaneio.romaneioId +
      "&romaneioDetalheId=" +
      romaneio.romaneioDetalheId +
      "&token=" +
      this.authService.getToken();
    //let consultarRomaneio = this.url+"/Carregar/ConsultarRomaneio?token="+this.authService.getToken()+"&romaneioID="+romaneioID+"&romaneioDetalheID="+id;

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  salvarCarregamentoEmConferencia(romaneioID, romaneioDetalheID) {
    console.log("salvarCarregamentoEmConferencia");
    this.authService.showLoading();
    let url =
      this.urlApi +
      "/Carregar/EmConferencia?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      romaneioID +
      "&romaneioDetalheID=" +
      romaneioDetalheID;

    return this.http.put<DataRetorno>(url, {}, httpOptions);
  }

  salvarEmCarregamento(romaneioID, romaneioDetalheID) {

    let url =
      this.urlApi +
      "/Carregar/EmCarregamento?token=" +
      this.authService.getToken() +
      "&romaneioID=" +
      romaneioID +
      "&romaneioDetalheID=" +
      romaneioDetalheID;

    return this.http.put<DataRetorno>(url, {}, httpOptions);
  }

  public cancelarCarregamento(romaneioDetalhe: RomaneioDetalhe) {
    let url =
      this.urlApi +
      "/Carregar/CancelarCarregamento?romaneioId=" +
      romaneioDetalhe.romaneioId +
      "&romaneioDetalheId=" +
      romaneioDetalhe.romaneioDetalheId +
      "&token=" +
      this.authService.getToken() +
      "&cancelarFaturamento=false";

    return this.http.put<DataRetorno>(url, {}, { headers: headers });
  }

  // Retorna uma lista dos veículos cancelados.
  public carregarVeiculosCancelados(data: string) {
    let url =
      this.urlApi +
      "/veiculos/cancelados" +
      "?token=" +
      this.authService.getToken();

    if (data) {
      url += "&data=" + data;
    }

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public consultarLayoutsDisponiveis() {
    let url =
      this.urlApi +
      "/Parquear/ListarLayouts?somenteDisponiveis=true&token=" +
      this.authService.getToken();

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public consultarBolsoesDisponiveis(layoutId: number) {
    let url =
      this.urlApi +
      "/Parquear/ListarBolsoes?somenteDisponiveis=true&token=" +
      this.authService.getToken() +
      "&layoutID=" +
      layoutId;

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public consultarLinhasDisponiveis(bolsaId: number) {
    let url =
      this.urlApi +
      "/Parquear/ListarLinhas?somenteDisponiveis=true&token=" +
      this.authService.getToken() +
      "&bolsaoID=" +
      bolsaId;

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public consultarPosicoesDisponiveis(linhaID: number) {
    let url =
      this.urlApi +
      "/Parquear/ListarPosicoes?somenteDisponiveis=true&token=" +
      this.authService.getToken() +
      "&linhaID=" +
      linhaID;

    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public listarLayouts(somenteAtivos: boolean) {
    let url =
      this.urlApi +
      "/layouts?token=" +
      this.authService.getToken() +
      "&somenteAtivos=" +
      somenteAtivos;
    return this.http.get<DataRetorno>(url, { headers: headers });
  }

  public listarBolsoesVagos(layoutId: number, somenteAtivos: boolean) {
    let url =
      this.urlApi +
      "/bolsoes/vagas?layoutId=" +
      layoutId +
      "&somenteAtivos=" +
      somenteAtivos +
      "&token=" +
      this.authService.getToken();
    return this.http.get<DataRetorno>(url, { headers: headers });
  }
}
