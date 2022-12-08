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
export class GeneralMotorsDataService {
  urlApi: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  )
  {
    this.urlApi = this.authService.getUrl();
  }

  public qualityinconsistences() {
    let url = this.urlApi + '/generalMotors/qualityinconsistences';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public checkPoints() {
    let url = this.urlApi + '/generalMotors/checkPoints';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public companies() {
    let url = this.urlApi + '/generalMotors/companies';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public severity() {
    let url = this.urlApi + '/generalMotors/severity';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public parts() {
    let url = this.urlApi + '/generalMotors/Parts';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public places() {
    let url = this.urlApi + '/generalMotors/places';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public trips() {
    let url = this.urlApi + '/generalMotors/trips';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public ships() {
    let url = this.urlApi + '/generalMotors/ships';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public listSurveyors() {
    let url = this.urlApi + '/generalMotors/surveyor/ListSurveyors';
    return this.http.post<DataRetorno>(url, {token: this.authService.getToken()}, httpOptions);
  }

  public insertsurvey(model:any) {
    let url = this.urlApi + '/generalMotors/survey/insertsurvey';
    let data = {
      token: this.authService.getToken(),
      survey: model
    }

    console.clear();
    console.log(data);


    return this.http.post<DataRetorno>(url, data, httpOptions);
  }
}
