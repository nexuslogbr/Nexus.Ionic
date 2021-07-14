import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-loading-white',
  templateUrl: 'modal-loading-white.html'
})
export class ModalLoadingWhiteComponent {

  constructor(public authService: AuthService) {
  }

  ionViewDidEnter() {
  }

}
