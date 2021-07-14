import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  Modal,
  ModalController
} from 'ionic-angular';
import { Navio } from '../../model/navio';
import { NavioDataService } from '../../providers/navio-data-service';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ConferenciaNavioLote } from '../../model/conferencia-navio-lote';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as $ from 'jquery';
import { finalize } from 'rxjs/operators/finalize';
import { ConferenciaNavioLoteDataService } from '../../providers/conferencia-navio-lote-data-service';

@Component({
  selector: 'page-conferencia-lote-resumo',
  templateUrl: 'conferencia-lote-resumo.html'
})
export class ConferenciaLoteResumoPage {
  navio: Navio;
  conferenciaNavioLote: ConferenciaNavioLote;

  constructor(
    public navCtrl: NavController,
    public navioDataService: NavioDataService,
    public conferenciaNavioLoteDataService: ConferenciaNavioLoteDataService,
    public authService: AuthService,
    public modal: ModalController,
    public navParams: NavParams
  ) {
    this.navio = this.navParams.data.navio;
    this.conferenciaNavioLote = this.navParams.data.conferenciaNavioLote;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferenciaLoteResumoPage');
    this.carregarOperacoesCrossConferenciaLote(this.navio);
  }

  carregarOperacoesCrossConferenciaLote(navio) {
    this.authService.showLoading();
    this.navioDataService
      .carregarNavioOperacoesCrossConferenciaLote(
        navio.id,
        this.conferenciaNavioLote.conferenciaLoteGUI
      )
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        res => {
          if (res.sucesso) {
            navio.operacoes = res.retorno;
            this.navio = { ...navio };
          } else {
            this.openModalErro(res.mensagem);
          }
        },
        error => {
          this.openModalErro(error);
        }
      );
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      console.log('data');
      //this.formData.chassi = '';
    });
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

  reabrir() {
    this.authService.showLoading();
    this.conferenciaNavioLoteDataService
      .reabrirLote(this.conferenciaNavioLote.id)
      .pipe(
        finalize(() => {
          this.authService.hideLoading();
        })
      )
      .subscribe(
        res => {
          if (res.sucesso) {
            this.navCtrl.pop();
          } else {
            this.openModalErro(res.mensagem);
          }
        },
        error => {
          this.openModalErro(error);
        }
      );
  }
}
