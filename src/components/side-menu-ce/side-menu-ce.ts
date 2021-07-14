import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
// import {
//   NativePageTransitions,
//   NativeTransitionOptions
// } from '@ionic-native/native-page-transitions';
import { MenuCePage } from '../../pages/menu-ce/menu-ce';
import { LoginPage } from '../../pages/login/login';
import { SobreCePage } from '../../pages/sobre-ce/sobre-ce';

@Component({
  selector: 'side-menu-ce',
  templateUrl: 'side-menu-ce.html'
})
export class SideMenuCeComponent {
  data: any;
  usuario: string = '';
  email: string = '';

  constructor(
    //private nativePageTransitions: NativePageTransitions,
    public navCtrl: NavController,
    public authService: AuthService,
    public viewCtrl: ViewController
  ) {
    this.getData();
    console.log('SideMenuCeComponent');
  }
  getData() {
    setTimeout(() => {
      this.usuario = this.authService.getUserData().nome;
      this.email = this.authService.getUserData().email;
    }, 1000);
  }

  navigateToHomePage() {
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };

    // this.nativePageTransitions.slide(options);
    this.navCtrl.setRoot(MenuCePage);
  }

  Logout() {
    this.authService.removeSession().then(res => {
      // let options: NativeTransitionOptions = {
      //   direction: 'up',
      //   duration: 500,
      //   slowdownfactor: 3,
      //   slidePixels: 20,
      //   iosdelay: 100,
      //   androiddelay: 150,
      //   fixedPixelsTop: 0,
      //   fixedPixelsBottom: 60
      // };
      // this.nativePageTransitions.slide(options);
      this.navCtrl.push(LoginPage);
    });
  }
  about() {
    // let options: NativeTransitionOptions = {
    //   direction: 'up',
    //   duration: 500,
    //   slowdownfactor: 3,
    //   slidePixels: 20,
    //   iosdelay: 100,
    //   androiddelay: 150,
    //   fixedPixelsTop: 0,
    //   fixedPixelsBottom: 60
    // };

    // this.nativePageTransitions.slide(options);
    // this.navCtrl.push(SobreCePage);
  }
}
