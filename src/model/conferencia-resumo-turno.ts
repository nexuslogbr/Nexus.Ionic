export class ConferenciaResumoTurno {
  public data: string;
  public turnoId: number;
  public turnoNome: string;
  public turnoInicio: Date;
  public turnoFim: Date;
  public total: number;
  public detalhes: Array<ConferenciaResumoTurnoItem>;

  get dataFormatada(): string {
    if (this.data) {
      return this.data.replace('-', '/').replace('-', '/');
    }
    return '';
  }

  get turnoHoraInicioFormatado(): string {
    if (this.turnoInicio) {
      let date = this.turnoInicio;
      return (
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      );
    }
    return '';
  }

  get turnoHoraFimFormatado(): string {
    if (this.turnoFim) {
      let date = this.turnoFim;
      return (
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      );
    }
    return '';
  }
}

export class ConferenciaResumoTurnoItem {
  public modelo: string
  public totalConferidos: number;
}