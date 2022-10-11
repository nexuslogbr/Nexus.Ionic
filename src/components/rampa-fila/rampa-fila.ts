import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  Modal,
  ModalController
} from "ionic-angular";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ModalErrorComponent } from "../../components/modal-error/modal-error";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataRetorno } from "../../model/dataretorno";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Component({
  selector: "rampa-fila",
  templateUrl: "rampa-fila.html"
})
export class RampaFilaComponent {
  url: string;
  rampas: any;
  RampaFila = {
    romaneioID: 0,
    romaneioDetalheID: 0,
    rampaID: 0,
    filaID: 0
  };
  romaneio: any;
  filas: any;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private modal: ModalController,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.url = this.authService.getUrl();
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter RampaFilaComponent");
    let data = this.navParams.get("data");
    this.RampaFila.romaneioID = data.romaneioID;
    this.RampaFila.romaneioDetalheID = data.romaneioDetalheID;
    console.log(this.RampaFila);
    console.log(data);
    this.carregarRomaneio(this.RampaFila.romaneioID);
  }

  carregarRomaneio(romaneioId) {
    this.authService.showLoading();
    let url =
      this.url +
      "/Romaneio/CarregarRomaneio?token=" +
      this.authService.getToken() +
      "&romaneioId=" +
      romaneioId;

    this.http.get<DataRetorno>(url).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.authService.hideLoading();
          console.log("romaneio-retorno", data.retorno);
          this.romaneio = data.retorno;
          this.rampaFila();
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  rampaFila() {
    this.authService.showLoading();
    let url =
      this.url +
      "/Romaneio/ListarRampas?token=" +
      this.authService.getToken() +
      "&data=" +
      this.romaneio.data;

    this.http.get<DataRetorno>(url).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          console.log(data.retorno);
          this.rampas = data.retorno;
          this.authService.hideLoading();
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  onRampaChange(value) {
    this.authService.showLoading();
    this.RampaFila.rampaID = Number(value);
    console.log(event);
    // this.RampaFila.romaneioDetalheID = Number(id);

    let rampa =
      this.url +
      "/Romaneio/ListarFilas?token=" +
      this.authService.getToken() +
      "&rampaID=" +
      value +
      "&data=" +
      this.romaneio.data;

    this.http.get<DataRetorno>(rampa).subscribe(
      res => {
        let data = res;

        if (data.sucesso) {
          this.authService.hideLoading();

          this.filas = data.retorno;
        } else {
          this.authService.hideLoading();
          this.openModalErro(data.mensagem);
        }
      },
      error => {
        this.openModalErro(error.status + " - " + error.statusText);
        this.authService.hideLoading();
        console.log(error);
      }
    );
  }

  onFilaChange(value) {
    this.RampaFila.filaID = Number(value);

    console.log(this.RampaFila);
  }

  voltar() {
    this.viewCtrl.dismiss("cancelado");
  }

  finalizar() {
    this.authService.showLoading();

    let salvarRampaFila =
      this.url +
      "/Carregar/SalvarRampaFila?token=" +
      this.authService.getToken();

    this.http
      .post<DataRetorno>(salvarRampaFila, this.RampaFila, httpOptions)
      .subscribe(
        res => {
          let data = res;
          console.log(data);

          if (data.sucesso) {
            this.viewCtrl.dismiss("sucesso");
            this.authService.hideLoading();
          } else {
            this.authService.hideLoading();
            this.openModalErro(data.mensagem);
          }
        },
        error => {
          this.authService.hideLoading();
          this.openModalErro(error.status + " - " + error.statusText);
          console.log(error);
        }
      );
  }

  openModalErro(data) {
    const chassiModal: Modal = this.modal.create(ModalErrorComponent, {
      data: data
    });
    chassiModal.present();

    chassiModal.onDidDismiss(data => {});
    chassiModal.onWillDismiss(data => {});
  }
}
