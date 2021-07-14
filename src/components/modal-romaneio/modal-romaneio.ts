import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NovoRomaneioPage } from '../../pages/novo-romaneio/novo-romaneio';
import { HomePage } from '../../pages/home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { MenuCePage } from '../../pages/menu-ce/menu-ce';

@Component({
  selector: 'modal-romaneio',
  templateUrl: 'modal-romaneio.html'
})
export class ModalRomaneioComponent {
  data: any;
  clienteExterno: boolean;

  constructor(
    public authService: AuthService,
    private view: ViewController,
    public navCtrl: NavController,
    private navParam: NavParams
  ) {
    console.log('ModalRomaneioComponent');
    this.clienteExterno = this.authService.getUserData().clienteExterno;
  }

  ionViewWillLoad() {
    this.data = this.navParam.get('data');
    console.log(this.data);
  }

  addRomaneio() {
    this.view.dismiss('addRomaneio');
    this.navCtrl.push(NovoRomaneioPage, this.data);
  }

  cancelar() {
    this.view.dismiss();
    var data = {};
    this.authService.addRomaneio({});

    if (this.clienteExterno) {
      this.navCtrl.push(MenuCePage);
    } else {
      this.navCtrl.push(HomePage);
    }
  }
}
