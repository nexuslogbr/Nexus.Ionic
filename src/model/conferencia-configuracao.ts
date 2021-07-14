import { ConferenciaConfiguracaoDispositivo } from './conferencia-configuracao-dispositivo';
import { Area } from './area';
import { ConferenciaOperacaoLote } from './conferencia-operacao-lote';
import { Turno } from './turno';
import { Navio } from './navio';
import { Arquivo } from './arquivo';
export class ConferenciaConfiguracao {
  public id?: number;
  public navioID?: number;
  public arquivoID?: number;
  public areaID: number;
  public area: Area;
  public conferenciaID: number;
  public conferenciaConfiguracaoDispositivos: Array<
    ConferenciaConfiguracaoDispositivo
  >;
  public totalVeiculos: number;
  public totalConferidos: number;
  public turnos: Array<Turno>;
  public navio: Navio;
  public arquivo: Arquivo;
  public conferenciaConfiguracaoStatusID: number;
  public possuiCancelamentoEmFila: boolean;
  public possuiConferenciaEmFila: boolean;

  public conferenciaOperacaoLotes: Array<ConferenciaOperacaoLote>;
}
