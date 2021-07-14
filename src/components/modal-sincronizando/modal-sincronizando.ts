import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-sincronizando',
  templateUrl: 'modal-sincronizando.html'
})
export class ModalSincronizandoComponent {

  constructor(public authService: AuthService) {
  }

  ionViewDidEnter() {
  }

}
