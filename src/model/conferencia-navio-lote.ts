import { Area } from './area';
import { Turno } from './turno';
import { Usuario } from './usuario';

export class ConferenciaNavioLote {
  public id: number;
  public conferenciaLoteGUI: string;
  public navioID: number;
  public turnoID: number;
  public conferenciaID: number;
  public areaID: number;
  public dataHoraInicio: Date;
  public dataHoraFim: Date;
  public area: Area;
  public turno: Turno;
  public destinoID: number;
  public finalizada: boolean;
  public conferenciaUsuario: Usuario;
  public totalConferidos: number;
  public totalVeiculos: number;
}
