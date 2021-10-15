import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, ModalController, Modal } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { Select } from 'ionic-angular';

@Component({
  selector: 'modal-device',
  templateUrl: 'modal-device.html'
})
export class ModalDeviceComponent {

  @ViewChild('select1') select1: Select;

  text: string;
  parametros: any = [
    {
      nome : "",
      url : "",
      selected: "false"
    }
  ]
  url: string;
  code: string;
  nome: any;
  uniqueId: string;

  constructor(private modal: ModalController, public storage: Storage, public navParams: NavParams,public authService: AuthService,private view: ViewController) {
    console.log('ModalDeviceComponent');
    this.nome = "";
    // this.code = "";
  }
  ionViewDidEnter(){
    // this.parametros = this.authService.getUrl();
    // var selectText = document.querySelector('.select-text');
    // console.log(this.select1);
    // console.log(selectText);
  }
  // onChassisChange(selectedValue) {
  //   this.url = selectedValue;
  //   this.authService.setNomeUrl(this.select1.text);

  // }
  ConfirmarDispositivo(){
    debugger
    if(this.code){
      // this.authService.setUrl(this.url);
      this.authService.salvarDispositivo(this.code);
      console.log(this.code)
      this.view.dismiss(this.code);
    }else{
      this.openModalErroCode("Preencha todos os campos!");
    }
  }
  openModalErroCode(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{

    })
  }

}
