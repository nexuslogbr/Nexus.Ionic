import { Component, Input, Renderer, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SuperficieChassiParte } from '../../model/superficieChassiParte';

@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDrawComponent {
  @Input() image = ''
  @Input() superficieChassiParte = new SuperficieChassiParte();

  @ViewChild('myCanvas') canvas: any;
  canvasElement: any;
  lastX: number;
  lastY: number;

  @Input() src;

  currentColour: string = '#1abc9c';
  availableColours: any;

  modeBush = false;
  brushSize: number = 10;

  constructor(public platform: Platform, public renderer: Renderer) {
    this.availableColours = [
      "#FFFFFF",
      "#000000",
      '#3897F0',
      '#70C050',
      '#FDCB5C',
      '#FD8D32',
      '#ED4956',
      '#D10869',
      '#A307BA',
      "#ED0013",
      "#ED858E",
      "#FFD2D3",
      "#FFC382",
      "#D28F46",
      "#996439",
      "#432324",
      "#1C4A29"
    ]
  }

  ngAfterViewInit() {

    this.canvasElement = this.canvas.nativeElement;

    var ctx = this.canvasElement.getContext("2d");
    // ctx.drawImage(this.src,0,0, this.platform.width(), this.platform.height() );

    var self = this;
    var image = new Image();
    image.onload = function () {
      ctx.drawImage(image, 0, 0, self.platform.width(), self.platform.height());
    };
    image.src = this.src;

    this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
    this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');

  }

  initModeBrush() {
    this.modeBush = true
  }

  changeColour(colour) {
    this.currentColour = colour;
  }

  changeSize(size) {
    this.brushSize = size;
  }

  handleStart(ev) {
    this.lastX = ev.touches[0].pageX;
    this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev) {
    let currentX = ev.touches[0].pageX;
    let currentY = ev.touches[0].pageY;

    if (this.modeBush) {
      let ctx = this.canvasElement.getContext('2d');

      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
      ctx.strokeStyle = this.currentColour;
      ctx.lineWidth = this.brushSize;
      ctx.stroke();
    }

    this.lastX = currentX;
    this.lastY = currentY;
  }

  clearCanvas() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  recivedParteChassiInputed(event: SuperficieChassiParte){
    console.log(event);
  }
}
