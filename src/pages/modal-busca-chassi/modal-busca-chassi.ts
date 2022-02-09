import { Component } from '@angular/core';

/**
 * Generated class for the ModalBuscaChassiComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-busca-chassi',
  templateUrl: 'modal-busca-chassi.html'
})
export class ModalBuscaChassiComponent {

  text: string;

  constructor() {
    console.log('Hello ModalBuscaChassiComponent Component');
    this.text = 'Hello World';
  }

}
