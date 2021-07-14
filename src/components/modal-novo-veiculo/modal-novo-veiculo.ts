import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-novo-veiculo',
  templateUrl: 'modal-novo-veiculo.html'
})
export class ModalNovoVeiculoComponent {

  title: string;
  parametros: any;
  Data = {
    'bolsaoAtual': '',
    'chassi':"",
    'id': 0,
    'layoutAtual' : '',
    'localAtual' : '',
    'modelo' : "",
    'nota' : "",
    'posicao': "",
    'status' : ""
  };
  veiculos: any[] = new Array();
  dados: any;
  clienteExterno: boolean;

  constructor(private navParam: NavParams, public authService: AuthService, private view: ViewController, public navCtrl: NavController) {
    this.clienteExterno = this.authService.getUserData().clienteExterno;
    this.title = 'Novo Veículo';
  }
  ionViewDidEnter() {

  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.dados = data;

    if(!this.isObjectEmpty(this.dados)){

      this.Data.nota = this.dados['notaFiscal'];
      this.Data.chassi = this.dados['chassi'];
      this.Data.modelo = this.dados['modelo'];
      this.Data.posicao = this.dados['posicaoAtual'];

    }

  }

  ConfirmarVeiculo(){
    this.view.dismiss(this.Data);
  }
  closeModal() {
    const data = {};
    this.view.dismiss(data);
  }

  isObjectEmpty(obj) {
    if (obj) {
      for (var prop in obj) {
        return false;
      }
    }
    return true;
  }

}
