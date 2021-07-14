export class ConferenciaResumoHora {
  public data: string;
  public hora: string;
  public total: number;
  public detalhes: Array<ConferenciaResumoHoraItem>;

  get dataFormatada(): string {
    if (this.data) {
      return this.data.replace('-', '/').replace('-', '/');
    }
    return '';
  }

}

export class ConferenciaResumoHoraItem {
  public modelo: string
  public totalConferidos: number;
}
