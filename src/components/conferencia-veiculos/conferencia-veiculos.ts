import { ConferenciaConfiguracaoADO } from './../../providers/database/conferencia-configuracao-ado';
import { Veiculo } from './../../model/Veiculo';
import { Component, Input } from '@angular/core';
import { ConferenciaConfiguracao } from '../../model/conferencia-configuracao';
import { Pagination } from '../../model/pagination';
import { finalize } from 'rxjs/operators';
import { Local } from '../../model/Local';

@Component({
  selector: 'conferencia-veiculos',
  templateUrl: 'conferencia-veiculos.html',
})
export class ConferenciaVeiculosComponent {
  @Input() fechamento: boolean;
  @Input() configuracao: ConferenciaConfiguracao;
  @Input() disableCheckboxes: boolean = false;
  @Input() carregarTodos: boolean = false;
  @Input() carregarSomenteConferidos: boolean = false;
  @Input() carregarSomenteNaoConferidos: boolean = false;
  @Input() filtroChassi: string = '';
  @Input() refresh: boolean = false;
  @Input() destino: Local;

  veiculos: Array<any> = [];
  pagination: Pagination<Veiculo> = new Pagination<Veiculo>();
  selecionarTodos: boolean = false;

  constructor(private ado: ConferenciaConfiguracaoADO) {}

  ngOnChanges(values: any) {
    this.selecionarTodos = false;
    this.carregarVeiculos(null, true);
  }

  changeAll() {
    if (!this.disableCheckboxes) {
      this.selecionarTodos = !this.selecionarTodos;
      this.veiculos.forEach((v: any) => (v.selecionado = this.selecionarTodos));
      this.ado.alterarStatusSelecaoVeiculo(
        this.selecionarTodos,
        this.configuracao.id,
        null,
        this.carregarTodos
          ? null
          : this.carregarSomenteConferidos
          ? true
          : false
      );
    }
  }

  change(veiculo: Veiculo) {
    veiculo.selecionado = !veiculo.selecionado;
    this.ado.alterarStatusSelecaoVeiculo(
      veiculo.selecionado,
      this.configuracao.id,
      veiculo.chassi
    );
  }

  carregarVeiculos(infiniteScroll?: any, reset: boolean = false) {
    console.log('chamou carregarVeiculos');
    if (reset) {
      this.pagination.page = 0;
    }
    this.ado
      .loadVeiculosPaginado(
        this.configuracao.id,
        this.pagination,
        this.destino ? this.destino.id : null,
        this.filtroChassi,
        this.carregarTodos
          ? null
          : this.carregarSomenteConferidos
          ? true
          : false,
        null
      )
      .pipe(
        finalize(() => {
          if (infiniteScroll) {
            infiniteScroll.complete();
          }
        })
      )
      .subscribe((res) => {
        console.log('paginantion', this.pagination);
        this.pagination = res;
        if (!reset) {
          this.veiculos = [...this.veiculos, ...res.data];
        } else {
          this.veiculos = res.data;
        }
      });
  }

  doInfinit(infiniteScroll) {
    if (this.pagination.hasMoreData) {
      this.pagination.page += 1;
      this.carregarVeiculos(infiniteScroll);
    }
  }
}
