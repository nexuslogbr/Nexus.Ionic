import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaConfiguracaoADO } from '../../providers/database/conferencia-configuracao-ado';
import { Turno } from '../../model/turno';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import * as $ from 'jquery';
import { NovaConferenciaExecucaoPage } from '../nova-conferencia-execucao/nova-conferencia-execucao';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-nova-conferencia-input',
  templateUrl: 'nova-conferencia-input.html'
})
export class NovaConferenciaInputPage {
  public turnos: Array<Turno>;
  public turno: Turno;
  public configuracao: ConferenciaConfiguracao;
  public usuario: string = '';
  public disableContinuar: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    //public alertCtrl: AlertController,
    public alertService: AlertService,
    public authService: AuthService,
    public conferenciaDataService: ConferenciaDataService,
    public conferenciaConfiguracaoADO: ConferenciaConfiguracaoADO
  ) {
    console.log('NovaConferenciaInputPage->params', navParams.data);
    this.configuracao = navParams.data.configuracao;
    this.turnos = this.configuracao.turnos;

    // this.conferenciaConfiguracaoADO
    //   .loadTurnos(this.configuracao.id)
    //   .subscribe(res => {
    //     if (res.rows) {
    //       debugger;
    //       this.turnos = new Array<Turno>();
    //       for (let i = 0; i < res.rows.length; i++) {
    //         let row = res.rows[i];
    //         let turno: Turno = {
    //           id: row.id,
    //           nome: row.nome,
    //           turnoInicio: new Date(row.turnoInicio),
    //           turnoFim: new Date(row.turnoFim),
    //           turnoInicioString: row.turnoInicioString,
    //           turnoFimString: row.turnoFimString,
    //           turnoHoraFaixa: row.turnoHoraFaixa
    //         };
    //         this.turnos.push(turno);
    //         console.log(this.turnos);
    //       }
    //     }
    //   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaInputPage');
  }

  ionViewWillEnter() {

    if (this.turnos && this.turnos.length) {

      let now = new Date(Date.now());
      console.log('date2', now);

      // Ajusta as datas dos turnos...
      this.turnos.forEach(t => {
        let inicio = new Date(t.turnoInicio);
        let fim = new Date(t.turnoFim);
        inicio.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        fim.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        if (inicio > fim) {
          fim.setDate(fim.getDate() + 1);
        }
        t.turnoInicio = inicio;
        t.turnoFim = fim;
      });

      this.turnos = this.turnos.sort((ta, tb)=> {
        if (ta.turnoInicio < tb.turnoInicio) return -1;
        if (ta.turnoInicio > tb.turnoInicio) return 1;
        return 0;
      })

      this.turnos.forEach(t => {
        t.disponivel = t.turnoFim > now;
      });
    }

  }

  showErrorAlert(message: string) {
    this.alertService.showAlert(message, null, ()=> {
      this.navCtrl.pop();
    });
  }

  onTurnoChange(turnoId: number) {
    this.turno = this.turnos.find(t => t.id == turnoId);
    this.disableContinuar = this.turno == null || this.usuario.length == 0 || !this.usuario.match(/[a-z0-9]+/i) ;
  }

  onUserChange(event) {
    this.disableContinuar = this.turno == null || this.usuario.length == 0 || !this.usuario.match(/[a-z0-9]+/i);
  }

  showSucessAlert(message: string) {
    this.alertService.showInfo(message);

  }

  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  voltar() {
    this.navCtrl.pop();
  }

  continuar() {
    this.navCtrl.push(NovaConferenciaExecucaoPage, {
      configuracao: this.configuracao,
      turno: this.turno,
      usuario: this.usuario
    });
  }
}
