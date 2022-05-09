import { Component, ViewChild, OnDestroy } from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  Slides,
  Content,
  Modal,
  ModalController,
} from 'ionic-angular';
import * as $ from 'jquery';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { ConferenciaConfiguracaoADO } from '../../providers/database/conferencia-configuracao-ado';
import { Turno } from '../../model/turno';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { Navio } from '../../model/navio';
import { Arquivo } from '../../model/arquivo';
import { Local } from '../../model/Local';
import { ConferenciaOperacaoLote } from '../../model/conferencia-operacao-lote';
import { Veiculo } from '../../model/veiculo';
import { ConferenciaService } from '../../providers/conferencia-service';
import { Subscription } from 'rxjs/Subscription';
import { interval } from 'rxjs/observable/interval';
import { finalize, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NovaConferenciaVeiculosPage } from '../nova-conferencia-veiculos/nova-conferencia-veiculos';
import { AlertService } from '../../providers/alert-service';
import { ModalSelecaoChassiPage } from '../modal-selecao-chassi/modal-selecao-chassi';
import { ConferenciaVeiculoMotivos } from '../../model/conferencia-veiculo-motivos';
import { InputChassiControllerComponent } from '../../components/input-chassi-controller/input-chassi-controller';
import { Conferencia } from '../../model/Conferencia';
import { NovaConferenciaMenuPage } from '../nova-conferencia-menu/nova-conferencia-menu';

@Component({
  selector: 'page-nova-conferencia-execucao',
  templateUrl: 'nova-conferencia-execucao.html',
})
export class NovaConferenciaExecucaoPage implements OnDestroy {
  ngOnDestroy(): void {
    this.conferenciaServiceOnErrorSubscription.unsubscribe();
    if (this.onlineSubscription != null) {
      this.onlineSubscription.unsubscribe();
    }
    if (this.turnoTimerSubscription != null) {
      this.turnoTimerSubscription.unsubscribe();
    }
    console.log('NovaConferenciaExecucaoPage ngOnDestroy');
  }

  @ViewChild('pageTop') pageTop: Content;
  @ViewChild('scanner') scanner: InputChassiControllerComponent;
  @ViewChild(Slides) slides: Slides;
  slideLeftSelected: boolean = true;
  slideCenterSelected: boolean = false;
  slideRightSelected: boolean = false;
  primaryColor: string;
  secondaryColor: string;
  inputColor: string;
  buttonColor: string;
  public turno: Turno;
  public configuracao: ConferenciaConfiguracao;
  public usuario: string = '';
  public navio: Navio;
  public arquivo: Arquivo;
  public destinos: Array<Local>;
  public lotes: Array<ConferenciaOperacaoLote>;
  public chassi: string = '';
  public conferenciaServiceOnErrorSubscription: Subscription;
  public delayTurnoChange: boolean = false;
  public showingTurnoChangeDialog: boolean = false;
  public tituloPagina: string;
  public saldoConferencia: number;
  canGoBack: boolean = true;
  public onLine: boolean;
  public onlineSubscription: any;
  public turnoTimerSubscription: Subscription;
  public sincronizando: boolean = false;
  public totalUpload: number = 0;

