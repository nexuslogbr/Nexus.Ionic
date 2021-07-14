import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { RomaneioPage } from '../../pages/romaneio/romaneio';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { CarregamentoExportPage } from '../../pages/carregamento-export/carregamento-export';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import * as $ from 'jquery';

@Component({
  selector: 'nav-footer',
  templateUrl: 'nav-footer.html'
})
export class NavFooterComponent {

  text: string;

  constructor(public navCtrl: NavController) {
    console.log('NavFooterComponent');
  }
  toParqueamento(){ 
     this.navCtrl.push(ParqueamentoPage );      
  }
  toMovimentacao(){
    this.navCtrl.push(MovimentacaoPage );       
  }  
  toCarregamento(){
    this.navCtrl.push(CarregamentoPage );    
  }   
  toParqueamentoExport(){    
    this.navCtrl.push(ReceberParquearPage ); 
  }    
  toRomaneio(){

    this.navCtrl.push(RomaneioPage );       
  } 
  toCarregamentoExport(){
    this.navCtrl.push(CarregamentoExportPage ); 
  } 
}
