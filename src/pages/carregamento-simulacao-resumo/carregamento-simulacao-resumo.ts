import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import * as $ from "jquery";

@Component({
  selector: "page-carregamento-simulacao-resumo",
  templateUrl: "carregamento-simulacao-resumo.html"
})
export class CarregamentoSimulacaoResumoPage {
  formData = {
    chassi: "",
    tipo: "",
    local: ""
  };
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = "Resumo";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CarregamentoSimulacaoResumoPage");
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };
}
