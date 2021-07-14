import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import * as $ from "jquery";
import { CarregamentoSimulacaoChassiPage } from "../carregamento-simulacao-chassi/carregamento-simulacao-chassi";

@Component({
  selector: "page-carregamento-simulacao",
  templateUrl: "carregamento-simulacao.html"
})
export class CarregamentoSimulacaoPage {
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = "SIMULAÇÃO DE CARREGAMENTO";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CarregamentoSimulacaoPage");
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  simularCarregamento() {
    this.navCtrl.push(CarregamentoSimulacaoChassiPage)
  }
}
