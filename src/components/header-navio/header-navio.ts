import { Component, Input } from '@angular/core';


@Component({
  selector: 'header-navio',
  templateUrl: 'header-navio.html'
})
export class HeaderNavioComponent {

  @Input('navio') navio: any;

  constructor() {
 
  }

}
