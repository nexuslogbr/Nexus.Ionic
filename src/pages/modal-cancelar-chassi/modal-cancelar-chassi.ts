import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-modal-cancelar-chassi",
  templateUrl: "modal-cancelar-chassi.html"
})
export class ModalCancelarChassiPage {
  //private romaneio: Romaneio;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController
  ) {}

  ionViewDidLoad() {
    //console.log("ionViewDidLoad ModalCancelarChassiPage");
  }

  ionViewWillLoad() {
    //this.romaneio = this.navParams.get('data');
    //console.log(this.romaneio);
  }

  public fecharModal() {
    this.view.dismiss({ cancelar: false });
  }

  public cancelarChassi() {
    this.view.dismiss({ cancelar: true });
  }
}
