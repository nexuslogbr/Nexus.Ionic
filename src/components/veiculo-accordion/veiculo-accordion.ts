import { Component, ViewChild, Renderer, Input } from '@angular/core';

@Component({
  selector: 'veiculo-accordion',
  templateUrl: 'veiculo-accordion.html'
})
export class VeiculoAccordionComponent {

  accordionExpanded = false;
  @ViewChild("cc") cardContent: any;
  @Input('arrayVeiculos') arrayVeiculos: string;
  down: boolean;
  open: boolean;
  constructor(public renderer: Renderer) {
    console.log('VeiculoAccordionComponent');
  }

  ionViewDidLoad(){

    this.renderer.setElementStyle(this.cardContent.nativeElement, "webkitTransition", "height 1000ms")
    this.down = true;
    this.open = false;
  }
  toggleContent(event){
    
    if(this.accordionExpanded){
      // this.renderer.setElementStyle(this.cardContent.nativeElement, "height", "0");
      this.down = true;
      this.open = false;
    }else{
      // this.renderer.setElementStyle(this.cardContent.nativeElement, "height", "auto");
      this.down = false;
      this.open = true;
    }    
    
    this.accordionExpanded = !this.accordionExpanded;
    this.down = !this.down;
  } 

}
