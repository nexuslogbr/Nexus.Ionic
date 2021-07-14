import { Component } from '@angular/core';

/**
 * Generated class for the ModalVolumeExportacaoComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'modal-volume-exportacao',
  templateUrl: 'modal-volume-exportacao.html'
})
export class ModalVolumeExportacaoComponent {

  text: string;

  constructor() {
    console.log('Hello ModalVolumeExportacaoComponent Component');
    this.text = 'Hello World';
  }

}
