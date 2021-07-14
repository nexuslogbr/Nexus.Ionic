import { ConferenciaSumModelo } from "./conferencia-sum-modelo";

export class ConferenciaSumDestino {
  public destinoId: number;
  public destinoNome: string;
  public quantidadeVeiculos: number;
  public quantidadeConferidos: number;
  public modelos: Array<ConferenciaSumModelo>;
}


