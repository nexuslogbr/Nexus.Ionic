import { Area } from "./area";
import { Dispositivo } from "./dispositivo";
import { ConferenciaTipo } from "./conferencia-tipo";

export class ConferenciaConfiguracaoArea {
  public id?: number;
  public navioID?: number;
  public arquivoID?: number;
  public areaID: number;
  public conferenciaID: number;
  public area: Area;
  public dispositivos: Array<Dispositivo>;
  public conferenciaTipos: Array<ConferenciaTipo>;
  public conferenciaTiposSelecionadaId: any;
  public dispositivosSelecionados: any;
  public conferenciaConfiguracaoStatusID?: number;

  // Quando a conferencia para essa configuração já está em andamento...
  public bloqueada: boolean;
}

export class ConferenciaConfiguracaoResultadoModel {
  public conferenciaStatus?: number;
  public navioID?: number;
  public arquivoID?: number;
  public statusConfiguracao: string;
}
