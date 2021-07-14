import { StakeHolder } from "./stakeholder";
import { Modelo } from "./modelo";
import { Local } from "./Local";
import { NavioOperacaoLoteInvoice } from "./navio-operacao-lote-invoice";
import { NavioOperacao } from "./navio-operacao";

export class NavioOperacaoLote
{
  public id: number;

  public navioOperacao?: NavioOperacao;
  public navioOperacaoId?: number;

  public fabricante?: StakeHolder;
  public fabricanteId?: number;

  public modelo?: Modelo;
  public modeloId?: number;

  public destino?: Local;
  public destinoID?: number;

  public origem?: Local;
  public origemID?: number;

  public portoDescarga?: Local;
  public portoDescargaId?: number;
  public quantidadePrevista?: number;
  public quantidadeConferida?: number;
  public quantidadeVinculada?: number;

  public invoices?: NavioOperacaoLoteInvoice[];
}
