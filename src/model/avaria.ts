import { TipoAvaria } from "./tipoAvaria";

export class Avaria {
  id: number;
  nome: string;
  tipoAvaria: TipoAvaria;
  empresaID: number;
  usuarioID: number;
  dataCadastro: string;
  dataAlteracao: string;
}
