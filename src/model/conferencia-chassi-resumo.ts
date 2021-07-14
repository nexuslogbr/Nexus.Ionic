import { Veiculo } from "./veiculo";

export class ConferenciaChassiResumo {
    public modeloId: number;
    public modeloNome: string;
    public quantidade: number;
    public quantidadeConferida: number;
    public veiculos?: Array<Veiculo>;
}
