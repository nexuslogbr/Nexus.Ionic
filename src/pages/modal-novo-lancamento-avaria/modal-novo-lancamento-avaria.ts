import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QualidadeMenuPage } from '../qualidade-menu/qualidade-menu';

@Component({
  selector: 'page-modal-novo-lancamento-avaria',
  templateUrl: 'modal-novo-lancamento-avaria.html',
})
export class ModalNovoLancamentoAvariaPage {

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  data = {
    name: 'Hingo',
    cargo: 'Front',
    continue: true
  };

  constructor(
    private modal: ModalController,
    private navParam: NavParams,
    private view: ViewController,
    public navCtrl: NavController,
    public authService: AuthService
  ) {
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
  }
  ionViewDidLoad() { }

  closeModal() {
    this.navCtrl.push(QualidadeMenuPage);
    this.data.continue = false;
    this.view.dismiss(this.data);
  }

  openPage() {
    this.data.continue = true;
    this.view.dismiss(this.data);
  }
}
