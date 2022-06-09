import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import * as $ from 'jquery';
import { Navio } from '../../model/navio';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Local } from '../../model/local';
import { ConferenciaExecucaoPage } from '../conferencia-execucao/conferencia-execucao';
import { ConferenciaConfiguracaoStorageProvider } from '../../providers/storage/conferencia-configuracao-storage-provider';
import { ConferenciaNavioLote } from '../../model/conferencia-navio-lote';
import { ConferenciaNavioLoteDataService } from '../../providers/conferencia-navio-lote-data-service';
import { UUID } from 'angular2-uuid';
import { finalize } from 'rxjs/operators/finalize';

@Component({
  selector: 'page-conferencia-destino',
  templateUrl: 'conferencia-destino.html'
})
export class ConferenciaDestinoPage {
  isOnline: boolean = false;
  navio: Navio;
  areas: any[] = [];
  tipoConferencias: any[] = [];
  turnos: any[] = [];
  destinos: Local[] = [];
  area: any;
  tipoConferencia: any;
  turno: any;
  destino: Local;
  usuario: string;
  userData: any;
  showDestino: boolean = true;
  conferenciaNavioLote: ConferenciaNavioLote;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public conferenciaDataService: ConferenciaDataService,
    public conferenciarNavioLoteDataService: ConferenciaNavioLoteDataService,
    public conferenciaConfiguracaoStorageProvider: ConferenciaConfiguracaoStorageProvider,
    public authService: AuthService,
    public alertCtrl: AlertController
  ) {
    this.isOnline = navParams.data.isOnline;
    this.navio = navParams.data.navio;
    this.destinos = this.getDestinos(this.navio);
    this.userData = authService.getUserData();
    if (navParams.data.conferenciaNavioLote) {
      this.conferenciaNavioLote = navParams.data.conferenciaNavioLote;
    }

    this.showDestino = this.navio.operacoes.some(op => {
      return op.tipoOperacao == 1;
    });

    if (!this.showDestino) {
      this.destino = this.destinos[0];
    }
  }

  getDestinos(navio: Navio) {
    let destinos: Local[] = [];
    if (navio.operacoes && navio.operacoes.length) {
      navio.operacoes.forEach(o => {
        if (o.lotes && o.lotes.length) {
          o.lotes.forEach(l => {
            if (destinos.find(d => d.id == l.destino.id) == null) {
              destinos.push(l.destino);
            }
          });
        }
      });
    }
    return destinos;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaDestinoPage');

    if (this.isOnline) {
      this.authService.showLoading();
      this.conferenciaDataService.carregarConfiguracoes().subscribe(
        res => {
          console.log('res', res);
          if (res.sucesso) {
            console.log(res);
            this.turnos = res.retorno.turnos;
            this.areas = res.retorno.areas;
            this.tipoConferencias = res.retorno.tipoConferencias;
            if (this.userData.confereOnline || this.userData.confereOffline) {
              this.tipoConferencia = this.tipoConferencias.find(tc => tc.eTipo == 1);
            }

            if (this.conferenciaNavioLote) {
              this.area = this.areas.find(a => a.id == this.conferenciaNavioLote.areaID);
              this.tipoConferencia = this.tipoConferencias.find(a => a.id == this.conferenciaNavioLote.conferenciaID);
              this.turno = this.turnos.find(a => a.id == this.conferenciaNavioLote.turnoID);
              this.destino = this.destinos.find(a => a.id == this.conferenciaNavioLote.destinoID);
            }
          }
        },
        error => {
          console.log('error', error);
        },
        () => {
          this.authService.hideLoading();
        }
      );
    } else {
      this.conferenciaConfiguracaoStorageProvider
        .getConfiguracao(this.authService.getUserData().id)
        .then(config => {
          this.turnos = config.turnos;
          this.areas = config.areas;
          this.tipoConferencias = config.tipoConferencias;

          if (this.userData.confereOnline || this.userData.confereOffline) {
            this.tipoConferencia = this.tipoConferencias.find(tc => tc.eTipo == 1);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  voltar() {
    this.navCtrl.pop();
  }

  onChangeArea(id) {
    this.area = this.areas.find(a => a.id == id);
  }

  onChangeTipoConferencia(id) {
    this.tipoConferencia = this.tipoConferencias.find(a => a.id == id);
  }

  onChangeTurno(id) {
    this.turno = this.turnos.find(a => a.id == id);
  }

  onChangeDestino(id) {
    this.destino = this.destinos.find(a => a.id == id);
  }

  continuar() {
    this.navCtrl.push(ConferenciaExecucaoPage, {
      navio: this.navio,
      area: this.area,
      tipoConferencia: this.tipoConferencia,
      turno: this.turno,
      destino: this.destino,
      usuario: this.usuario,
      isOnline: this.isOnline,
      conferenciaNavioLote: this.conferenciaNavioLote
    });
  }

  finalizar() {

    if (this.isOnline) {
      this.authService.showLoading();

      this.conferenciarNavioLoteDataService.carregarLote(this.conferenciaNavioLote.id).pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
        .subscribe(res => {
          console.log('res', res);
          if (res.sucesso) {
            let lote = <ConferenciaNavioLote>res.retorno;

            if (lote.totalConferidos < lote.totalVeiculos) {
              this.showConfirmacaoFinalizar();
            } else {
              this.fecharLote();
            }
          } else {
            this.showError();
          }
        },
          error => {
            console.log('error', error);
            this.showError();
          });
    }

  }

  iniciarNovaConferencia() {

    let lote = new ConferenciaNavioLote();
    lote.areaID = this.area.id;
    lote.navioID = this.navio.id;
    lote.conferenciaID = this.tipoConferencia ? this.tipoConferencia.id : null;
    lote.turnoID = this.turno ? this.turno.id : null;
    lote.destinoID = this.destino ? this.destino.id: null;
    lote.conferenciaLoteGUI = UUID.UUID();

    if (this.isOnline) {
      this.authService.showLoading();
      this.conferenciarNavioLoteDataService.abrirLote(lote).pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
        .subscribe(res => {
          console.log('res', res);
          if (res.sucesso) {
            this.conferenciaNavioLote = res.retorno;
            this.continuar();
          } else {
            this.showError();
          }
        },
          error => {
            console.log('error', error);
            this.showError();
          });
    }
    // TODO: passa para a próxima página
  }

  showError() {
    this.alertCtrl
      .create({
        title: 'Atenção',
        message: 'Ocorreu um erro ao carregar os dados!',
        buttons: ['Continuar']
      })
      .present();
  }

  showConfirmacaoFinalizar() {
    let alert = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Nem todos os chassis foram conferidos!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.fecharLote();
          }
        }
      ]
    });
    alert.present();
  }

  fecharLote() {
    if (this.isOnline) {
      this.authService.showLoading();
      this.conferenciarNavioLoteDataService.fecharLote(this.conferenciaNavioLote.id).pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
        .subscribe(res => {
          console.log('res', res);
          if (res.sucesso) {
            this.navCtrl.pop();
          } else {
            this.showError();
          }
        },
          error => {
            console.log('error', error);
            this.showError();
          });
    }

  }
}
