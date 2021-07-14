import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CarregamentoResumoComponent  } from '../../components/carregamento-resumo/carregamento-resumo';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { SubstituirChassiComponent } from '../../components/substituir-chassi/substituir-chassi';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'input-chassi',
  templateUrl: 'input-chassi.html'
})
export class InputChassiComponent {

  trocarChassi: {};
  resultado: any;
  chassiNovo: string;
  responseData : any;
  romaneioData: any;
  options : BarcodeScannerOptions;
  qrCodeText: string;
  url: string;
  ligado: boolean;

  constructor(public http: HttpClient, private modal: ModalController, private barcodeScanner: BarcodeScanner, public navCtrl: NavController, private view: ViewController, private navParam: NavParams, public authService: AuthService) {
    console.log('InputChassiComponent');
  }

  ionViewDidEnter(){
    const dados = this.navParam.get('data');
    this.resultado = dados;
    console.log(this.resultado);

    this.url = this.authService.getUrl();

  }

  // onKey(event: any, chassi) {
  //   this.chassiNovo = event.target.value;

  //   if(this.chassiNovo.length >= 6){
  //     this.buscaChassi(this.chassiNovo);
  //   }

  // }

  // buscaChassi(chassi){

  //   console.log(chassi);

  //   this.authService.showLoading();

  //   let consultarRomaneio = this.url+"/Carregar/BuscarChassi?token="+ this.authService.getToken()+"&romaneioID="+this.resultado.romaneioID+"&romaneioDetalheID="+this.resultado.romaneioDetalheID+"&partChassi="+chassi;

  //   this.http.get<dataRetorno>(consultarRomaneio)
  //   .subscribe(res => {
  //     let data = res;

  //     if(data.sucesso){

  //       console.log(data);
  //       // this.resultado.chassiNovo =
  //       // this.PreCarregar(data.retorno);
  //       this.authService.hideLoading();

  //     }else{

  //       this.authService.hideLoading();
  //       this.openModalErro(data.mensagem);

  //     }
  //   }, (error) => {

  //     this.openModalErro(error.status+' - '+error.statusText);
  //     this.authService.hideLoading();
  //     console.log(error);
  //   });

  // }
  scan(){

    this.options = {
      showTorchButton : true,
      prompt : "",
      resultDisplayDuration: 0
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then((barcodeData) => {
      this.qrCodeText = barcodeData.text;

      this.TrocarChassiQrCode(this.qrCodeText);

    }, (err) => {
      this.authService.hideLoading();
      var data = "Erro de qr code!";
      this.authService.hideLoading();
      this.openModalErro(data);
    });
  }
  TrocarChassiQrCode(text){

    this.authService.showLoading();

    let trocarChassi = this.url+"/Carregar/TrocarChassi?token="+this.authService.getToken()+"&romaneioID="+this.resultado.romaneioID+"&romaneioDetalheID="+this.resultado.romaneioDetalheID +"&chassi="+this.resultado.chassi+"&chassiNovo="+text;

    this.http.put<dataRetorno>(trocarChassi, {}, httpOptions)
    .subscribe(res => {
      let data = res;

      if(data.sucesso){

        let trocarChassi = this.url+"/Carregar/TrocarChassi?token="+this.authService.getToken()+"&romaneioID="+this.resultado.romaneioID+"&romaneioDetalheID="+this.resultado.romaneioDetalheID +"&chassi="+this.resultado.chassi+"&chassiNovo="+text;

        this.http.put<dataRetorno>(trocarChassi, {}, httpOptions)
        .subscribe(res => {
          let data = res;

          if(data.sucesso){



          }else{

            this.authService.hideLoading();
            this.openModalErro(data.mensagem);

          }
        }, (error) => {

          this.openModalErro(error.status+' - '+error.statusText);
          this.authService.hideLoading();
          console.log(error);
        });

      }else{

        this.authService.hideLoading();
        this.openModalErro(data.mensagem);

      }
    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }
  TrocarChassi(){

    this.authService.showLoading();

    let trocarChassi = this.url+"/Carregar/TrocarChassi?token="+this.authService.getToken()+"&romaneioID="+this.resultado.romaneioID+"&romaneioDetalheID="+this.resultado.romaneioDetalheID +"&chassi="+this.resultado.chassi+"&chassiNovo="+this.chassiNovo;

    this.http.put<dataRetorno>(trocarChassi, {}, httpOptions)
    .subscribe(res => {
      let data = res;
      console.log(data);
      if(data.sucesso){

        let consultarRomaneio = this.url+"/Carregar/ConsultarRomaneio?token="+this.authService.getToken()+"&romaneioID="+this.resultado.romaneioID+"&romaneioDetalheID="+this.resultado.romaneioDetalheID;

        this.http.get<dataRetorno>(consultarRomaneio)
        .subscribe(res => {
          let dados = res;


          if(dados.sucesso){
            this.romaneioData = dados.retorno;

            console.log(this.romaneioData);
            this.view.dismiss();
            this.authService.hideLoading();
            let tempData ={
              message : "Chassi substituído com",
              iconClass : 'icon-chassi-substituir'
            }
            this.openModalSucesso(tempData);

          }else{

            this.authService.hideLoading();
            this.openModalErro(dados.mensagem);

          }
        }, (error) => {

          this.openModalErro(error.status+' - '+error.statusText);
          this.authService.hideLoading();
          console.log(error);
        });

      }else{

        this.authService.hideLoading();
        this.openModalErro(data.mensagem);

      }
    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }
  openSubstituirChassi(data){

    const chassiModal: Modal = this.modal.create(SubstituirChassiComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {

    })
    chassiModal.onWillDismiss((data) =>{
      console.log(data);
    })

  }
  openModalErro(data){
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
     ;
    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
  openModalSucesso(data){
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss(() => {

      this.openCarregamentoResumo(this.romaneioData );
      console.log(this.romaneioData);
    })
    chassiModal.onWillDismiss((data) =>{

    })
  }
  closeModal(){
    this.view.dismiss();

  }
  voltar(){
    this.ConsultarRomaneio();
  }
  openCarregamentoResumo(data){

    const chassiModal: Modal = this.modal.create(CarregamentoResumoComponent, {data: data });
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      this.view.dismiss();
    })
    chassiModal.onWillDismiss((data) =>{
      // console.log('data');
      // console.log(data);

    })

  }

  ConsultarRomaneio(){

    this.authService.showLoading();

    let consultarRomaneio = this.url+"/Carregar/ConsultarRomaneio?token="+this.authService.getToken()+"&romaneioID="+this.resultado.romaneioID+"&romaneioDetalheID="+this.resultado.romaneioDetalheID;

    this.http.get<dataRetorno>(consultarRomaneio)
    .subscribe(res => {
      let dados = res;

      if(dados.sucesso){
        this.romaneioData = dados.retorno;

        this.view.dismiss();
        this.authService.hideLoading();

        this.openCarregamentoResumo(this.romaneioData );

      }else{

        this.authService.hideLoading();
        this.openModalErro(dados.mensagem);

      }
    }, (error) => {

      this.openModalErro(error.status+' - '+error.statusText);
      this.authService.hideLoading();
      console.log(error);
    });
  }


}
interface dataRetorno{
  dataErro: string;
  mensagem: string;
  retorno: any;
  sucesso: boolean;
  tipo: number;
  urlRedirect: string
}
