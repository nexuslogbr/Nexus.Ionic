import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import * as $ from "jquery";
import { ConferenciaDataService } from "../../providers/conferencia-data-service";
import { finalize } from "rxjs/operators/finalize";
import { AuthService } from "../../providers/auth-service/auth-service";
import { ConferenciaConfiguracao } from "../../model/conferencia-configuracao";
import { ConferenciaConfiguracaoADO } from "../../providers/database/conferencia-configuracao-ado";
import { NovaConferenciaInputPage } from "../nova-conferencia-input/nova-conferencia-input";
import { AlertService } from "../../providers/alert-service";
//import { NativeTransitionOptions, NativePageTransitions } from '@ionic-native/native-page-transitions';
import { switchMap } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { concat } from "rxjs/observable/concat";
import { Storage } from "@ionic/storage";

@Component({
  selector: "page-nova-conferencia-listar-configuracoes",
  templateUrl: "nova-conferencia-listar-configuracoes.html",
})
export class NovaConferenciaListarConfiguracoesPage {
  configuracoes: any = [];
  carregando: boolean;
  salvando: boolean;
  private _storageKey: string = "NovaConferenciaListarConfiguracoesPageKey";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public alertService: AlertService,
    public conferenciaDataService: ConferenciaDataService,
    public conferenciaConfiguracaoADO: ConferenciaConfiguracaoADO,
    public storage: Storage
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad NovaConferenciaListarConfiguracoesPage");

    if (navigator.onLine) {
      this.authService.showLoadingWhite();
      this.conferenciaDataService
        .listarConfiguracoesDisponiveisDispositivo()
        .pipe(
          finalize(() => {
            this.authService.hideLoadingWhite();
          })
        )
        .subscribe(
          (res) => {
            if (res.sucesso) {
              if (res.retorno && res.retorno.length) {
                this.configuracoes = res.retorno;
                this.storage
                  .ready()
                  .then(() =>
                    this.storage.set(this._storageKey, this.configuracoes)
                  );
              } else {
                this.showError(
                  "Não há conferências cadastradas para este aparelho!"
                );
              }
            } else {
              this.showError(res.mensagem);
            }
          },
          (err) => {
            this.showError("Erro de comunicação ao servidor!");
          }
        );
    } else {
      this.storage.ready().then(() => {
        this.storage.get(this._storageKey).then((data) => {
          if (data != null) {
            this.configuracoes = data;
            this.showAlert(
              "SEM CONEXÃO COM A INTERNET!",
              "INFORMAÇÕES CARREGADAS DO CACHE"
            );
          } else {
            this.showError("SEM CONEXÃO COM A INTERNET");
          }
        });
      });
    }
  }

  showError(message: string) {
    this.alertService.showError(message, null, () => {
      //this.nativePageTransitions.slide(this.naviteTransitionOptions);
      this.navCtrl.pop();
    });
  }

  showSucess(message: string) {
    this.alertService.showInfo(message);
  }

  showAlert(message: string, subMessage?: string) {
    this.alertService.showAlert(message, subMessage);
  }

  toggleMenu = function (this) {
    $(".menu-body").toggleClass("show-menu");
    $("menu-inner").toggleClass("show");
    $(".icon-menu").toggleClass("close-menu");
    $("side-menu").toggleClass("show");
  };

  voltar() {
    this.navCtrl.pop();
  }

  gotoPage(configuracao: ConferenciaConfiguracao) {
    if (navigator.onLine) {
      if (!this.carregando && !this.salvando) {
        this.carregando = true;
        this.salvando = false;

        this.authService.showDownload();
        this.conferenciaDataService
          .carregarConfiguracao(configuracao.id)
          .pipe(
            switchMap((res) => {
              if (res.sucesso) {
                this.carregando = false;
                this.salvando = true;
                var configuracao = res.retorno;
                return concat(
                  this.conferenciaConfiguracaoADO.dropConferenciaConfiguracao(
                    configuracao.id
                  ),
                  this.conferenciaConfiguracaoADO.saveConferenciaConfiguracao2(
                    configuracao
                  ),
                  of({ finalizado: true, configuracao: configuracao })
                );
              } else {
                throw res.mensagem;
              }
            }),
            finalize(() => {
              this.authService.hideDownload();
              this.carregando = false;
              this.salvando = false;
            })
          )
          .subscribe(
            (res: any) => {
              if (res.finalizado) {
                this.showSucess(
                  "Download das informações realizadas com sucesso!"
                );
                //this.nativePageTransitions.slide(this.naviteTransitionOptions);
                this.storage
                  .ready()
                  .then(() =>
                    this.storage.set(
                      res.configuracao.id.toString(),
                      res.configuracao
                    )
                  );
                this.navCtrl.push(NovaConferenciaInputPage, {
                  configuracao: res.configuracao,
                });
              }
            },
            (err) => {
              console.log(err);
              this.showError("Erro ao realizar o download das informações!");
            }
          );
      }
    } else {
      // TODO: ver se tem em cache...
      this.storage.ready().then(() => {
        this.storage.get(configuracao.id.toString()).then((data) => {
          console.log("data", data);
          if (data != null) {
            //this.nativePageTransitions.slide(this.naviteTransitionOptions);
            this.navCtrl.push(NovaConferenciaInputPage, {
              configuracao: data,
            });
            this.showAlert(
              "SEM CONEXÃO COM A INTERNET!",
              "INFORMAÇÕES CARREGADAS DO CACHE"
            );
          } else {
            this.showError("SEM CONEXÃO COM A INTERNET");
          }
        });
      });
    }
  }
}
