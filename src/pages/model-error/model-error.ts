import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-model-error',
  templateUrl: 'model-error.html',
})
export class ModelErrorPage implements OnInit {

  ngOnInit(): void {
    setTimeout(()=> {
      this.viewCtrl.dismiss();
    }, 1000);
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController) {

    this.primaryMessage = navParams.data.primaryMessage;

    if (navParams.data.secundaryMessage) {
      this.secundaryMessage = navParams.data.secundaryMessage;
    }
  }

  public primaryMessage: string;
  public secundaryMessage: string;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelErrorPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
