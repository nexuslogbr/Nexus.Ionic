export enum enumTelaNome
{
    mnu_adm,
    mnu_adm_empresa,
    mnu_adm_perfil,
    mnu_adm_usuario,

    mnu_cad,
    mnu_cad_esc,
    mnu_cad_lay,
    mnu_cad_lay_lay,
    mnu_cad_loc,
    mnu_cad_mcf,
    mnu_cad_res,
    mnu_cad_obs,
    mnu_cad_tbl,
    mnu_cad_tbv,
    mnu_cad_srv,
    mnu_cad_trp,
    mnu_cad_dsp,
    mnu_cad_sth,
    mnu_cad_lat,
    mnu_cad_lat_lat,
    mnu_cad_lat_res,
    mnu_cad_vei,
    mnu_cad_vei_tve,
    mnu_cad_vei_tch,
    mnu_cad_vei_tav,
    mnu_cad_vei_ava,
    mnu_cad_vei_nga,
    mnu_cad_vei_gav,
    mnu_cad_vei_psc,
    mnu_cad_vei_gsc,
    mnu_cad_vei_mom,
    mnu_cad_vei_par,
    mnu_cad_vei_suc,
    mnu_cad_vei_lan_ava,
    mnu_cad_vei_checklist,
    mnu_cad_vei_responsabilidade_avaria,
    mnu_cad_fab,
    mnu_cad_con,
    mnu_cad_con_tc,
    mnu_cad_con_ar,
    mnu_cad_con_tr,
    mnu_cad_cex,

    mnu_cfg,
    mnu_cfg_ema,
    mnu_cfg_rec,

    mnu_ger_files,

    mnu_mon,
    mnu_mon_ope,
    mnu_mon_pat,
    mnu_mon_ram,
    mnu_mon_sis,

    mnu_ope,
    mnu_ope_mov,
    mnu_ope_exp,
    mnu_ope_nac,
    mnu_ope_obs,
    mnu_ope_blq,
    mnu_ope_blv,
    mnu_ope_rec,
    mnu_ope_srv,
    mnu_ope_fat,
    mnu_ope_can,
    mnu_ope_upl,
    mnu_ope_cht,
    mnu_ope_trf,
    mnu_ope_cfr,
    mnu_ope_cae,
    mnu_ope_cex,

    mnu_rel,
    mnu_rel_aud,
    mnu_rel_chs,
    mnu_rel_fin,
    mnu_rel_rfb,
    mnu_rel_spt,
    mnu_rel_lot,
    mnu_rel_fat,

    mnu_rel_sai,
    mnu_rel_ger,
    mnu_rel_ctf,
    mnu_rel_stt,
    mnu_rel_sch,
    mnu_rel_trn,
    mnu_rel_sdd,
    mnu_rel_trn_trn,
    mnu_rel_trs_sai,
    mnu_rel_est,
    mnu_rel_est_est,
    mnu_rel_est_res,
    mnu_rel_trf,
    mnu_rel_edi,
    mnu_rel_kac,
    mnu_rel_vcf,
    mnu_rel_gm,
    mnu_rel_cex,

    mnu_rom,
    mnu_rom_rom,
    mnu_rom_ret,

    mnu_mob_recebimento,
    mnu_mob_parqueamento,
    mnu_mob_receberparquear,
    mnu_mob_conferencia,
    mnu_mob_parquearbloco,
    mnu_mob_movimentacao,
    mnu_mob_rechego,
    mnu_mob_carregamento,
    mnu_mob_carregamentoexportacao,
    mnu_mob_romaneio,
    mnu_mob_historicochassi,

    mnu_rel_pat,
    mnu_rel_pat_exp,
    mnu_rel_pat_got,
    mnu_rel_blq,

    mnu_rel_ava_cha
}

export enum enumServicoExtraTipo
{
    Importacao = 1,
    Exportacao,
    InLand
}

export enum enumConferenciaTipo
{
    ComAlteracaodeStatus = 1,
    SemAlteracaodeStatus
}

export enum enumOperacaoTipo
{
    carga = 1,
    descarga
}

export enum enumNavegacaoTipo
{
    Cabotagem = 1,
    LongoCurso
}

export enum enumLayoutTipo
{
    Base = 1,
    Adicional,
    Nivel
}

export enum enumArquivoTipo
{
    PlanilhaLote = 1,
    PlanilhaExportacao,
    PlanilhaFaturado,
    PlanilhaTransferido,
    PlanilhaConferenciaChassi,
    PlanilhaRecebimentoViaNavio,
    PlanilhaBloqueio,
    PlanilhaVistoriaChassi,

    PlanilhaChassi = 50,

