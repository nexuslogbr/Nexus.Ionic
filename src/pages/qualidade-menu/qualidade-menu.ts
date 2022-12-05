import { Component } from '@angular/core';
import { ActionSheetController, Modal, ModalController, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AlertService } from '../../providers/alert-service';
import { QualidadeDashboardBuscaAvariasPage } from '../qualidade-dashboard-busca-avarias/qualidade-dashboard-busca-avarias';
import { BuscarAvariasPage } from '../buscar-avarias/buscar-avarias';
import { LancamentoAvariaPage } from '../lancamento-avaria/lancamento-avaria';
import { LancamentoAvariaVistoriaPage } from '../lancamento-avaria-vistoria/lancamento-avaria-vistoria';
import { VistoriaPage } from '../vistoria/vistoria';
import { VistoriaGeneralMotorsPage } from '../vistoria-general-motors/vistoria-general-motors';
import { StakeholderService } from '../../providers/stakeholder-data-service';
import { StakeHolder } from '../../model/stakeholder';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-qualidade-menu',
  templateUrl: 'qualidade-menu.html',
})
export class QualidadeMenuPage {

  userData: any;

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  stakeholders: StakeHolder[] = [];

  constructor(public navCtrl: NavController,
    public authService: AuthService,
    public alertService: AlertService,
    public navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private modal: ModalController,
    private stakeholderService: StakeholderService
    ) {
    this.userData = this.authService.getUserData();
    if (localStorage.getItem('tema') == "Cinza" || !localStorage.getItem('tema')) {
      this.primaryColor = '#595959';
      this.secondaryColor = '#484848';
      this.inputColor = '#595959';
      this.buttonColor = "#595959";
    } else {
      this.primaryColor = '#06273f';
      this.secondaryColor = '#00141b';
      this.inputColor = '#06273f';
      this.buttonColor = "#1c6381";
    }

    this. loadStakeholders();
  }

  loadStakeholders(){
    this.authService.showLoading();

    forkJoin([
      this.stakeholderService.listar()
    ])
    .pipe(
      finalize(() => {
        this.authService.hideLoading();
      })
    )
    .subscribe(arrayResult => {
      let stakeholders$ = arrayResult[0];

      if (stakeholders$.sucesso) {
        this.stakeholders = stakeholders$.retorno;
        this.stakeholders = this.stakeholders.filter(x => x.stakeholderTipo == 3).map(x => x);
      }
    });
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

  navigateToDashboard() {
    this.navCtrl.push(QualidadeDashboardBuscaAvariasPage);
  }

  navigateToBuscar() {
    this.navCtrl.push(BuscarAvariasPage);
  }

  navigateToVistoriar() {
    this.navCtrl.push(VistoriaPage);
  }

  navigateToVistoriarGM(element: StakeHolder) {

    const modal: Modal = this.modal.create(VistoriaGeneralMotorsPage, {
      data: element,
    });
    modal.present();

    // this.navCtrl.push(VistoriaGeneralMotorsPage);
  }

  navigateToLancar() {
    this.navCtrl.push(LancamentoAvariaPage);
  }

  selectTypeSurvey() {

    let options = []
    this.stakeholders.forEach(element => {
      options.push({
        text: element.nome,
        handler: () => {
          this.navigateToVistoriarGM(element);
        }
      });
    })
    options.push({
      text: 'Cancelar', role: 'cancel'
    });

    const actionSheet = this.actionSheetController.create({
        title: 'Selecionar fabricante',
        buttons: options
    });
    actionSheet.present();
  }
}
