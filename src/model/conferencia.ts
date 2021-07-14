import { ConferenciaVeiculoMotivos } from './conferencia-veiculo-motivos';

// Abstrai a ConferenciaVeiculo
export class Conferencia {
  public chassi: string;
  public conferenciaConfiguracaoID: number;
  public dataHoraConferencia: string;
  public nomeUsuario: string;
  public turnoID: number;
  public sincronizar: boolean;
  public conferenciaVeiculoMotivoID: ConferenciaVeiculoMotivos;
  public motivo?: string;
}
