import { Component, Input } from "@angular/core";
import { NavController } from "ionic-angular";
import { ParqueamentoPage } from "../../pages/parqueamento/parqueamento";
import { RecebimentoPage } from "../../pages/recebimento/recebimento";
import { MovimentacaoPage } from "../../pages/movimentacao/movimentacao";
import { CarregamentoPage } from "../../pages/carregamento/carregamento";
import { ReceberParquearPage } from "../../pages/receber-parquear/receber-parquear";
import { RomaneioPage } from "../../pages/romaneio/romaneio";
import { CarregamentoExportPage } from "../../pages/carregamento-export/carregamento-export";

@Component({
  selector: "carregamento-tab",
  templateUrl: "carregamento-tab.html"
})
export class CarregamentoTabComponent {
  @Input() exibirCarregamento: boolean = true;
  @Input() exibirRecebimento: boolean = true;
  @Input() exibirParqueamento: boolean = true;
  @Input() exibirMovimentacao: boolean = true;
  @Input() exibirParqueamentoExport: boolean = true;
  @Input() exibirCarregamentoExport: boolean = true;

  constructor(private navCtrl: NavController) {}

  toParqueamento() {
    //this.navCtrl.push(ParqueamentoPage);
    this.navCtrl.setRoot(ParqueamentoPage);
  }

  toRecebimento() {
    this.navCtrl.setRoot(RecebimentoPage);
    //this.navCtrl.push(RecebimentoPage);
  }

  toMovimentacao() {
    this.navCtrl.setRoot(MovimentacaoPage);
    //this.navCtrl.push(MovimentacaoPage);
  }

  toCarregamento() {
    this.navCtrl.setRoot(CarregamentoPage);
    //this.navCtrl.push(CarregamentoPage);
  }

  toParqueamentoExport() {
    this.navCtrl.setRoot(ReceberParquearPage);
    //this.navCtrl.push(ReceberParquearPage);
  }

  toRomaneio() {
    this.navCtrl.setRoot(RomaneioPage);
    //this.navCtrl.push(RomaneioPage);
  }

  toCarregamentoExport() {
    this.navCtrl.setRoot(CarregamentoExportPage);
    //this.navCtrl.push(CarregamentoExportPage);
  }
}
