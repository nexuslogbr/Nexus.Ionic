import { DateTime } from "ionic-angular";

export class TipoAvaria{
  id: number;
  nome: string;
  sigla: string;
  cor: string;
  empresaID: number;
  usuarioID: number;
  dataCadastro: DateTime;
  dataAlteracao: DateTime;
}
