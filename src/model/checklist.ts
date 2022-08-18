import { ChecklistItem } from "./checklistItem";
import { Local } from "./local";
import { StakeHolder } from "./stakeholder";

export class Checklist {
  public id: number;
  public nome: string;
  public stakeholder: StakeHolder;
  public local: Local;
  public checkListItens: ChecklistItem[];
  public empresaID: number;
  public usuarioID: number;
  public dataCadastro: string;
  public dataAlteracao: string;
}