    ArquivoEDI = 70,

    AnexoRecebidoFaturado = 101,
    AnexoRecebidoChaveAcessoEDI,

    EnvioPlanilhaSaidas = 201,
    EnvioPlanilhaEstoqueResumo,
    EnvioPlanilhaEstoque,
    EnvioPlanilhaFaturamentoEmbarque,
    EnvioPlanilhaTransporte,
    EnvioPlanilhaGM,
    EnvioPlanilhaAvariaChassi,
    EnvioAvariaChassiPDF,
    EnvioPlanilhaConfirmacaoPresenca,
    EnvioPlanilhaAvaria,
    ImagemAvaria = 301
}

export enum enumArquivoStatus
{
    Carregado = 1,
    Importando,
    ImportacaoOK,
    ArquivoErro,
    ImportacaoFalha,
    ArquivoInvalido,
    Recebido
}

export enum enumStatusVeiculoHistorico
{
    Esperado = 1,
    EmEstoque,
    Bloqueado,
    Entregue
}

export enum enumVeiculoStatus
{
    RecebimentoPendente = 1,

    // region Status de Exportacao
    ExportacaoRecebido = 100,
    ExportacaoVistoriado= 105,
    ExportacaoParqueado = 110,
    ExportacaoTransferido = 120,
    Exportado = 130,

    ExportacaoGateInCais = 140,
    ExportacaoEmbarcado = 150,
    ExportacaoCancelado = 160,

    // region Status de Nacionais
    Recebido = 200,
    Vistoriado = 205,
    AguardandoNacionalizacao = 210,
    Nacionalizado = 220,
    Transferido = 230,
    Faturado = 240,
    CarregamentoPendente = 250,
    Carregado = 260,

    Desembarcado = 270,
    GateOutCais = 280,

    // region Status de Compound
    CompoundRecebido = 300,
    CompoundVistoriado = 305,
    CompoundParqueado = 310,
    CompoundFaturado = 320,
    CompoundProgramado = 330,
    CompoundEntregue = 340,

    Bloqueado = 999,
}

export enum enumLocalModoOperacao
{
    PatioAutomotivo = 1,
    Compound
}

export enum enumFaturadoTipoCadastro
{
    Arquivo = 1,
    Manual,
    Anexo
}

export enum enumTransferidoTipoCadastro
{
    Arquivo = 1,
    Manual,
    Anexo
}

export enum enumRomaneioTipo
{
    Carregamento = 1,
    Descarga
}

export enum enumRomaneioStatus
{
    Aguardando = 1,
    Cancelado,
    Bloqueado,
    Aprovado
}

export enum enumModoMonitoramento
{
    DashBoard = 1,
    Monitoramento,
    Sistema,
}

export enum enumEmailNomes
{
    email_relatorio_transporte = 101,
    email_relatorio_faturamento_embarque,
    email_relatorio_estoque,
    email_relatorio_estoque_resumo,
    email_relatorio_saidas,
    email_romaneio_externo,
    email_relatorio_estoque_geral,
    email_relatorio_gm,
    email_relatorio_avaria,
    email_confirmacao_presenca_lote,
    email_monitoramento_sistema,
}

export enum enumReceberNomes
{
    receber_faturas = 101,
    receber_chave_acesso_edi
}

export enum enumRomaneioDetalheStatus
{
    Previsto = 1,
    Conferido,
    EmCarregamento,
    Carregado,
    Cancelado
}

export enum enumStakeholderTipo
{
    Cliente = 1,
    Fabricante,
    Cliente_Fabricante
}

export enum enumAcessoMobile
{
    ConferenciaOnline = 1,
    ConferenciaOffline,
    ConferenciaAmbas
}

export enum enumConferenciaStatus
{
    Pendente = 0,
    Configurada = 1,
    Finalizada = 2
}

export enum enumVistoriaStatus
{
    NaoIniciada = 1,
    EmAndamento,
    Finalizada,
    Cancelada
}

export enum enumConferenciaConfiguracaoStatus
{
    NaoIniciada = 1,
    EmAndamento = 2,
    Finalizada = 3,
    Cancelada = 4
}

export enum enumConferenciaVeiculoMotivo
{
    ItemConferido = 1,
    ItemJustificadoComoConferido = 2,
    ItemJustificadoComoNaoConferido = 3
}

export enum enumI80F33Tipo
{
    INI = 1,
    DET,
    FIM
}

export enum enumAreaTipo
{
    CaisNavio = 1,
    PatioPortuario
}

export enum enumConferenciaFilaTipos
{
    Conferencia = 1,
    Anulacao
}

export enum enumMomento
{
    vistoria = 1,
    lancamentoAvaria
}
