import { Component } from '@angular/core';
import {
  NavController,
  Modal,
  ModalController,
  NavParams
} from 'ionic-angular';
import {
  BarcodeScanner,
  BarcodeScannerOptions
} from '@ionic-native/barcode-scanner';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { ModalSucessoComponent } from '../../components/modal-sucesso/modal-sucesso';
import { MovimentacaoPage } from '../../pages/movimentacao/movimentacao';
import { ReceberParquearPage } from '../../pages/receber-parquear/receber-parquear';
import { ParqueamentoPage } from '../../pages/parqueamento/parqueamento';
import { CarregamentoPage } from '../../pages/carregamento/carregamento';
import { RecebimentoPage } from '../../pages/recebimento/recebimento';
import { ModalErrorComponent } from '../../components/modal-error/modal-error';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarregamentoExportacaoDataService } from '../../providers/carregamento-exportacao-data-service';
import { ModalSelecaoChassiPage } from '../modal-selecao-chassi/modal-selecao-chassi';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'page-carregamento-export',
  templateUrl: 'carregamento-export.html'
})
export class CarregamentoExportPage {
  title: string;
  scanData: {};
  data: any;
  carData: any;
  options: BarcodeScannerOptions;
  token: string;
  s;
  chassi: string;
  inputChassi: string = '';
  responseData: any;
  responseCarData: any;
  responseData2: any;
  private url: string;
  qrCodeText: string;
  formData = { chassi: '' };
  formParqueamentoData = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: ''
  };
  recebimentoData = {
    token: '',
    empresaID: '1',
    id: '',
    chassi: '',
    local: '',
    layout: '',
    bolsao: '',
    fila: '',
    posicao: ''
  };
  public totalDeVeiculos: number = 0;
  public totalDeVeiculosCarregados: number = 0;
  public navio: any;
  public tipoOperacao: any;
  public destino: any;

  ligado: boolean;

  constructor(
    public http: HttpClient,
    public modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    public carregamentoExportacaoDataService: CarregamentoExportacaoDataService,
    public authService: AuthService
  ) {
    this.title = 'Carregamento Exportação';
    this.url = this.authService.getUrl();

    this.navio = this.navParams.data.navio;
    this.tipoOperacao = this.navParams.data.tipoOperacao;
    this.destino = this.navParams.data.destino;
    console.log('navParams.data', this.navParams.data);
  }

  ///
  ionViewDidEnter() {
    console.log('ionViewDidEnter CarregamentoExportPage');
    this.atualizarCarregamentoStatus();
  }

  ///
  onKey(event: any) {
    this.inputChassi = event.target.value;

    if (this.inputChassi.length >= 6) {
      this.buscaChassi(this.inputChassi);
    }
  }

  ///
  scan() {
    this.options = {
      showTorchButton: true,
      prompt: '',
      resultDisplayDuration: 0
    };

    this.authService.showLoading();

    this.barcodeScanner.scan(this.options).then(
      barcodeData => {
        this.qrCodeText = barcodeData.text;

        this.ConsultarChassi(this.qrCodeText);
      },
      err => {
        this.authService.hideLoading();
        let data = 'Erro de qr code!';
        this.openModalErro(data);
      }
    );
  }

  ///
  buscaChassi(partChassi) {
    let url =
      this.url +
      '/CarregarExportacao/BuscarChassi?token=' +
      this.authService.getToken() +
      '&partChassi=' +
      partChassi;
    url = url + '&navioId=' + this.navio.id;
    url = url + '&tipoOperacao=' + this.tipoOperacao.id;
    url = url + '&destinoLocalId=' + this.destino.id;

    this.authService.showLoading();
    this.formParqueamentoData.token = this.authService.getToken();

    this.http.get(url).subscribe(
      res => {
        this.responseData = res;

        if (this.responseData.sucesso) {

          this.openModalSelecaoChassi(this.responseData.retorno);
          //this.chassi = this.responseData.retorno[0];
          this.authService.hideLoading();
          //this.ConsultarChassi(this.chassi);
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }
    );
  }

  ///
  ConsultarChassi(chassi) {
    let consultarChassi =
      this.url +
      '/CarregarExportacao/ConsultarChassi?token=' +
      this.authService.getToken() +
      '&chassi=' +
      chassi;
    this.formParqueamentoData.chassi = chassi;

    this.authService.showLoading();

    this.http.get(consultarChassi).subscribe(
      res => {
        this.responseData = res;

        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          this.FinalizarCarregamento(this.responseData.retorno['id']);
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(this.responseData.mensagem);
      }
    );
  }

  ///
  cancelar() {
    this.navCtrl.push(CarregamentoExportPage);
  }

  ///
  navigateToHomePage() {
    this.navCtrl.push(HomePage);
  }

  ///
  toggleMenu = function(this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  ///
  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      console.log(data);
    });
    chassiModal.onWillDismiss(data => {
      console.log('data');
      this.formData.chassi = '';
    });
  }

  ///
  openModalSucesso(data) {
    const chassiModal: Modal = this.modal.create(ModalSucessoComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {
      this.formData.chassi = '';
    });
  }

  ///
  toParqueamento() {
    this.navCtrl.push(ParqueamentoPage);
  }
  toRecebimento() {
    this.navCtrl.push(RecebimentoPage);
  }
  toMovimentacao() {
    this.navCtrl.push(MovimentacaoPage);
  }
  toCarregamento() {
    this.navCtrl.push(CarregamentoPage);
  }
  toParqueamentoExport() {
    this.navCtrl.push(ReceberParquearPage);
  }
  toCarregamentoExport() {
    this.navCtrl.push(CarregamentoExportPage);
  }

  ///
  FinalizarCarregamento(chassiFinal) {
    this.authService.showLoading();

    let carregarExport =
      this.url +
      '/CarregarExportacao/CarregarExportacaoVeiculo?token=' +
      this.authService.getToken() +
      '&veiculoID=' +
      chassiFinal;

    this.http.put(carregarExport, {}, httpOptions).subscribe(
      res => {
        this.responseData = res;

        if (this.responseData.sucesso) {
          this.authService.hideLoading();
          // alert(this.responseData.mensagem);
          var data = {
            message: 'Carregamento exportação realizado com',
            iconClass: 'icon-load-export'
          };
          this.openModalSucesso(data);
          this.atualizarCarregamentoStatus();
        } else {
          this.authService.hideLoading();
          this.openModalErro(this.responseData.mensagem);
        }
      },
      error => {
        this.authService.hideLoading();
        this.openModalErro(error);
      }
    );
  }

  ///
  voltar() {
    this.navCtrl.pop();
  }

  ///
  atualizarCarregamentoStatus() {
    this.authService.showLoading();
    this.carregamentoExportacaoDataService
      .carregarCarregamentoStatus(
        this.navio.id,
        this.tipoOperacao.id,
        this.destino.id
      )
      .subscribe(
        res => {
          if (res.sucesso) {
            this.totalDeVeiculos = res.retorno.totalDeVeiculos;
            this.totalDeVeiculosCarregados =
              res.retorno.totalDeVeiculosCarregados;
          } else {
            this.openModalErro('Erro ao obter dados de status do carregamento');
          }
        },
        err => {
          this.openModalErro('Erro ao obter dados de status do carregamento');
        },
        () => {
          this.authService.hideLoading();
        }
      );
  }

  openModalSelecaoChassi(chassis) {
    const chassiModal: Modal = this.modal.create(ModalSelecaoChassiPage, {
      chassis: chassis
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {
      if (data.chassiSelecionado) {
        this.inputChassi = data.chassiSelecionado;
        this.ConsultarChassi(this.inputChassi);
      }
    });
  }
}
