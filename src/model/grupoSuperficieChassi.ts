import { TipoChassi } from "./tipoChassi";

export class GrupoSuperficieChassi {
  id: number;
  nome: string;
  bloqueado: boolean;
  tipoChassi: TipoChassi;
  empresaID: number;
  usuarioID: number;
  dataCadastro: string;
  dataAlteracao: string;
}
