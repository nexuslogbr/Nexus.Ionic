import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataRetorno } from "../model/dataRetorno";
import { AuthService } from "./auth-service/auth-service";


const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class VeiculoDataService {
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

  public busarVeiculo(chassi: string) {
    let url = this.urlApi + '/veiculos/ConsultarChassi?token=' + this.token + '&chassi=' + chassi;
    return this.http.get<DataRetorno>(url);
  }

  public busarVeiculoStakeholder(chassi: string) {
    let url = this.urlApi + '/veiculos/ConsultarChassi?token=' + this.token + '&chassi=' + chassi;
    return this.http.get<DataRetorno>(url);
  }
}
