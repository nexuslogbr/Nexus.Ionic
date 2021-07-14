import { Modelo } from "./modelo";
import { NavioOperacaoLote } from "./navio-operacao-lote";
import { Veiculo } from "./veiculo";

export class NavioOperacaoLoteInvoice {
  public id: number;

  public navioOperacaoLote?: NavioOperacaoLote;
  public navioOperacaoLoteId?: number;

  public invoice?: string; // Carga ou Descarga;
  public quantidadePrevista?: number;
  public quantidadeConferida?: number;
  public quantidadeVinculada?: number;

  public totalChassis?: number;
  public totalConferidos?: number;

  public modelo?: Modelo;

  public veiculos?: Veiculo[];
}
