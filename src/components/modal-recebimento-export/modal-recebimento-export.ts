import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-recebimento-export',
  templateUrl: 'modal-recebimento-export.html'
})
export class ModalRecebimentoExportComponent {

  text: string;

  constructor(public authService: AuthService) {
    console.log('ModalRecebimentoExportComponent');
  }
  ionViewDidEnter() {

  }
}
