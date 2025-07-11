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

  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;

  constructor(private modal: ModalController, public storage: Storage, public navParams: NavParams,public authService: AuthService,private view: ViewController) {
    console.log('ModalDeviceComponent');
    this.nome = "";
    // this.code = "";

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
