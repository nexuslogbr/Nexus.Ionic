import { Area } from "./area";

export class Dispositivo {
  public id: number;
  public nome: string;
  public selecionado: boolean;
  public disponivel: boolean;
  public areaIdOndeSelecionado?: number;
  public areaSelecionada: Area;
  public locado: boolean;
  public locacao: string;
}
