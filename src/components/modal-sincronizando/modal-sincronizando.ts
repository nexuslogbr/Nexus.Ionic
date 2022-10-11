import { Component, Input } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-sincronizando',
  templateUrl: 'modal-sincronizando.html'
})
export class ModalSincronizandoComponent {

  @Input() progress = 0;
  percent = 0;

  constructor(public authService: AuthService) {
    setInterval(() =>  this.manageProgress(), 300);
  }

  manageProgress() {
    if (this.percent < this.progress) {
      // this.percent += 1;
      this.percent = this.progress;
    }
  }
}
