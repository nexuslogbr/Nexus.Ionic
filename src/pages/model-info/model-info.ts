import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-model-info',
  templateUrl: 'model-info.html',
})
export class ModelInfoPage implements OnInit {
  
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
    console.log('ionViewDidLoad ModelInfoPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
