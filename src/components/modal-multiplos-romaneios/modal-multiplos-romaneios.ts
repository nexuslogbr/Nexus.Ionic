import { Component } from '@angular/core';
import { NavController, NavParams, ViewController  } from 'ionic-angular';
import { NovoRomaneioPage } from '../../pages/novo-romaneio/novo-romaneio';
import { HomePage } from '../../pages/home/home';
import { AuthService } from '../../providers/auth-service/auth-service';
import { MenuCePage } from '../../pages/menu-ce/menu-ce';

@Component({
  selector: 'modal-multiplos-romaneios',
  templateUrl: 'modal-multiplos-romaneios.html'
})
export class ModalMultiplosRomaneiosComponent {

  data: any;
  clienteExterno: boolean;

  constructor(public authService: AuthService, private view: ViewController, public navCtrl: NavController, private navParam: NavParams) {
    console.log('ModalMultiplosRomaneiosComponent');
    this.clienteExterno = this.authService.getUserData().clienteExterno;

  }
  ionViewWillLoad(){

  }
  addRampaFila(){
    this.view.dismiss();
  }
  cancelar(){
    this.view.dismiss();
    if (this.clienteExterno) {
      this.navCtrl.push(MenuCePage);
    } else {
      this.navCtrl.push(HomePage);
    }
  }

}
