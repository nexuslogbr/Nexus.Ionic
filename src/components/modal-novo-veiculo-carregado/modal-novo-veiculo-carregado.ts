import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'modal-novo-veiculo-carregado',
  templateUrl: 'modal-novo-veiculo-carregado.html'
})
export class ModalNovoVeiculoCarregadoComponent {

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

  constructor(private navParam: NavParams, public authService: AuthService, private view: ViewController, public navCtrl: NavController) {
    console.log('ModalNovoVeiculoCarregadoComponent');
    this.title = 'Novo Veículo';
  }
  ionViewDidEnter() {

  }
  ionViewWillLoad(){
    const data = this.navParam.get('data');
    this.dados = data;
    console.log(this.dados);

    if(!this.isObjectEmpty(this.dados)){

      this.Data.nota = this.dados['notaFiscal'];
      this.Data.chassi = this.dados['chassi'];
      this.Data.modelo = this.dados['modelo'];
      this.Data.posicao = this.dados['posicaoAtual'];
      // this.ConsultarVeiculo();
    }

  }

  // ConsultarVeiculo(){
  //   setTimeout(() =>
  //   {
  //   this.parametros = this.authService.getNovoVeiculo();
  //   this.formData.chassi = this.parametros.chassi;
  //   this.formData.modelo = this.parametros.modelo;
  //   this.formData.posicao = this.parametros.posicaoAtual;

  //   }, 500);
  // }
  ConfirmarVeiculo(){
    this.view.dismiss(this.Data);
  }
  closeModal() {
    const data = {};
    this.view.dismiss(data);
    // var veiculoConfirmar = this.authService.getNovoVeiculo();
    // if(this.formData['chassi'] == veiculoConfirmar['chassi']){
    //   console.log('iguais');

    //   this.authService.removeVeiculo(veiculoConfirmar['chassi']);
    //   console.log(this.authService.getNovoVeiculo());
    // }else{
    //   console.log('diferentes');
    //   console.log(this.formData);
    // }
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
