import { Component } from '@angular/core';

/**
 * Generated class for the VistoriaVeiculosComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'vistoria-veiculos',
  templateUrl: 'vistoria-veiculos.html'
})
export class VistoriaVeiculosComponent {

  text: string;

  constructor() {
    console.log('Hello VistoriaVeiculosComponent Component');
    this.text = 'Hello World';
  }

}
