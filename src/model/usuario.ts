export interface Usuario {
  id: number;
  nome: string;
  email: string;
  code: string;
  clienteExterno: boolean;
  localNome: string;
  token: string;
  confereOffline: boolean;
  confereOnline: boolean;
  localModoOperacao: number;
  menus: number[];
}
