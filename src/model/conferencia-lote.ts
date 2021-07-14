import { Navio } from './navio';

export class ConferenciaLote {
  public id: number;
  public conferenciaLoteGUI: string;
  public navioId: number;
  public turnoId: number;
  public conferenciaId: number;
  public areadId: number;
  public usuarioId: number;
  public dataHoraInicio: Date;
  public dataHoraFim: Date;
  public navio: Navio;

  get finalizado(): boolean {
    return this.dataHoraFim != null;
  }

}
