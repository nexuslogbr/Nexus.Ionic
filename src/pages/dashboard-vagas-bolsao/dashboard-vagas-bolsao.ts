import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { DataService } from "../../providers/data-service";
import { AuthService } from "../../providers/auth-service/auth-service";
import * as $ from "jquery";

@Component({
  selector: "page-dashboard-vagas-bolsao",
  templateUrl: "dashboard-vagas-bolsao.html"
})
export class DashboardVagasBolsaoPage {
  title: string;
  vagas: any;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    private authService: AuthService
  ) {
    if (localStorage.getItem('tema') == "Cinza" || !localStorage.getItem('tema')) {
      this.primaryColor = '#595959';
      this.secondaryColor = '#484848';
      this.inputColor = '#595959';
      this.buttonColor = "#595959";
    } else {
      this.primaryColor = '#06273f';
      this.secondaryColor = '#00141b';
      this.inputColor = '#06273f';
      this.buttonColor = "#1c6381";
    }
  }

  ionViewDidLoad() {
    this.title = "Rio Grande - Layout X";
    let layoutId = this.navParams.data.layoutId;
    this.title = this.navParams.data.layoutNome;
    console.log("layoutId", layoutId);
    console.log("ionViewDidLoad DashboardVagasBolsaoPage");
    this.authService.showLoading();
    this.dataService.listarBolsoesVagos(layoutId, true).subscribe(
      res => {
        console.log("res", res);
        this.vagas = res.retorno;
        this.authService.hideLoading();
      },
      error => {
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  voltar() {
    this.navCtrl.pop();
  }

  toggleMenu = function(this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };
}
