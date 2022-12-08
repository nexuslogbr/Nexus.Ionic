import { ParteVeiculo } from "./parteVeiculo";
import { SuperficieChassiParte } from "./superficieChassiParte";

export class Parte {
  id: number;
  nome: string;
  public parteVeiculo: ParteVeiculo;
  public superficieChassiParte: SuperficieChassiParte;
}
