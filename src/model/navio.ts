import { NavioOperacao } from './navio-operacao';
import { Local } from './local';

export class Navio {
  public id: number;
  public nome: string;
  public viagem?: string;
  public quantidade?: number;
  public afretador?: string;
  public ETA?: Date;
  public ETB?: Date;
  public ETS?: Date;
  public operacoes?: NavioOperacao[];
  public disponivelOffline?: boolean;
  public porto: Local;
  public statusConfiguracao: string;
  public statusData: string;
  public conferenciaStatus: number;
}
