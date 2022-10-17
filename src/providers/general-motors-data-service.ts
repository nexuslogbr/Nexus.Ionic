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
export class GeneralMotorsDataService {
  urlApi: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  )
  {
    this.urlApi = this.authService.getUrl();
  }

  public qualityinconsistences(model: any) {
    let url = this.urlApi + '/generalMotors/qualityinconsistences?token=' + this.authService.getToken();
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public checkPoints(model: any) {
    let url = this.urlApi + '/generalMotors/checkPoints?token=' + this.authService.getToken();
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public companies(model: any) {
    let url = this.urlApi + '/generalMotors/companies?token=' + this.authService.getToken();
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public severity(model: any) {
    let url = this.urlApi + '/generalMotors/severity?token=' + this.authService.getToken();
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public trips(model: any) {
    let url = this.urlApi + '/generalMotors/trips?token=' + this.authService.getToken();
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }

  public insertsurvey(model: any) {
    let url = this.urlApi + '/generalMotors/insertsurvey?token=' + this.authService.getToken();
    model.token = this.authService.getToken();
    return this.http.post<DataRetorno>(url, model, httpOptions);
  }
}
