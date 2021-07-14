import { NavioOperacaoLote } from "./navio-operacao-lote";
import { Navio } from "./navio";
import { StakeHolder } from "./stakeholder";

export class NavioOperacao
{
  public id: number;

  public navio?: Navio;
  public navioId?: number;

  public tipoOperacao?: number; // Carga ou Descarga;
  public tipoNavegacao?: number;
  public quantidadePrevista?: number;

  public cliente?: StakeHolder;
  public clienteId?: number;

  public lotes?: NavioOperacaoLote[]

}
