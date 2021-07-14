import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../model/usuario';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class AuthService {
  loginData: any;
  data: any;
  chassi = new Array();
  chassiData: any;
  novoVeiculoData: any;
  veiculoTemp: any;
  dispositivo: any;
  conexaoNome: string;
  novoRomaneio = {
    romaneioID: 0,
    tipoID: 0,
    data: '',
    transportadoraCNPJID: 0,
    transportadoraNome: '',
    placa: '',
    frota: '',
    chassis: [],
  };
  bolsaoFila: any;
  layout: string;
  romaneioData: any;
  layoutNome: string;
  posicao: string;
  proximaPosicao: string;
  proximoBolsao: string;
  forcarFila: string;
  //url: string = "http://192.168.4.157:8585/api";
  //url: string = 'http://192.168.4.157:1655/api';
  //url: string = 'api';
  //url: string = "http://app.nexuslogbr.com/webapi/api";

  //url: string = 'http://api-devpatio.validasistema.com.br/ ';
  url: string = 'http://api-hlgpatio.validasistema.com.br/api';
  //url: string = "http://vm.trial.validasistema.com.br/webapi/api";

  // headers: any =  {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'};

  private LOGIN_KEY = 'login_data';

  constructor(
    public storage: Storage,
    private http: HttpClient,
    public platform: Platform,
    private screenOrientation: ScreenOrientation
  ) {
    // this.criarNovoRomaneio(this.novoRomaneio);
  }

  showLoading() {
    $('modal-loading').css('display', 'block');
  }

  hideLoading() {
    $('modal-loading').css('display', 'none');
  }

  showLoadingWhite() {
    $('modal-loading-white').css('display', 'block');
  }

  hideLoadingWhite() {
    $('modal-loading-white').css('display', 'none');
  }

  showDownload() {
    $('modal-downloading').css('display', 'block');
  }

  hideDownload() {
    $('modal-downloading').css('display', 'none');
  }

  showDatabaseSaving() {
    $('modal-database').css('display', 'block');
  }

  hideDatabaseSaving() {
    $('modal-database').css('display', 'block');
  }

  showSincronizacao() {
    $('modal-sincronizando').css('display', 'block');
  }

  hideSincronizacao() {
    $('modal-sincronizando').css('display', 'none');
  }

  getDispositivoCadastrado(code, version) {
    let url =
      this.getUrl() +
      '/Dispositivo/Consultar?code=' +
      code +
      '&version=' +
      version;
    return this.http
      .get(url)
      .do((res: Response) => console.log(res))
      .map((res: Response) => res.json());
  }

  get(url) {
    return this.http
      .get(url)
      .do((res: Response) => console.log(res))
      .map((res: Response) => res.json());
  }

  post(url, parameter) {
    return this.http
      .post(url, parameter, httpOptions)
      .do((res: Response) => console.log(res));
  }

  getUrl() {
    return this.url;
  }

  nomeConexao() {
    return this.conexaoNome;
  }

  setNomeUrl(nomeUrl) {
    this.conexaoNome = nomeUrl;
  }

  getDispositivo() {
    this.storage.get('dispositivo').then(
      function data(data) {
        if (data != null) {
          console.log(data);
          // this.dispositivo = data;
          return data;
        } else {
          return '';
        }
      },
      (error) => console.error(error)
    );
  }

  salvarDispositivo(codigo) {
    this.storage.set('dispositivo', codigo);
  }

  Dispositivo(dados) {
    this.storage.set('dispositivo', dados).then(
      () => console.log(dados),
      (error) => console.error('Error storing item', error)
    );

    this.storage.get('dispositivo').then(
      function data(data) {
        if (data != null) {
          this.dispositivo = data;
        }
      },
      (error) => console.error(error)
    );
  }

  // ConsultarDispositivo(urlDispositivo){

  //   this.http.get(urlDispositivo, {}, {})
  //   .then(data => {
  //     this.data = data.data;

  //     if(this.data.sucesso){
  //       return this.data.retorno;
  //       // this.authService.hideLoading();

  //     }else{
  //       this.authService.hideLoading();
  //       this.storage.remove('Dispositivo');
  //       // this.openModalDevice(this.code);
  //       // this.openModalErroCode(this.responseData.mensagem);
  //     }

  //     console.log(data.status);
  //     console.log(data.data); // data received by server
  //     console.log(data.headers);

  //   })
  //   .catch(error => {

  //     this.authService.hideLoading();
  //     // this.openModalErroCode(error.status+' - '+error.statusText);
  //     console.log(error.error);

  //     console.log(error.status);
  //     console.log(error.error); // error message as string
  //     console.log(error.headers);

  //   });
  // }

  public getLoginData() {
    return this.storage.get(this.LOGIN_KEY);
  }

  public setLoginData(loginData: Usuario) {
    this.loginData = loginData;
    return this.storage.set(this.LOGIN_KEY, loginData);
  }

  public removeSession() {
    this.loginData = '';
    return this.storage.remove(this.LOGIN_KEY);
  }

  public removeDevice() {
    this.storage.remove('dispositivo');
    this.storage.get('dispositivo').then(
      function data(data) {
        if (data != null) {
          if (data != null) {
            this.storage.remove('dispositivo');
          }
        }
      },
      (error) => console.error(error)
    );
  }

  public getUserData() {
    return this.loginData;
  }

  public getLocalModoOperacao(): number {
    return this.loginData.localModoOperacao;
  }

  public getToken() {
    return this.loginData.token;
  }

  public getChassi() {
    return this.chassiData.chassi;
  }

  public getVeiculoID() {
    return this.chassiData.id;
  }

  public setNovoVeiculo(chassi) {
    this.novoRomaneio.chassis.push(chassi);
    console.log(this.novoRomaneio);
  }

  public removeVeiculo(veiculo) {
    if (this.novoRomaneio.chassis != null) {
      for (var i = 0; i < this.novoRomaneio.chassis.length; i++) {
        if (this.novoRomaneio.chassis[i] == veiculo) {
          this.novoRomaneio.chassis.splice(i, 1);
        }
      }
    }
  }

  public setVeiculoTemp(responseData) {
    this.storage.set('VeiculoTemp', responseData).then(
      () => console.log(responseData),
      (error) => console.error('Error storing item', error)
    );

    this.storage.get('VeiculoTemp').then(
      function data(data) {
        if (data != null) {
          return data;
        }
      },
      (error) => console.error(error)
    );
  }

  public getNovoVeiculo() {
    return this.veiculoTemp;
  }

  //ROMANEIO
  public getNovoRomaneio() {
    // return this.chassiData.chassi;
    return this.novoRomaneio;
  }

  public setRomaneioTempChassis(chassi) {
    console.log(this.chassi);
    if (this.chassi.indexOf(chassi) == -1) {
      this.chassi.push(chassi);
      console.log(this.chassi);
    } else {
      console.log(this.chassi);
    }

    console.log(this.chassi);
  }

  public setRomaneioChassis(chassi) {
    this.novoRomaneio.chassis = chassi;
  }

  public setRomaneioData(data) {
    this.novoRomaneio.data = data;
  }

  public setRomaneioTransportadora(transportadora) {
    this.novoRomaneio.transportadoraCNPJID = transportadora;
  }

  public setRomaneioTipoID(tipoid) {
    this.novoRomaneio.tipoID = tipoid;
  }

  public setRomaneioPlaca(placa) {
    this.novoRomaneio.placa = placa;
  }

  public setRomaneioTransportadoraNome(transportadoraNome) {
    this.novoRomaneio.transportadoraNome = transportadoraNome;
  }

  public setRomaneioFrota(frota) {
    this.novoRomaneio.frota = frota;
  }

  public limparRomaneio() {
    this.novoRomaneio = {
      romaneioID: 0,
      tipoID: 0,
      data: '',
      transportadoraCNPJID: 0,
      transportadoraNome: '',
      placa: '',
      frota: '',
      chassis: [],
    };
    // this.storage.remove('NovoVeiculo');
    this.chassi = new Array();
    this.chassiData = {};
    this.novoVeiculoData = {};
    // this.storage.remove('VeiculoTemp');
  }

  public getRomaneioChassis() {
    return this.chassi;
  }

  public getRecebeChassi() {
    return this.chassiData.chassi;
  }

  public addRomaneio(data) {
    this.romaneioData = data;
    console.log(this.romaneioData);
  }

  public pegaRomaneio() {
    return this.romaneioData;
  }

  public getLocalAtual() {
    return this.loginData.localNome;
  }

  public getUserName() {
    return this.loginData.nome;
  }

  public getUserEmail() {
    return this.loginData.email;
  }

  // RECEBER / PARQUEAR

  public setLayout(layout) {
    this.layout = layout;
  }

  setLayoutNome(layoutNome) {
    this.layoutNome = layoutNome;
  }

  setProximaPosicao(proximaPosicao) {
    this.proximaPosicao = proximaPosicao;
  }

  setFila(fila) {
    this.forcarFila = fila;
  }

  getFila() {
    return this.forcarFila;
  }

  setProximoBolsao(proximoBolsao) {
    this.proximoBolsao = proximoBolsao;
  }

  setPosicao(posicao) {
    this.posicao = posicao;
  }

  getProximaPosicao() {
    return this.proximaPosicao;
  }

  getLayoutNome() {
    return this.layoutNome;
  }

  getLayout() {
    return this.layout;
  }

  showError(responseData) {
    $('modal-error').css('display', 'block');
    $('#mensagem').text(responseData);
  }

  hideError() {
    $('modal-error').css('display', 'none');
  }

  showModalRecebimento() {
    $('modal-recebimento').css('display', 'block');
  }

  hideModalRecebimento() {
    $('modal-recebimento').css('display', 'none');
  }

  getCurrentScreenOrientation() {
    alert(this.screenOrientation.type);
  }

  observeScreenOrientation() {
    this.screenOrientation
      .onChange()
      .subscribe(() => console.log('A orientação mudou'));
  }
}
// "proxies":[{
//     "path":"/api",
//     "proxyUrl":"http://patioautomotivo.com.br/webapi/api"
// }]

// "proxies":[{
//     "path":"/api",
//     "proxyUrl":"http://devpatio.validasistema.com.br/webapi/api"
// }]

// "proxies":[{
//     "path":"/api",
//     "proxyUrl":"http://orion.hlgpatio.validasistema.com.br/webapi/api"
// }]

//PARA RODAR EM MODO DESENVOLVEDOR NO BROWSER
//comentar o conteudo do metodo DeviceOrientation()
//colocar o proxy no ionic.config.json
//comentar a url
// url: string = "http://devpatio.validasistema.com.br/webapi/api/";
// descomentar a url
//url: string = "api/";
//descomentar do index a linha
//<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline' *; object-src 'self'; style-src 'self' 'unsafe-inline'; media-src *">
