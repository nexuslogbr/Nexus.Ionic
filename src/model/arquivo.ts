import { ConferenciaChassiResumo } from './conferencia-chassi-resumo';
import { Local } from './local';

export class Arquivo {
  public id: number;
  public empresaId?: number;
  public nomeOriginal: string;
  public nomeServidor: string;
  public tipo: number;
  public status: number;
  public disponivelOffline?: boolean;
  public resumos?: Array<ConferenciaChassiResumo>;
  public statusConfiguracao: string;
  public statusData: string;
  public conferenciaStatus: number;
  public local: Local;
  public statusArquivo: string;
}
