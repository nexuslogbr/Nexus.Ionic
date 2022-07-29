import { ConferenciaConfiguracaoADO } from './../../providers/database/conferencia-configuracao-ado';
import { Veiculo } from '../../model/veiculo';
import { Component, Input } from '@angular/core';
import { Pagination } from '../../model/pagination';

@Component({
  selector: 'vistoria-veiculos',
  templateUrl: 'vistoria-veiculos.html'
})
export class VistoriaVeiculosComponent {

  @Input() veiculos: Array<Veiculo> = [];
  pagination: Pagination<Veiculo> = new Pagination<Veiculo>();

  constructor(private ado: ConferenciaConfiguracaoADO) {}

  ngOnChanges(values: any) {
    this.carregarVeiculos(null, true);
  }

  carregarVeiculos(infiniteScroll?: any, reset: boolean = false) {

  }

  doInfinit(infiniteScroll) {
    if (this.pagination.hasMoreData) {
      this.pagination.page += 1;
      this.carregarVeiculos(infiniteScroll);
    }
  }
}
