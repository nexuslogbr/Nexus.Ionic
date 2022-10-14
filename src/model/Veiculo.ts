import { Conferencia } from "./conferencia";
import { ConferenciaVeiculoMotivos } from "./conferencia-veiculo-motivos";
import { Modelo } from "./modelo";

export class Veiculo {
  public chassi: string;
  public id: number;
  public notaFiscal: string;
  public status: string;
  public modeloId: number;
  public modelo: string;
  public localAtual: string;
  public layoutAtual: string;
  public bolsaoAtual: string;
  public posicaoAtual: string;
  public conferido: boolean;
  public justificado: boolean;
  public conferenciaConfiguracaoID: number;
  public conferenciaVeiculoMotivoID?: ConferenciaVeiculoMotivos
  public operacaoLoteId: number;
  public conferenciaVeiculo: Conferencia;
  public destinoId: number;
  public selecionado: boolean;
  public vistoriado: boolean;

  public model: Modelo
}


