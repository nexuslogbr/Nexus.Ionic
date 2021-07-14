import { Component, ViewChild, Renderer, Input  } from '@angular/core';

@Component({
  selector: 'dashboard-accordion',
  templateUrl: 'dashboard-accordion.html'
})
export class DashboardAccordionComponent {

  accordionExpanded = false;
  @ViewChild("cc") cardContent: any;
  @Input('navioNome') navioNome: string;
  down: boolean;

  constructor(public renderer: Renderer) {
    console.log('DashboardAccordionComponent');

  }
  ionViewDidLoad(){
    this.renderer.setElementStyle(this.cardContent.nativeElement, "webkitTransition", "height 500ms")
  }
  toggleContent(event){
    
    if(this.accordionExpanded){
      this.renderer.setElementStyle(this.cardContent.nativeElement, "height", "0");
      this.down = true;
    }else{
      this.renderer.setElementStyle(this.cardContent.nativeElement, "height", "225px");
      this.down = false;
    }    
    
    this.accordionExpanded = !this.accordionExpanded;
    this.down = !this.down;
  }  

}
