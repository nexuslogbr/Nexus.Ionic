import { GravidadeAvaria } from "./gravidadeAvaria";

export class NivelGravidadeAvaria {
  id: number;
  nome: string;
  gravidadeAvaria: GravidadeAvaria;
  bloqueado: boolean;
  empresaID: number;
  usuarioID: number;
  dataCadastro: Date;
  dataAlteracao: Date;
}
