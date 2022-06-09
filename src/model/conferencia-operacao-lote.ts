import { Veiculo } from "./veiculo";
import { Modelo } from "./modelo";
import { Local } from "./local";

export class ConferenciaOperacaoLote {
  public operacaoLoteID: number;
  public operacaoID: number;
  public quantidadeConferida: number;
  public quantidadePrevista: number;
  public quantidadeVinculada: number;
  public quantidadeVeiculos: number;
  public tipoOperacao: number; // 1 Carga, 2 Descarga
  public modelo: Modelo;
  public veiculos: Array<Veiculo>;
  public origem: Local;
  public destino: Local;
  public portoDescarga: Local;
}


