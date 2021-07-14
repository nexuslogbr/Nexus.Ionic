import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-downloading',
  templateUrl: 'modal-downloading.html'
})
export class ModalDownloadingComponent {

  constructor(public authService: AuthService) {
  }

  ionViewDidEnter() {
  }

}
