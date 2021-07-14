import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-loading',
  templateUrl: 'modal-loading.html'
})
export class ModalLoadingComponent {

  text: string;

  constructor(public authService: AuthService,) {
  }
  ionViewDidEnter() {

  }

}
