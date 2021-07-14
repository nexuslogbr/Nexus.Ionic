import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  Select,
} from 'ionic-angular';
import { Navio } from '../../model/navio';
import * as $ from 'jquery';
import { ConferenciaDataService } from '../../providers/conferencia-data-service';
import { finalize, tap, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../providers/auth-service/auth-service';
import {
  ConferenciaConfiguracaoArea,
  ConferenciaConfiguracaoResultadoModel,
} from '../../model/conferencia-configuracao-area';
import { ConferenciaConfiguracaoCriacao } from '../../model/conferencia-configuracao-criacao';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { Arquivo } from '../../model/arquivo';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { ConferenciaConfiguracaoDispositivo } from '../../model/conferencia-configuracao-dispositivo';
import { Dispositivo } from '../../model/dispositivo';
import { AlertService } from '../../providers/alert-service';

@Component({
  selector: 'page-nova-conferencia-configuracao-area',
  templateUrl: 'nova-conferencia-configuracao-area.html',
})
export class NovaConferenciaConfiguracaoAreaPage {
  public navio: Navio;
  public arquivo: Arquivo;
  public configuracoes: Array<ConferenciaConfiguracaoArea> = [];
  public botaoDisponibilizarAtivado: boolean = true;
  public botaoAtualizarAtivado: boolean = true;
  public dispositivos: Array<Dispositivo>;

  @ViewChildren(Select) selectGroup: QueryList<Select>;

  public selectOptionsTipo: any = {
    title: 'Tipos de Conferência',
    mode: 'md',
  };

  public selectOptionsDispositivo: any = {
    title: 'Dispositivos',
    mode: 'md',
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public conferenciaDataService: ConferenciaDataService,
    public authService: AuthService,
    public alertService: AlertService
  ) {
    if (navParams.data.navio != null) {
      this.navio = navParams.data.navio;
    }

    if (navParams.data.arquivo != null) {
      this.arquivo = navParams.data.arquivo;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaConferenciaConfiguracaoAreaPage');

    this.authService.showLoadingWhite();

    if (this.navio) {
      this.conferenciaDataService
        .listarNavioAreas(this.navio.id)
        .pipe(
          tap(() => {}),
          switchMap((res) => {
            console.log('res', res);
            if (res.sucesso) {
              this.configuracoes = res.retorno.map(
                (a) =>
                  <ConferenciaConfiguracaoArea>{ area: a, bloqueada: false }
              );
              return forkJoin(
                this.conferenciaDataService.listarConferenciaTipos(),
                this.conferenciaDataService.listarNavioDispositivos(
                  this.navio.id
                )
              );
            }
            return of(null); // retorna um Observable vazio...
          }),
          mergeMap((res) => {
            let conferenciaTiposResponse = res[0];
            let navioDispositivosResponse = res[1];

            if (conferenciaTiposResponse.sucesso) {
              this.configuracoes.forEach(
                (c) => (c.conferenciaTipos = conferenciaTiposResponse.retorno)
              );
            } else {
              throw 'Erro de comunicação com o servidor!';
            }

            if (navioDispositivosResponse.sucesso) {
              this.dispositivos = navioDispositivosResponse.retorno;
              this.dispositivos.forEach((d) => {
                d.disponivel = true;
                d.selecionado = false;
              });

              this.configuracoes.forEach((c) => {
                c.dispositivos = this.dispositivos;
              });
            } else {
              throw res.mensagem;
            }

            // carrega as configurações...
            if (this.navio) {
              return this.conferenciaDataService.listarNavioConferenciaConfiguracoes(
                this.navio.id
              );
            } else if (this.arquivo) {
              return this.conferenciaDataService.listarArquivoConferenciaConfiguracoes(
                this.arquivo.id
              );
            }
            return of(null);
          }),
          catchError((error) => {
            this.alertService.showError(
              'Erro de comunicação com o servidor!',
              null,
              () => {
                this.navCtrl.pop();
              }
            );

            return of(error); // retorna um Observable com o erro...
          }),
          finalize(() => {
            this.authService.hideLoadingWhite();
          })
        )
        .subscribe((res) => {
          if (res.sucesso) {
            let configuracoesCadastradas = res.retorno;
            configuracoesCadastradas.forEach((cc) => {
              let configuracaoCriada = this.configuracoes
                .filter((c) => c.area.id == cc.areaID)
                .shift();
              if (configuracaoCriada) {
                configuracaoCriada.id = cc.id;
                configuracaoCriada.area.selecionado = true;
                configuracaoCriada.bloqueada =
                  parseInt(cc.conferenciaConfiguracaoStatusID) > 1;
                configuracaoCriada.conferenciaTiposSelecionadaId =
                  cc.conferenciaID;
                configuracaoCriada.conferenciaConfiguracaoStatusID =
                  cc.conferenciaConfiguracaoStatusID;
                configuracaoCriada.dispositivosSelecionados = cc.conferenciaConfiguracaoDispositivos.map(
                  (m) => m.dispositivoID
                );
              }

              if (
                configuracaoCriada.dispositivosSelecionados &&
                configuracaoCriada.dispositivosSelecionados.length
              ) {
                configuracaoCriada.dispositivosSelecionados.forEach((ds) => {
                  let dispositivo = this.dispositivos.find((d) => d.id == ds);
                  if (dispositivo) {
                    // dispositivo pode ter sido removido...
                    dispositivo.areaIdOndeSelecionado =
                      configuracaoCriada.area.id;
                    dispositivo.areaSelecionada = configuracaoCriada.area;
                  }
                });
              }
            });

            this.ajustarDisponibilidadeDispositivos();
            this.atualizarStatusBotoes();
          } else {
            this.alertService.showError(
              'Erro de comunicação com o servidor!',
              null,
              () => {
                this.navCtrl.pop();
              }
            );
          }
        });
    } else if (this.arquivo) {
      this.conferenciaDataService
        .listarArquivoAreas(this.arquivo.id)
        .pipe(
          tap(() => {}),
          switchMap((res) => {
            console.log('res', res);
            if (res.sucesso) {
              this.configuracoes = res.retorno.map(
                (a) =>
                  <ConferenciaConfiguracaoArea>{ area: a, bloqueada: false }
              );
              return forkJoin(
                this.conferenciaDataService.listarConferenciaTipos(),
                this.conferenciaDataService.listarArquivoDispositivos(
                  this.arquivo.id
                )
              );
            }
            return of(null); // retorna um Observable vazio...
          }),
          mergeMap((res) => {
            let conferenciaTiposResponse = res[0];
            let arquivoDispositivosResponse = res[1];

            if (conferenciaTiposResponse.sucesso) {
              this.configuracoes.forEach(
                (c) => (c.conferenciaTipos = conferenciaTiposResponse.retorno)
              );
            } else {
              throw 'Erro de comunicação com o servidor!';
            }

            if (arquivoDispositivosResponse.sucesso) {
              this.dispositivos = arquivoDispositivosResponse.retorno;
              this.dispositivos.forEach((d) => {
                d.disponivel = true;
                d.selecionado = false;
              });
              this.configuracoes.forEach((c) => {
                c.dispositivos = this.dispositivos;
              });
            } else {
              throw res.mensagem;
            }

            // carrega as configurações...
            if (this.navio) {
              return this.conferenciaDataService.listarNavioConferenciaConfiguracoes(
                this.navio.id
              );
            } else if (this.arquivo) {
              return this.conferenciaDataService.listarArquivoConferenciaConfiguracoes(
                this.arquivo.id
              );
            }
            return of(null);
          }),
          catchError((error) => {
            console.error(error);
            this.alertService.showError(
              'Erro de comunicação com o servidor!',
              null,
              () => {
                this.navCtrl.pop();
              }
            );
            return of(error); // retorna um Observable com o erro...
          }),
          finalize(() => {
            this.authService.hideLoadingWhite();
          })
        )
        .subscribe((res) => {
          if (res.sucesso) {
            let configuracoesCadastradas = res.retorno;

            configuracoesCadastradas.forEach((cc) => {
              let configuracaoCriada = this.configuracoes
                .filter((c) => c.area.id == cc.areaID)
                .shift();
              if (configuracaoCriada) {
                configuracaoCriada.id = cc.id;
                configuracaoCriada.area.selecionado = true;
                configuracaoCriada.bloqueada =
                  parseInt(cc.conferenciaConfiguracaoStatusID) > 1;
                configuracaoCriada.conferenciaTiposSelecionadaId =
                  cc.conferenciaID;
                configuracaoCriada.dispositivosSelecionados = cc.conferenciaConfiguracaoDispositivos.map(
                  (m) => m.dispositivoID
                );
              }

              if (
                configuracaoCriada.dispositivosSelecionados &&
                configuracaoCriada.dispositivosSelecionados.length
              ) {
                configuracaoCriada.dispositivosSelecionados.forEach((ds) => {
                  let dispositivo = this.dispositivos.find((d) => d.id == ds);
                  dispositivo.areaIdOndeSelecionado =
                    configuracaoCriada.area.id;
                  dispositivo.areaSelecionada = configuracaoCriada.area;
                });
              }
            });

            this.ajustarDisponibilidadeDispositivos();
            this.atualizarStatusBotoes();
          } else {
            this.alertService.showError(
              'Erro de comunicação com o servidor!',
              null,
              () => {
                this.navCtrl.pop();
              }
            );
          }
        });
    }
  }

  changeAreaSelection(configuracao: ConferenciaConfiguracaoArea) {
    console.log('ConferenciaConfiguracaoArea', configuracao);

    if (!configuracao.area.selecionado && configuracao.id > 0) {
      this.alertService.showAlert(
        'A CONFERÊNCIA DESTA ÁREA SERÁ EXCLUÍDA',
        'DESEJA PROSSEGUIR?',
        () => {
          this.updateAreaSelection(configuracao);
          console.log('configuracoes', this.configuracoes);
        },
        () => {
          configuracao.area.selecionado = true;
        }
      );
    } else {
      this.updateAreaSelection(configuracao);
      console.log('configuracoes', this.configuracoes);
    }
  }

  private updateAreaSelection(configuracao: ConferenciaConfiguracaoArea) {
    if (!configuracao.area.selecionado) {
      configuracao.area.selecionado = false;
      configuracao.conferenciaTiposSelecionadaId = null;
      if (
        configuracao.dispositivosSelecionados &&
        configuracao.dispositivosSelecionados.length
      ) {
        configuracao.dispositivosSelecionados.forEach((ds) => {
          let dispositivo = this.dispositivos.find((d) => d.id == ds);
          dispositivo.areaIdOndeSelecionado = null;
          dispositivo.areaSelecionada = null;
        });
        configuracao.dispositivosSelecionados = null;
      }
    }

    this.ajustarDisponibilidadeDispositivos();
    this.atualizarStatusBotoes();
  }

  changeTipoSelection(
    configuracao: ConferenciaConfiguracaoArea,
    indice: number
  ) {
    console.log('ConferenciaConfiguracaoArea', configuracao);
    this.atualizarStatusBotoes();

    let selectDispostivos = this.selectGroup.toArray()[indice * 2 + 1];
    if (selectDispostivos) {
      selectDispostivos.open();
    }
  }

  changeDispositivoSelection(configuracao: ConferenciaConfiguracaoArea) {
    console.log('ConferenciaConfiguracaoArea', configuracao);

    // Ajusta a área do dispositivo selecionado...
    if (
      configuracao.dispositivosSelecionados &&
      configuracao.dispositivosSelecionados.length
    ) {
      configuracao.dispositivosSelecionados.forEach((ds) => {
        let dispositivo = this.dispositivos.find((d) => d.id == ds);
        dispositivo.areaIdOndeSelecionado = configuracao.area.id;
        dispositivo.areaSelecionada = this.configuracoes.find(
          (c) => c.area.id == configuracao.area.id
        ).area;
      });
    }

    this.ajustarDisponibilidadeDispositivos();
    this.atualizarStatusBotoes();
  }

  private ajustarDisponibilidadeDispositivos() {
    let dispositivosSelecionados = [];
    this.configuracoes.forEach((c) => {
      if (c.dispositivosSelecionados && c.dispositivosSelecionados.length) {
        dispositivosSelecionados = dispositivosSelecionados.concat(
          c.dispositivosSelecionados
        );
      }
    });

    this.dispositivos.forEach((d) => {
      d.disponivel = dispositivosSelecionados.every((ds) => ds != d.id);
      if (dispositivosSelecionados.some((ds) => ds == d.id)) {
        console.log('selecionado', d);
      } else {
        if (!d.locado) {
          d.areaSelecionada = null;
          d.areaIdOndeSelecionado = null;
          d.disponivel = true;
          d.selecionado = false;
        }
        console.log('não selecionado', d);
      }
    });
  }

  private atualizarStatusBotoes() {
    let possuiAreasSelecionadasEConfiguradasCorretamente = false;

    if (this.configuracoes.some((c) => c.area.selecionado)) {
      possuiAreasSelecionadasEConfiguradasCorretamente = this.configuracoes
        .filter((c) => c.area.selecionado)
        .every(
          (c) =>
            c.conferenciaTiposSelecionadaId &&
            c.dispositivosSelecionados &&
            c.dispositivosSelecionados.length
        );
    }

    this.botaoDisponibilizarAtivado = possuiAreasSelecionadasEConfiguradasCorretamente;
    let totaoSelecionados = this.configuracoes.filter((c) => c.area.selecionado)
      .length;
    this.botaoAtualizarAtivado =
      totaoSelecionados == 0 ||
      possuiAreasSelecionadasEConfiguradasCorretamente;
  }

  toggleMenu = function (this) {
    $('.menu-body').toggleClass('show-menu');
    $('menu-inner').toggleClass('show');
    $('.icon-menu').toggleClass('close-menu');
    $('side-menu').toggleClass('show');
  };

  atualizarConfiguracoes() {
    if (!this.botaoAtualizarAtivado) {
      this.alertService.showError(
        'Existe área sem dispositivo alocado ou tipo de conferência não selecionado',
        null,
        () => {}
      );
    } else {
      this.salvarConfiguracoes();
    }
  }

  salvarNovaConfiguracoes() {
    if (!this.botaoDisponibilizarAtivado) {
      this.alertService.showError(
        'Existe área sem dispositivo alocado ou tipo de conferência não selecionado',
        null,
        () => {}
      );
    } else {
      this.salvarConfiguracoes();
    }
  }

  salvarConfiguracoes() {
    let configuracoes = this.configuracoes
      .filter((cca) => cca.area.selecionado)
      .map(
        (cca) =>
          <ConferenciaConfiguracao>{
            id: cca.id,
            navioID: this.navio ? this.navio.id : null,
            arquivoID: this.arquivo ? this.arquivo.id : null,
            areaID: cca.area.id,
            conferenciaID: cca.conferenciaTiposSelecionadaId,
            conferenciaConfiguracaoDispositivos: cca.dispositivos
              .filter((d) =>
                cca.dispositivosSelecionados.some((ds) => ds == d.id)
              )
              .map(
                (d) =>
                  <ConferenciaConfiguracaoDispositivo>{ DispositivoID: d.id }
              ),
          }
      );

    //dispositivos: cca.dispositivos.filter(d=> cca.dispositivosSelecionados.some(ds=> ds==d.id))

    let configuracaoesCriacao = new ConferenciaConfiguracaoCriacao();
    configuracaoesCriacao.configuracoes = configuracoes;
    configuracaoesCriacao.arquivoID = this.arquivo ? this.arquivo.id : null;
    configuracaoesCriacao.navioID = this.navio ? this.navio.id : null;

    this.authService.showLoadingWhite();

    this.conferenciaDataService
      .salvarConferenciaConfiguracoes(configuracaoesCriacao)
      .pipe(
        finalize(() => {
          this.authService.hideLoadingWhite();
        })
      )
      .subscribe(
        (res) => {
          if (res.sucesso) {
            let conferenciaConfiguracaoResultadoModel: ConferenciaConfiguracaoResultadoModel =
              res.retorno;

            // TODO: no retorno trazer a informação do status atual......
            if (this.navio) {
              this.navio.statusConfiguracao =
                conferenciaConfiguracaoResultadoModel.statusConfiguracao;
              this.navio.conferenciaStatus =
                conferenciaConfiguracaoResultadoModel.conferenciaStatus;
            } else {
              this.arquivo.statusConfiguracao =
                conferenciaConfiguracaoResultadoModel.statusConfiguracao;
              this.arquivo.conferenciaStatus =
                conferenciaConfiguracaoResultadoModel.conferenciaStatus;
            }
            this.alertService.showInfo(
              'Conferência(s) configurada(s) com sucesso!',
              null,
              () => {
                this.navCtrl.pop();
              }
            );
          } else {
            console.error('erro', res);
            this.alertService.showError(
              'Ocorreu um erro ao salvar as configurações!',
              null,
              () => {
                this.navCtrl.pop();
              }
            );
          }
        },
        (error) => {
          console.error(error);
          this.alertService.showError(error.message, null, () => {
            this.navCtrl.pop();
          });
        }
      );
  }

  voltar() {
    this.navCtrl.pop();
  }

  public getConferenciaConfiguracaoStatus(
    conferenciaConfiguracaoStatusID
  ): string {
    if (!conferenciaConfiguracaoStatusID) {
      return '';
    }

    if (conferenciaConfiguracaoStatusID == 1) {
      return 'Não Iniciada';
    }
    if (conferenciaConfiguracaoStatusID == 2) {
      return 'Em Andamento';
    }
    if (conferenciaConfiguracaoStatusID == 3) {
      return 'Finalizada';
    }
    if (conferenciaConfiguracaoStatusID == 4) {
      return 'Cancelada';
    }

    return '';
  }
}
