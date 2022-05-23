import { Conferencia } from "./conferencia";
import { ConferenciaVeiculoMotivos } from "./conferencia-veiculo-motivos";

export class Veiculo {
  chassi: string;
  id: number;
  notaFiscal: string;
  status: string;
  modeloId: number;
  modelo: string;
  localAtual: string;
  layoutAtual: string;
  bolsaoAtual: string;
  posicaoAtual: string;
  conferido: boolean;
  justificado: boolean;
  conferenciaConfiguracaoID: number;
  conferenciaVeiculoMotivoID?: ConferenciaVeiculoMotivos
  operacaoLoteId: number;
  conferenciaVeiculo: Conferencia;
  destinoId: number;
  selecionado: boolean;
}


