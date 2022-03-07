import { Component } from '@angular/core';

/**
 * Generated class for the ModalVistoriaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-vistoria',
  templateUrl: 'modal-vistoria.html'
})
export class ModalVistoriaComponent {

  text: string;

  constructor() {
    console.log('Hello ModalVistoriaComponent Component');
    this.text = 'Hello World';
  }

}
