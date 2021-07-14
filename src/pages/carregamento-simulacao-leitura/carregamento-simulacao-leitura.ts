import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import * as $ from "jquery";
import { CarregamentoSimulacaoResumoPage } from "../carregamento-simulacao-resumo/carregamento-simulacao-resumo";
@Component({
  selector: "page-carregamento-simulacao-leitura",
  templateUrl: "carregamento-simulacao-leitura.html"
})
export class CarregamentoSimulacaoLeituraPage {
  formData = {
    chassi: "",
    tipo: "",
    local: ""
  };
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = "Retorno de Leitura";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CarregamentoSimulacaoLeituraPage");
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  continuar() {
    this.navCtrl.push(CarregamentoSimulacaoResumoPage);
  }
}

