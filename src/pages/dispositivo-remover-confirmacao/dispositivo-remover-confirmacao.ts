import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
// import {
//   NativePageTransitions,
//   NativeTransitionOptions
// } from "@ionic-native/native-page-transitions";
import { HomePage } from "../home/home";
import { AuthService } from "../../providers/auth-service/auth-service";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-dispositivo-remover-confirmacao",
  templateUrl: "dispositivo-remover-confirmacao.html"
})
export class DispositivoRemoverConfirmacaoPage {


  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    //private nativePageTransitions: NativePageTransitions,
    public authService: AuthService,
    private view: ViewController
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

  // nativeTransitionOptions: NativeTransitionOptions = {
  //   direction: "up",
  //   duration: 500,
  //   slowdownfactor: 3,
  //   slidePixels: 20,
  //   iosdelay: 100,
  //   androiddelay: 150,
  //   fixedPixelsTop: 0,
  //   fixedPixelsBottom: 60
  // };

  ionViewDidLoad() {
    console.log("ionViewDidLoad DispositivoRemoverConfirmacaoPage");
  }

  public removeDevice() {
    this.authService.removeDevice();
    //this.nativePageTransitions.slide(this.nativeTransitionOptions);
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(LoginPage);
  }

  public fecharModal() {
    this.view.dismiss({ cancelar: false });
  }

}