  public fechamento: boolean = false;
  public contador: number = 0;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public alertService: AlertService,
    public conferenciaDataService: ConferenciaDataService,
    public conferenciaConfiguracaoADO: ConferenciaConfiguracaoADO,
    public modalController: ModalController,
    public conferenciaService: ConferenciaService,
    public alertCtrl: AlertController
  ) {
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
    this.fechamento = navParams.data.fechamento;
    this.tituloPagina = this.fechamento ? 'Fechamento' : 'Conferência';
    this.configuracao = navParams.data.configuracao;
    this.turno = navParams.data.turno;
    this.usuario = navParams.data.usuario;
    this.navio = this.configuracao.navio;
    this.arquivo = this.configuracao.arquivo;
    this.conferenciaServiceOnErrorSubscription = this.conferenciaService.onError$.subscribe(
      (error) => {
        console.error(error);
        this.showErrorAlert('Erro na conferência!', false);
      }
    );



    this.conferenciaService.saldoConferencia$.subscribe((saldo) => {
      this.saldoConferencia = saldo;
    });

    conferenciaService.totalUpload$.subscribe((totalUpload) => {
      this.totalUpload = totalUpload;
    });

    conferenciaService.configuracao = this.configuracao;
    conferenciaService.destino = null;

    if (!this.fechamento) {
      this.conferenciaConfiguracaoADO
        .loadDestinos(this.configuracao.id)
        .subscribe(
          (res) => {
            this.destinos = res;
            if (this.configuracao.arquivo) {
              debugger
              this.conferenciaService.destino = this.destinos[0];
            }
          },
          (error) => console.error(error)
        );

      this.onlineSubscription = interval(1000).subscribe((res) => {
        this.onLine = navigator.onLine;
      });

      this.turnoTimerSubscription = interval(10000).subscribe((res) => {
        if (!this.showingTurnoChangeDialog && !this.delayTurnoChange) {
          let now = new Date();
          if (now > this.turno.turnoFim) {
            this.showingTurnoChangeDialog = true;
            this.showTurnoChangeAlert();

            setTimeout(() => {
              this.delayTurnoChange = false;
            }, 60 * 1000 * 5);
          }
        }
      });
    }
    // if (!localStorage.getItem("contador")) {
    //   this.contador = parseInt(localStorage.getItem('contador'))
    // }

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad NovaConferenciaExecucaoPage');
    this.conferenciaService.update();
  }

  onChassiDisabledClick(message: string) {
    this.canGoBack = true;
    this.showErrorAlert(
      'É NECESSÁRIO SELECIONAR UM DESTINO PARA REALIZAR A CONFERÊNCIA.',
      false,
      () => {
        this.scanner.setFocus();
      }
    );
  }

  onChassiScannedChanged(chassi) {
    console.log('onChassiScannedChanged');

    if (chassi && chassi.length) {
      this.changeBackBehavior(true);
      this.onChassiChanged(chassi, true);
    }
  }

  onChassiChanged(chassi, byScanner: boolean = false) {
    console.log('onChassiChanged');

    if (chassi && chassi.length) {
      this.conferenciaConfiguracaoADO
        .loadVeiculos(
          this.configuracao.id,
          this.conferenciaService.destino.id,
          chassi
        )
        .subscribe(
          (res) => {
            if (res.length) {
              if (res.length > 1) {
                // mais de um chassi retornou...


                if (res.some((v) => !v.conferido)) {
                  let veiculosNaoConferidos = res.filter((v) => !v.conferido);

                  if (veiculosNaoConferidos.length > 1) {
                    const chassiModal: Modal = this.modalController.create(
                      ModalSelecaoChassiPage,
                      {
                        chassis: veiculosNaoConferidos.map((v) => v.chassi),
                      }
                    );


                    chassiModal.present();

                    chassiModal.onDidDismiss((data) => {
                      if (data.chassiSelecionado) {
                        if (data.chassiSelecionado) {
                          this.conferirVeiculo(
                            veiculosNaoConferidos.find(
                              (v) => v.chassi == data.chassiSelecionado
                            ),
                            byScanner
                          );
                        }
                      }
                    });
                  } else {
                    let veiculo = veiculosNaoConferidos[0];
                    this.conferirVeiculo(veiculo, byScanner);
                  }
                } else {
                  this.showInfoAlert('Chassis já conferidos!');
                  if (byScanner) {
                    this.callScanner();
                  } else {
                    this.scanner.setFocus();
                  }
                }
              } else {
                let veiculo = res[0];
                this.conferirVeiculo(veiculo, byScanner);
              }

            } else {
              this.conferenciaConfiguracaoADO
                .loadVeiculosSemDestino(this.configuracao.id, chassi)
                .subscribe((res) => {
                  if (res.length) {
                    this.showInfoAlert(
                      'Chassi relacionado para outro Destino!',
                      byScanner
                        ? null
                        : () => {
                          this.scanner.setFocus();
                        }
                    );
                    if (byScanner) {
                      this.callScanner();
                    }
                  } else {
                    this.showInfoAlert(
                      'Chassi não relacionado para o Navio!',
                      byScanner
                        ? null
                        : () => {
                          this.scanner.setFocus();
                        }
                    );
                    if (byScanner) {
                      this.callScanner();
                    }
                  }
                });
            }
          },
          (error) => {
            console.error(error);
          }
        );
    }

    this.contador = this.contador + 1;

    localStorage.setItem('contador', this.contador.toString())
  }

  openModalSelecaoChassi(chassis) {
    const chassiModal: Modal = this.modalController.create(
      ModalSelecaoChassiPage,
      {
        chassis: chassis,
      }
    );
    chassiModal.present();

    chassiModal.onDidDismiss((data) => {
      if (data.chassiSelecionado) {
        if (data.chassiSelecionado) {
          this.conferirVeiculo(data.chassiSelecionado);
        }
      }
    });
  }

  conferirVeiculo(veiculo: Veiculo, byScanner: boolean = false) {
    if (!veiculo.conferido) {
      this.conferenciaService
        .conferirVeiculo(veiculo, this.usuario, this.turno.id)
        .subscribe(
          (res) => {
            this.showSucessAlert(
              'Chassi ' + veiculo.chassi + ' conferido com sucesso!',
              byScanner
                ? null
                : () => {
                  this.scanner.setFocus();
                }
            );
            this.chassi = '';
            if (byScanner) {
              this.callScanner();
            }
          },
          (error) => {
            console.error(error);
            this.showErrorAlert('Erro ao conferir o veículo!', false);
          }
        );
    } else {
      this.showInfoAlert(
        'Chassi ' + veiculo.chassi + ' já conferido!',
        byScanner
          ? null
          : () => {
            this.scanner.setFocus();
          }
      );
      if (byScanner) {
        this.callScanner();
      } else {
        this.scanner.setFocus();
      }
    }
  }

  callScanner() {
    setTimeout(() => {
      this.scanner.scan();
    }, 2100);
  }

  onDestinoChange(destinoId: number) {
    this.conferenciaService.destino = this.destinos.find(
      (d) => d.id == destinoId
    );
    this.scanner.setFocus();
  }

  changeSlideToLeft() {
    this.slides.slideTo(0, 500);
  }

  changeSlideToCenter() {
    this.slides.slideTo(1, 500);
  }

  changeSlideToRight() {
    this.slides.slideTo(2, 500);
  }

  slideChanged($event) {
    this.slideLeftSelected = $event.realIndex == 0;
    this.slideCenterSelected = $event.realIndex == 1;
    this.slideRightSelected = $event.realIndex == 2;
    setTimeout(() => {
      this.pageTop.scrollToTop();
    }, 200);
  }

  async executarSincronizacao() {

    if (this.onLine) {
      if (this.totalUpload > 0) {
        this.authService.showSincronizacao();

        let conferencias: Conferencia[] = await this.conferenciaConfiguracaoADO.loadConferenciasPendentes(this.configuracao.id);

        // Se isso funcionar, então fica mais fácil quebrar essa rotina em várias chamadas distintas
        let retornoAPI = await this.conferenciaDataService.conferirChassisEmLoteAsync(conferencias, this.configuracao.id);

        this.conferenciaConfiguracaoADO.dropConferenciaConfiguracao(this.configuracao.id);
        this.conferenciaDataService.carregarConfiguracao(this.configuracao.id);
        this.conferenciaConfiguracaoADO.saveConferenciaConfiguracao2(retornoAPI.retorno);

        this.authService.hideSincronizacao();

        this.authService.showLoading();
        this.conferenciaService.update();

        this.gotoListagemVeiculos();
        this.authService.hideLoading();

        this.contador = 0;
        localStorage.setItem('contador', this.contador.toString())

      }
    } else {
      this.alertService.showError(
        'SEM CONEXÃO COM A INTERNET',
        'FIQUE ONLINE E TENTE NOVAMENTE.'
      );
    }
  }
  gotoListagemVeiculos() {
    //this.nativePageTransitions.slide(this.naviteTransitionOptions);
    this.navCtrl.push(NovaConferenciaVeiculosPage, {
      configuracao: this.configuracao,
      destinos: this.destinos,
      fechamento: this.fechamento,
    });
  }

  showErrorAlert(message: string, popView: boolean, onDismiss?: Function) {
    this.alertService.showError(message, null, () => {
      if (popView) {
        this.navCtrl.pop();
      } else {
        if (onDismiss) {
          onDismiss();
        }
      }
    });
  }

  showInfoAlert(message: string, onDismiss?: Function) {
    this.alertService.showAlert(message, null, null, null, onDismiss);
  }

  showSucessAlert(message: string, onDismiss?: Function) {
    this.alertService.showInfo(message, null, onDismiss);
  }

  showWarning() {
    this.alertService.showError(
      'HÁ ITENS PENDENTES DE CONFERÊNCIA NÃO JUSTIFICADOS',
      'NÃO É POSSÍVEL PROSSEGUIR.'
    );
  }

  showTurnoChangeAlert() {
    this.alertService.showAlert(
      'FIM DO TURNO',
      'DESEJA CONTINUAR NO TURNO?',
      () => {
        this.showDelayAlert();
      },
      () => {
        this.navCtrl.pop();
      }
    );
  }



  ok() {

    if (this.contador > 0) {
      this.alertService.showError(
        'NÃO É POSSÍVEL REALIZAR OPERAÇÃO POIS HÁ SINCRONIZAÇÕES PENDENTES'
      );
    }else{
      this.navCtrl.push(NovaConferenciaMenuPage);
    }
  }

  showDelayAlert() {
    this.alertService.showInfo(
      'CONTINUANDO NO TURNO',
      '(alerta em 5 minutos)',
      () => {
        this.delayTurnoChange = true;
        this.showingTurnoChangeDialog = false;
      }
    );
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  voltar() {
    this.navCtrl.pop();
  }

  finalizar() {
    if (this.saldoConferencia == 0) {
      this.authService.showSincronizacao();
      this.conferenciaDataService
        .finalizarConferencia(this.configuracao.id)
        .pipe(
          finalize(() => {
            this.authService.hideSincronizacao();
          })
        )
        .subscribe(
          (res) => {
            if (res.sucesso) {
              this.showSucessAlert('CONFERÊNCIA FINALIZADA!');
              this.configuracao.conferenciaConfiguracaoStatusID = 3;
            } else {
              this.showErrorAlert('Erro ao finalizar a conferência', false);
            }
          },
          (error) => this.showErrorAlert(error, false)
        );
    } else {
      this.alertService.showError(
        'HÁ ITENS PENDENTES DE CONFERÊNCIA NÃO JUSTIFICADOS',
        'NÃO É POSSÍVEL PROSSEGUIR.'
      );
    }
  }

  ionViewCanLeave() {
    console.log('canGoBack', this.canGoBack);

    if (!this.canGoBack) {
      this.canGoBack = !this.canGoBack;
      return false;
    }

    return true;
  }

  changeBackBehavior(value: boolean) {
    this.canGoBack = value;
  }

  // ngAfterViewChecked() {
  //   console.log("ngAfterViewChecked");
  // }

  // ngAfterViewInit() {
  //   console.log("ngAfterViewInit");
  // }
}
