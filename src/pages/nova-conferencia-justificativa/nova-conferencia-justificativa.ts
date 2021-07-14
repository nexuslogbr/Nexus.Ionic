import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import * as $ from 'jquery';
import { ModalJustificativaNaoConferidoPage } from '../modal-justificativa-nao-conferido/modal-justificativa-nao-conferido';
import { Conferencia } from '../../model/Conferencia';
import { Veiculo } from '../../model/veiculo';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { ConferenciaConfiguracaoADO } from '../../providers/database/conferencia-configuracao-ado';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ModalJustificativaItemAnuladoPage } from '../modal-justificativa-item-anulado/modal-justificativa-item-anulado';
import { ModalJustificativaIncluirConferenciaPage } from '../modal-justificativa-incluir-conferencia/modal-justificativa-incluir-conferencia';
import { ConferenciaAnulacao } from '../../model/conferencia-anulacao';
import { AlertService } from '../../providers/alert-service';
import { ConferenciaVeiculoMotivos } from '../../model/conferencia-veiculo-motivos';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-nova-conferencia-justificativa',
  templateUrl: 'nova-conferencia-justificativa.html',
})
export class NovaConferenciaJustificativaPage {
  configuracao: ConferenciaConfiguracao;
  ativarBotaoAnular: boolean = true;
  ativarBotaoIcluir: boolean = true;
  ativarBotaoComoNaoConferido: boolean = true;
  somenteConferidos: boolean;
  callback: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertService: AlertService,
    public conferenciaDataService: ConferenciaDataService,
    public ado: ConferenciaConfiguracaoADO,
    public authService: AuthService,
    public navParams: NavParams
  ) {
    this.configuracao = navParams.data.configuracao;
    this.somenteConferidos = navParams.data.somenteConferidos;
    this.callback = navParams.data.callback;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaJustificativaPage');
    this.ativarBotaoAnular = this.somenteConferidos;
    this.ativarBotaoIcluir = !this.somenteConferidos;
    this.ativarBotaoComoNaoConferido = !this.somenteConferidos;
  }

  incluir() {
    let profileModal = this.modalCtrl.create(
      ModalJustificativaIncluirConferenciaPage,
      { turnos: this.configuracao.turnos }
    );
    profileModal.onDidDismiss((data) => {
      console.log('onDidDismiss', data);
      if (data.motivo) {
        this.conferirChassis(
          ConferenciaVeiculoMotivos.ItemJustificadoComoConferido,
          data.motivo,
          data.turno,
          data.data + 'T' + data.hora + ':00.000'
        );
      }
    });
    profileModal.present();
  }

  confirmarComoNaoConferido() {
    let profileModal = this.modalCtrl.create(
      ModalJustificativaNaoConferidoPage,
      {}
    );
    profileModal.onDidDismiss((data) => {
      console.log('onDidDismiss', data);
      if (data.motivo) {
        this.conferirChassis(
          ConferenciaVeiculoMotivos.ItemJustificadoComoNaoConferido,
          data.motivo,
          null,
          null
        );
      }
    });
    profileModal.present();
  }

  anular() {
    let profileModal = this.modalCtrl.create(
      ModalJustificativaItemAnuladoPage,
      {}
    );
    profileModal.onDidDismiss((data) => {
      console.log('onDidDismiss', data);
      if (data.motivo) {
        this.anularChassis(data.motivo);
      }
    });
    profileModal.present();
  }

  private conferirChassis(
    motivoId: ConferenciaVeiculoMotivos,
    motivo?: string,
    turno?,
    now?
  ) {
    if (!now) {
      let date = new Date();
      now =
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        'T' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) +
        '.000';
    }

    this.carregarVeiculos().subscribe((veiculos) => {
      let arrayOfSyncs = veiculos.map((veiculo) =>
        Object.assign(new Conferencia(), {
          chassi: veiculo.chassi,
          conferenciaConfiguracaoID: this.configuracao.id,
          dataHoraConferencia: now,
          sincronizar: false,
          turnoID: turno ? turno.id : null,
          conferenciaVeiculoMotivoID: motivoId,
          motivo: motivo,
        })
      );

      this.authService.showLoadingWhite();
      this.conferenciaDataService
        .conferirChassisEmLote(arrayOfSyncs, this.configuracao.id)
        .pipe(finalize(() => {}))
        .subscribe(
          async (res) => {
            if (res.sucesso) {
              for (let i = 0; i < arrayOfSyncs.length; i++) {
                await this.ado.saveConferencia(arrayOfSyncs[i]);
              }
              this.authService.hideLoadingWhite();
              this.showSucessAlert('Justificativa Efetuada!');
              if (this.callback != null) {
                this.callback(true);
              }
              this.navCtrl.pop();
            } else {
              this.authService.hideLoadingWhite();
              this.showErrorAlert('Erro ao realizar a operação!');
            }
          },
          (err) => {
            this.authService.hideLoadingWhite();
            this.showErrorAlert('Erro ao realizar a operação!');
            console.error(err);
          }
        );

      // veiculos.forEach((veiculo) => {
      //   let conferencia: Conferencia = Object.assign(new Conferencia(), {
      //     chassi: veiculo.chassi,
      //     conferenciaConfiguracaoID: this.configuracao.id,
      //     dataHoraConferencia: now,
      //     sincronizar: false,
      //     turnoID: turno ? turno.id : null,
      //     conferenciaVeiculoMotivoID: motivoId,
      //     motivo: motivo,
      //   });

      //   arrayOfSyncs.push(
      //     this.conferenciaDataService
      //       .conferirChassi({
      //         chassi: conferencia.chassi,
      //         turnoId: conferencia.turnoID,
      //         nomeUsuario: conferencia.nomeUsuario,
      //         conferenciaConfiguracaoID: conferencia.conferenciaConfiguracaoID,
      //         dataHoraConferencia: conferencia.dataHoraConferencia,
      //         conferenciaVeiculoMotivoID:
      //           conferencia.conferenciaVeiculoMotivoID,
      //         motivo: conferencia.motivo,
      //       })
      //       .pipe(
      //         switchMap((res: any) => {
      //           if (res.sucesso) {
      //             return this.ado.saveConferencia(conferencia);
      //           }
      //           return of({});
      //         })
      //       )
      //   );
      // });

      // this.authService.showLoadingWhite();
      // concat(...arrayOfSyncs)
      //   .toArray()
      //   .pipe(
      //     finalize(() => {
      //       this.authService.hideLoadingWhite();
      //     })
      //   )
      //   .subscribe(
      //     (res) => {
      //       this.showSucessAlert('Justificativa Efetuada!');
      //       if (this.callback != null) {
      //         this.callback(true);
      //       }
      //       this.navCtrl.pop();
      //     },
      //     (error) => {
      //       this.showErrorAlert(error);
      //       console.error(error);
      //     }
      //   );
    });
  }

  private anularChassis(motivo: string) {
    this.carregarVeiculos().subscribe((veiculos) => {
      let arrayOfSyncs = veiculos.map((veiculo) =>
        Object.assign(new ConferenciaAnulacao(), {
          chassi: veiculo.chassi,
          conferenciaConfiguracaoID: this.configuracao.id,
          motivo: motivo,
        })
      );

      this.authService.showLoadingWhite();
      this.conferenciaDataService
        .anularConferenciaEmLote(arrayOfSyncs, this.configuracao.id)
        .subscribe(
          async (res) => {
            if (res.sucesso) {
              for (let i = 0; i < arrayOfSyncs.length; i++) {
                await this.ado.anularConferencia(arrayOfSyncs[i]);
              }
              this.authService.hideLoadingWhite();
              this.showSucessAlert('CONFERÊNCIA ANULADA!');
              if (this.callback != null) {
                this.callback(true);
              }
              this.navCtrl.pop();
            } else {
              this.authService.hideLoadingWhite();
              this.showErrorAlert('Erro ao realizar a operação!');
            }
          },
          (err) => {
            this.authService.hideLoadingWhite();
            this.showErrorAlert('Erro ao realizar a operação!');
            console.error(err);
          }
        );
    });

    // let arrayOfSyncs = [];

    // this.carregarVeiculos().subscribe((veiculos) => {
    //   let arrayOfSyncs = [];

    //   veiculos.forEach((veiculo) => {
    //     let conferenciaAnulacao: ConferenciaAnulacao = Object.assign(
    //       new ConferenciaAnulacao(),
    //       {
    //         chassi: veiculo.chassi,
    //         conferenciaConfiguracaoID: this.configuracao.id,
    //         motivo: motivo,
    //       }
    //     );

    //     arrayOfSyncs.push(
    //       this.conferenciaDataService
    //         .anularConferencia(conferenciaAnulacao)
    //         .pipe(
    //           switchMap((res: any) => {
    //             if (res.sucesso) {
    //               return this.ado.anularConferencia(conferenciaAnulacao);
    //             }
    //             return of({});
    //           })
    //         )
    //     );
    //   });

    //   this.authService.showLoadingWhite();
    //   concat(...arrayOfSyncs)
    //     .toArray()
    //     .pipe(
    //       finalize(() => {
    //         this.authService.hideLoadingWhite();
    //       })
    //     )
    //     .subscribe(
    //       (res) => {
    //         this.showSucessAlert('CONFERENCIA ANULADA!');
    //         if (this.callback != null) {
    //           this.callback(true);
    //         }
    //         this.navCtrl.pop();
    //       },
    //       (error) => {
    //         this.showErrorAlert(error);
    //         console.error(error);
    //       }
    //     );
    // });
  }

  showErrorAlert(message: string) {
    this.alertService.showError(message, null, () => {
      this.navCtrl.pop();
    });
  }

  showInfoAlert(message: string) {
    this.alertService.showInfo(message);
  }

  showSucessAlert(message: string) {
    this.alertService.showInfo(message);
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

  carregarVeiculos(): Observable<Veiculo[]> {
    return this.ado.loadVeiculos(
      this.configuracao.id,
      null,
      null,
      this.somenteConferidos,
      true
    );
  }
}
