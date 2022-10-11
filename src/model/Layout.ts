import { Local } from "./local";

export interface Layout {
  id: number;
  empresaId?: number;
  localId?: number;
  bloqueado?: number;
  nome: string;
  local: Local;
}
