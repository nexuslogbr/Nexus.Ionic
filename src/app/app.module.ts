import { SincronizacaoInfoComponent } from './../components/sincronizacao-info/sincronizacao-info';
import { PatioAutomotivo } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version';
import { DatePicker } from '@ionic-native/date-picker';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Flashlight } from '@ionic-native/flashlight';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ChartsModule } from 'ng2-charts';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';

// Providers e Services
import { DataService } from '../providers/data-service';
import { AuthService } from '../providers/auth-service/auth-service';

// Pages
import { CarregamentoCanceladoPage } from '../pages/carregamento-cancelado/carregamento-cancelado';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ParqueamentoPage } from '../pages/parqueamento/parqueamento';
import { RecebimentoPage } from '../pages/recebimento/recebimento';
import { RomaneioCePage } from '../pages/romaneio-ce/romaneio-ce';
import { RomaneioPage } from '../pages/romaneio/romaneio';
import { MovimentacaoPage } from '../pages/movimentacao/movimentacao';
import { ReceberParquearPage } from '../pages/receber-parquear/receber-parquear';
import { CarregamentoExportPage } from '../pages/carregamento-export/carregamento-export';
import { CarregamentoPage } from '../pages/carregamento/carregamento';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SobrePage } from '../pages/sobre/sobre';
import { HistoricoChassiResumoPage } from '../pages/historico-chassi-resumo/historico-chassi-resumo';
import { RechegoPage } from '../pages/rechego/rechego';
import { ParquearBlocoPage } from '../pages/parquear-bloco/parquear-bloco';
import { TabsPage } from '../pages/tabs/tabs';
import { SobreCePage } from '../pages/sobre-ce/sobre-ce';
import { NovoRomaneioPage } from '../pages/novo-romaneio/novo-romaneio';
import { NovoRomaneioCePage } from '../pages/novo-romaneio-ce/novo-romaneio-ce';
import { RomaneioListarPage } from '../pages/romaneio-listar/romaneio-listar';
import { RomaneioOrdenarPage } from '../pages/romaneio-ordenar/romaneio-ordenar';
import { OrdenarRomaneioFilaPage } from '../pages/ordenar-romaneio-fila/ordenar-romaneio-fila';
import { RomaneioFilaPage } from '../pages/romaneio-fila/romaneio-fila';
import { RomaneioCeListarPage } from '../pages/romaneio-ce-listar/romaneio-ce-listar';
import { RecebimentoInformationPage } from '../pages/recebimento-information/recebimento-information';
import { HistoricoChassiPage } from '../pages/historico-chassi/historico-chassi';
import { CarregamentoResumoPage } from '../pages/carregamento-resumo/carregamento-resumo';
import { MenuCePage } from '../pages/menu-ce/menu-ce';
import { CarregamentoSimulacaoPage } from '../pages/carregamento-simulacao/carregamento-simulacao';
import { CarregamentoSimulacaoChassiPage } from '../pages/carregamento-simulacao-chassi/carregamento-simulacao-chassi';
import { CarregamentoSimulacaoLeituraPage } from '../pages/carregamento-simulacao-leitura/carregamento-simulacao-leitura';
import { CarregamentoSimulacaoResumoPage } from '../pages/carregamento-simulacao-resumo/carregamento-simulacao-resumo';

import { ModalErrorComponent } from '../components/modal-error/modal-error';
import { ModalSucessoComponent } from '../components/modal-sucesso/modal-sucesso';
import { ModalDeviceComponent } from '../components/modal-device/modal-device';
import { ModalLoadingComponent } from '../components/modal-loading/modal-loading';
import { SideMenuComponent } from '../components/side-menu/side-menu';
import { SideMenuCeComponent } from '../components/side-menu-ce/side-menu-ce';
import { ModalChassisComponent } from '../components/modal-chassis/modal-chassis';
import { ModalRecebimentoComponent } from '../components/modal-recebimento/modal-recebimento';
import { ModalRecebimentoExportComponent } from '../components/modal-recebimento-export/modal-recebimento-export';
import { FormRecebimentoComponent } from '../components/form-recebimento/form-recebimento';
import { DashboardAccordionComponent } from '../components/dashboard-accordion/dashboard-accordion';
import { ModalChassiParqueamentoComponent } from '../components/modal-chassi-parqueamento/modal-chassi-parqueamento';
import { FormParqueamentoComponent } from '../components/form-parqueamento/form-parqueamento';
import { ModalVolumeImportacaoComponent } from '../components/modal-volume-importacao/modal-volume-importacao';
import { ModalImportMovimentacaoComponent } from '../components/modal-import-movimentacao/modal-import-movimentacao';
import { ModalExportMovimentacaoComponent } from '../components/modal-export-movimentacao/modal-export-movimentacao';
import { ModalHistoricoChassiComponent } from '../components/modal-historico-chassi/modal-historico-chassi';

import { MenuComponent } from '../components/menu/menu.component';
import { FormMovimentacaoComponent } from '../components/form-movimentacao/form-movimentacao';
import { ModalNovoVeiculoComponent } from '../components/modal-novo-veiculo/modal-novo-veiculo';
import { ModalReceberParquearComponent } from '../components/modal-receber-parquear/modal-receber-parquear';
import { ModalAnaliseRomaneioComponent } from '../components/modal-analise-romaneio/modal-analise-romaneio';
import { ModalEditarRomaneioComponent } from '../components/modal-editar-romaneio/modal-editar-romaneio';
import { CarregamentoListComponent } from '../components/carregamento-list/carregamento-list';
import { CarregamentoResumoComponent } from '../components/carregamento-resumo/carregamento-resumo';
import { SubstituirChassiComponent } from '../components/substituir-chassi/substituir-chassi';
import { InputChassiComponent } from '../components/input-chassi/input-chassi';
import { FormReceberParquearComponent } from '../components/form-receber-parquear/form-receber-parquear';
import { FormRecebimentoExportComponent } from '../components/form-recebimento-export/form-recebimento-export';
import { ModalAnaliseRomaneioCeComponent } from '../components/modal-analise-romaneio-ce/modal-analise-romaneio-ce';
import { AlertComponent } from '../components/alert/alert';
import { ModalCarregamentoExportComponent } from '../components/modal-carregamento-export/modal-carregamento-export';
import { ModalCarregamentoExportOkComponent } from '../components/modal-carregamento-export-ok/modal-carregamento-export-ok';
import { ModalEditarRomaneioCeComponent } from '../components/modal-editar-romaneio-ce/modal-editar-romaneio-ce';
import { ModalChassiMovimentacaoComponent } from '../components/modal-chassi-movimentacao/modal-chassi-movimentacao';
import { ModalChassiReceberParquearComponent } from '../components/modal-chassi-receber-parquear/modal-chassi-receber-parquear';
import { ModalRomaneioComponent } from '../components/modal-romaneio/modal-romaneio';
import { ModalChassiCarregamentoComponent } from '../components/modal-chassi-carregamento/modal-chassi-carregamento';
import { ModalVolumeExportacaoComponent } from '../components/modal-volume-exportacao/modal-volume-exportacao';
import { ModalRechegoComponent } from '../components/modal-rechego/modal-rechego';
import { FormRechegoComponent } from '../components/form-rechego/form-rechego';
import { VeiculoAccordionComponent } from '../components/veiculo-accordion/veiculo-accordion';
import { ModalNovoVeiculoCarregadoComponent } from '../components/modal-novo-veiculo-carregado/modal-novo-veiculo-carregado';
import { ModalMultiplosRomaneiosComponent } from '../components/modal-multiplos-romaneios/modal-multiplos-romaneios';
import { ModalRampaFilaComponent } from '../components/modal-rampa-fila/modal-rampa-fila';
import { ModalParquearBlocoComponent } from '../components/modal-parquear-bloco/modal-parquear-bloco';
import { FormParquearBlocoComponent } from '../components/form-parquear-bloco/form-parquear-bloco';
import { RampaFilaComponent } from '../components/rampa-fila/rampa-fila';
import { CarregamentoConsultaComponent } from '../components/carregamento-consulta/carregamento-consulta';
import { ModalCancelarChassiPageModule } from '../pages/modal-cancelar-chassi/modal-cancelar-chassi.module';
import { ModalCancelarCarregamentoPageModule } from '../pages/modal-cancelar-carregamento/modal-cancelar-carregamento.module';
import { CarregamentoTabComponent } from '../components/carregamento-tab/carregamento-tab';
import { DashboardVagasPage } from '../pages/dashboard-vagas/dashboard-vagas';
import { DashboardVagasBolsaoPage } from '../pages/dashboard-vagas-bolsao/dashboard-vagas-bolsao';
import { DispositivoRemoverConfirmacaoPage } from '../pages/dispositivo-remover-confirmacao/dispositivo-remover-confirmacao';
import { CarregamentoExportOperacaoPage } from '../pages/carregamento-export-operacao/carregamento-export-operacao';
import { NavioDataService } from '../providers/navio-data-service';
import { CarregamentoExportacaoDataService } from '../providers/carregamento-exportacao-data-service';
import { ConferenciaMenuPage } from '../pages/conferencia-menu/conferencia-menu';
import { ConferenciaConfiguracaoNavioPage } from '../pages/conferencia-configuracao-navio/conferencia-configuracao-navio';
import { ConferenciaConfiguracaoResumoPage } from '../pages/conferencia-configuracao-resumo/conferencia-configuracao-resumo';
import { ConferenciaNavioSelecaoPage } from '../pages/conferencia-navio-selecao/conferencia-navio-selecao';
import { ConferenciaNavioResumoPage } from '../pages/conferencia-navio-resumo/conferencia-navio-resumo';
import { EscalaResumoComponent } from '../components/escala-resumo/escala-resumo';
import { ConferenciaNavioPage } from '../pages/conferencia-navio/conferencia-navio';
import { ConferenciaDestinoPage } from '../pages/conferencia-destino/conferencia-destino';
import { ConferenciaDataService } from '../providers/conferencia-data-service';
import { ConferenciaExecucaoPage } from '../pages/conferencia-execucao/conferencia-execucao';
import { ConfiguracaoService } from '../providers/configuracao-service';
import { ModalSelecaoChassiPage } from '../pages/modal-selecao-chassi/modal-selecao-chassi';
import { DatabaseProvider } from '../providers/database/database';
import { SQLite } from '@ionic-native/sqlite';
import { NavioADO } from '../providers/database/navio-ado';
import { NavioStorageProvider } from '../providers/storage/navio-storage-provider';
import { ConferenciaConfiguracaoStorageProvider } from '../providers/storage/conferencia-configuracao-storage-provider';
import { ConferenciaStorageProvider } from '../providers/storage/conferencia-storage-provider';
import { ConferenciaFinalizadosPage } from '../pages/conferencia-finalizados/conferencia-finalizados';
import { ArquivoDataService } from '../providers/arquivo-data-service';
import { ConferenciaConfiguracaoPlanilhaPage } from '../pages/conferencia-configuracao-planilha/conferencia-configuracao-planilha';
import { PlanilhaResumoComponent } from '../components/planilha-resumo/planilha-resumo';
import { ConferenciaPlanilhaResumoPage } from '../pages/conferencia-planilha-resumo/conferencia-planilha-resumo';
import { ConferenciaPlanilhaExecucaoPage } from '../pages/conferencia-planilha-execucao/conferencia-planilha-execucao';
import { ModalConfirmacaoPage } from '../pages/modal-confirmacao/modal-confirmacao';
import { ConferenciaLoteOnlineListagemPage } from '../pages/conferencia-lote-online-listagem/conferencia-lote-online-listagem';
import { ConferenciaNavioLoteDataService } from '../providers/conferencia-navio-lote-data-service';
import { HeaderNavioComponent } from '../components/header-navio/header-navio';
import { ConferenciaLoteResumoPage } from '../pages/conferencia-lote-resumo/conferencia-lote-resumo';
import { NovaConferenciaMenuPage } from '../pages/nova-conferencia-menu/nova-conferencia-menu';
import { NovaConferenciaConfiguracaoPage } from '../pages/nova-conferencia-configuracao/nova-conferencia-configuracao';
import { NovaConferenciaConfiguracaoAreaPage } from '../pages/nova-conferencia-configuracao-area/nova-conferencia-configuracao-area';
import { NovaConferenciaListarConfiguracoesPage } from '../pages/nova-conferencia-listar-configuracoes/nova-conferencia-listar-configuracoes';
import { ConfiguracaoItemComponent } from '../components/configuracao-item/configuracao-item';
import { ConferenciaConfiguracaoADO } from '../providers/database/conferencia-configuracao-ado';
import { NovaConferenciaInputPage } from '../pages/nova-conferencia-input/nova-conferencia-input';
import { NovaConferenciaExecucaoPage } from '../pages/nova-conferencia-execucao/nova-conferencia-execucao';
import { ConferenciaHeaderComponent } from '../components/conferencia-header/conferencia-header';
import { InputChassiControllerComponent } from '../components/input-chassi-controller/input-chassi-controller';
import { ConferenciaResumoTurnoComponent } from '../components/conferencia-resumo-turno/conferencia-resumo-turno';
import { ConferenciaService } from '../providers/conferencia-service';
import { NovaConferenciaVeiculosPage } from '../pages/nova-conferencia-veiculos/nova-conferencia-veiculos';
import { NovaConferenciaVeiculosConferidosPage } from '../pages/nova-conferencia-veiculos-conferidos/nova-conferencia-veiculos-conferidos';
import { NovaConferenciaVeiculosPendentesPage } from '../pages/nova-conferencia-veiculos-pendentes/nova-conferencia-veiculos-pendentes';
import { NovaConferenciaVeiculosTodosPage } from '../pages/nova-conferencia-veiculos-todos/nova-conferencia-veiculos-todos';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { ConferenciaVeiculosComponent } from '../components/conferencia-veiculos/conferencia-veiculos';
import { NovaConferenciaListarFinalizadasPage } from '../pages/nova-conferencia-listar-finalizadas/nova-conferencia-listar-finalizadas';
import { NovaConferenciaJustificativaPage } from '../pages/nova-conferencia-justificativa/nova-conferencia-justificativa';
import { ModalJustificativaNaoConferidoPage } from '../pages/modal-justificativa-nao-conferido/modal-justificativa-nao-conferido';
import { ModalJustificativaItemAnuladoPage } from '../pages/modal-justificativa-item-anulado/modal-justificativa-item-anulado';
import { ModalJustificativaIncluirConferenciaPage } from '../pages/modal-justificativa-incluir-conferencia/modal-justificativa-incluir-conferencia';
import { NovaConferenciaListarConcluirPage } from '../pages/nova-conferencia-listar-concluir/nova-conferencia-listar-concluir';
import { ModelAlertPage } from '../pages/model-alert/model-alert';
import { ModelInfoPage } from '../pages/model-info/model-info';
import { ModelErrorPage } from '../pages/model-error/model-error';
import { AlertService } from '../providers/alert-service';
import { ModalLoadingWhiteComponent } from '../components/modal-loading-white/modal-loading-white';
import { ModalDownloadingComponent } from '../components/modal-downloading/modal-downloading';
import { ModalSincronizandoComponent } from '../components/modal-sincronizando/modal-sincronizando';
import { ModalDatabasePage } from '../components/modal-database/modal-database';
import { BloqueioPage } from '../pages/bloqueio/bloqueio';
import { BloquearPage } from '../pages/bloquear/bloquear';
import { DesbloquearPage } from '../pages/desbloquear/desbloquear';
import { FormBloqueioComponent } from '../components/form-bloqueio/form-bloqueio';
import { ModalChassisBloqueioComponent } from '../components/modal-chassis-bloqueio/modal-chassis-bloqueio';
import { ModalChassisDesbloqueioComponent } from '../components/modal-chassis-desbloqueio/modal-chassis-desbloqueio';
import { FormDesbloqueioComponent } from '../components/form-desbloqueio/form-desbloqueio';
import { LancamentoServicoPage } from '../pages/lancamento-servico/lancamento-servico';
import { ModalLancamentoServicoComponent } from '../components/modal-lancamento-servico/modal-lancamento-servico';
import { FormLancamentoServicoComponent } from '../components/form-lancamento-servico/form-lancamento-servico';
import { ObservacoesPage } from '../pages/observacoes/observacoes';
import { ModalObservacoesComponent } from '../components/modal-observacoes/modal-observacoes';
import { FormObservacoesComponent } from '../components/form-observacoes/form-observacoes';
import { AlterarCorPage } from '../pages/alterar-cor/alterarcor';
import { VistoriaPage } from '../pages/vistoria/vistoria';
import { ModalChassisVistoriaComponent } from '../components/modal-chassis-vistoria/modal-chassis-vistoria';
import { BuscarAvariasPage } from '../pages/buscar-avarias/buscar-avarias';
import { ListarAvariasPage } from '../pages/listar-avarias/listar-avarias';
import { EditarAvariasPage } from '../pages/editar-avarias/editar-avarias';
import { QualidadeDashboardBuscaAvariasPage } from '../pages/qualidade-dashboard-busca-avarias/qualidade-dashboard-busca-avarias';
import { QualidadeMenuPage } from '../pages/qualidade-menu/qualidade-menu';
import { LancamentoAvariaPage } from '../pages/lancamento-avaria/lancamento-avaria';
import { LancarAvariaComponent } from '../components/lancar-avaria/lancar-avaria';
import { LancarAvariaSelecionarComponent } from '../components/lancar-avaria-selecionar/lancar-avaria-selecionar';
import { ProgressBarModule } from 'angular-progress-bar';
import { CommonModule } from '@angular/common';

import { FormLancamentoAvariaComponent } from '../components/form-lancamento-avaria/form-lancamento-avaria';
import { ModalLancamentoAvariaComponent } from '../components/modal-lancamento-avaria/modal-lancamento-avaria';
import { MomentoDataService } from '../providers/momento-data-service';
import { ModalBuscaChassiComponent } from '../pages/modal-busca-chassi/modal-busca-chassi';
import { ModalSelecionarChassiComponent } from '../components/modal-selecionar-chassi/modal-selecionar-chassi';
import { LancamentoAvariaSelecaoSuperficiePage } from '../pages/lancamento-avaria-selecao-superficie/lancamento-avaria-selecao-superficie';
import { AvariaDataService } from '../providers/avaria-data-service';
import { GravidadeDataService } from '../providers/gravidade-data-service';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/File';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { ModalSelecionarChassiBuscaComponent } from '../components/modal-selecionar-chassi-busca/modal-selecionar-chassi-busca';
import { CanvasDrawComponent } from '../components/canvas-draw/canvas-draw';

@NgModule({
  declarations: [
    PatioAutomotivo,
    ModalErrorComponent,
    ModalSucessoComponent,
    ModalAnaliseRomaneioComponent,
    LoginPage,
    HomePage,
    ParqueamentoPage,
    RecebimentoPage,
    RomaneioCePage,
    RomaneioPage,
    ModalLoadingComponent,
    ModalLoadingWhiteComponent,
    ModalDownloadingComponent,
    ModalDatabasePage,
    ModalSincronizandoComponent,
    SideMenuComponent,
    MovimentacaoPage,
    ReceberParquearPage,
    CarregamentoExportPage,
    CarregamentoPage,
    DashboardPage,
    SobrePage,
    HistoricoChassiResumoPage,
    RechegoPage,
    ParquearBlocoPage,
    TabsPage,
    SobreCePage,
    NovoRomaneioPage,
    NovoRomaneioCePage,
    RomaneioListarPage,
    RomaneioOrdenarPage,
    OrdenarRomaneioFilaPage,
    RomaneioFilaPage,
    RomaneioCeListarPage,
    RecebimentoInformationPage,
    HistoricoChassiPage,
    ModalDeviceComponent,
    MenuComponent,
    SideMenuCeComponent,
    MenuCePage,
    ModalChassisComponent,
    ModalRecebimentoComponent,
    FormRecebimentoComponent,
    DashboardAccordionComponent,
    ModalChassiParqueamentoComponent,
    FormParqueamentoComponent,
    ModalVolumeImportacaoComponent,
    ModalImportMovimentacaoComponent,
    ModalExportMovimentacaoComponent,
    ModalHistoricoChassiComponent,
    VeiculoAccordionComponent,
    CarregamentoListComponent,
    RampaFilaComponent,
    CarregamentoConsultaComponent,
    FormParquearBlocoComponent,
    AlertComponent,
    CarregamentoResumoComponent,
    FormMovimentacaoComponent,
    FormReceberParquearComponent,
    FormRecebimentoExportComponent,
    FormRechegoComponent,
    InputChassiComponent,
    ModalAnaliseRomaneioCeComponent,
    ModalCarregamentoExportComponent,
    ModalCarregamentoExportOkComponent,
    ModalChassiCarregamentoComponent,
    ModalChassiMovimentacaoComponent,
    ModalChassiReceberParquearComponent,
    ModalEditarRomaneioComponent,
    ModalEditarRomaneioCeComponent,
    ModalMultiplosRomaneiosComponent,
    ModalNovoVeiculoComponent,
    ModalNovoVeiculoCarregadoComponent,
    ModalParquearBlocoComponent,
    ModalRampaFilaComponent,
    ModalReceberParquearComponent,
    ModalRecebimentoExportComponent,
    ModalRechegoComponent,
    ModalRomaneioComponent,
    ModalVolumeExportacaoComponent,
    SubstituirChassiComponent,
    CarregamentoResumoPage,
    CarregamentoCanceladoPage,
    CarregamentoTabComponent,
    ConfiguracaoItemComponent,
    CarregamentoSimulacaoPage,
    CarregamentoSimulacaoChassiPage,
    CarregamentoSimulacaoLeituraPage,
    CarregamentoSimulacaoResumoPage,
    DashboardVagasPage,
    DashboardVagasBolsaoPage,
    DispositivoRemoverConfirmacaoPage,
    CarregamentoExportOperacaoPage,
    ConferenciaMenuPage,
    ConferenciaConfiguracaoNavioPage,
    ConferenciaConfiguracaoResumoPage,
    ConferenciaNavioSelecaoPage,
    ConferenciaNavioResumoPage,
    EscalaResumoComponent,
    HeaderNavioComponent,
    PlanilhaResumoComponent,
    ConferenciaNavioPage,
    ConferenciaDestinoPage,
    ConferenciaExecucaoPage,
    ModalSelecaoChassiPage,
    ConferenciaFinalizadosPage,
    ConferenciaConfiguracaoPlanilhaPage,
    ConferenciaPlanilhaResumoPage,
    ConferenciaPlanilhaExecucaoPage,
    ModalConfirmacaoPage,
    ConferenciaLoteOnlineListagemPage,
    ConferenciaLoteResumoPage,
    NovaConferenciaMenuPage,
    NovaConferenciaConfiguracaoPage,
    NovaConferenciaConfiguracaoAreaPage,
    NovaConferenciaListarConfiguracoesPage,
    NovaConferenciaInputPage,
    NovaConferenciaExecucaoPage,
    ConferenciaHeaderComponent,
    InputChassiControllerComponent,
    ConferenciaResumoTurnoComponent,
    NovaConferenciaVeiculosPage,
    NovaConferenciaVeiculosConferidosPage,
    NovaConferenciaVeiculosPendentesPage,
    NovaConferenciaVeiculosTodosPage,
    ConferenciaVeiculosComponent,
    NovaConferenciaListarFinalizadasPage,
    NovaConferenciaJustificativaPage,
    ModalJustificativaNaoConferidoPage,
    ModalJustificativaItemAnuladoPage,
    ModalJustificativaIncluirConferenciaPage,
    NovaConferenciaListarConcluirPage,
    ModelInfoPage,
    ModelAlertPage,
    ModelErrorPage,
    SincronizacaoInfoComponent,
    BloqueioPage,
    BloquearPage,
    DesbloquearPage,
    FormBloqueioComponent,
    FormDesbloqueioComponent,
    ModalChassisBloqueioComponent,
    ModalChassisDesbloqueioComponent,
    LancamentoServicoPage,
    ModalLancamentoServicoComponent,
    FormLancamentoServicoComponent,
    ObservacoesPage,
    ModalObservacoesComponent,
    FormObservacoesComponent,
    AlterarCorPage,
    VistoriaPage,
    ModalChassisVistoriaComponent,
    BuscarAvariasPage,
    ListarAvariasPage,
    EditarAvariasPage,
    QualidadeDashboardBuscaAvariasPage,
    QualidadeMenuPage,
    LancamentoAvariaPage,
    LancarAvariaComponent,
    LancarAvariaSelecionarComponent,
    FormLancamentoAvariaComponent,
    ModalLancamentoAvariaComponent,
    ModalBuscaChassiComponent,
    ModalSelecionarChassiComponent,
    LancamentoAvariaSelecaoSuperficiePage,
    AlterarCorPage,
    ModalSelecionarChassiBuscaComponent,
    CanvasDrawComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrMaskerModule,
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(PatioAutomotivo, {
      preloadModules: true,
      monthNames: [
        'Janeiro',
        'Fevereiro',
        'Mar\u00e7o',
        'Marco',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      monthShortNames: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      dayNames: [
        'Domingo',
        'Segunda-feira',
        'Ter\u00e7a-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sabado',
      ],
      dayShortNames: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
    ChartsModule,
    DragulaModule,
    ModalCancelarChassiPageModule,
    ModalCancelarCarregamentoPageModule,
    HttpClientModule,
    ReactiveFormsModule,
    ProgressBarModule,
    CommonModule,
    RoundProgressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PatioAutomotivo,
    ModalSucessoComponent,
    ModalErrorComponent,
    LoginPage,
    HomePage,
    ParqueamentoPage,
    RecebimentoPage,
    RomaneioCePage,
    RomaneioPage,
    ModalLoadingComponent,
    ModalLoadingWhiteComponent,
    ModalDownloadingComponent,
    ModalDatabasePage,
    ModalSincronizandoComponent,
    SideMenuComponent,
    MovimentacaoPage,
    ReceberParquearPage,
    CarregamentoExportPage,
    CarregamentoPage,
    DashboardPage,
    SobrePage,
    HistoricoChassiResumoPage,
    RechegoPage,
    ParquearBlocoPage,
    TabsPage,
    SobreCePage,
    NovoRomaneioPage,
    NovoRomaneioCePage,
    RomaneioListarPage,
    RomaneioOrdenarPage,
    OrdenarRomaneioFilaPage,
    RomaneioFilaPage,
    RomaneioCeListarPage,
    RecebimentoInformationPage,
    HistoricoChassiPage,
    ModalDeviceComponent,
    MenuComponent,
    SideMenuCeComponent,
    MenuCePage,
    ModalChassisComponent,
    ModalRecebimentoComponent,
    FormRecebimentoComponent,
    DashboardAccordionComponent,
    ModalChassiParqueamentoComponent,
    FormParqueamentoComponent,
    ModalVolumeImportacaoComponent,
    ModalImportMovimentacaoComponent,
    ModalExportMovimentacaoComponent,
    ModalHistoricoChassiComponent,
    VeiculoAccordionComponent,
    ModalAnaliseRomaneioComponent,
    CarregamentoListComponent,
    RampaFilaComponent,
    CarregamentoConsultaComponent,
    FormParquearBlocoComponent,
    AlertComponent,
    CarregamentoResumoComponent,
    FormMovimentacaoComponent,
    FormReceberParquearComponent,
    FormRecebimentoExportComponent,
    FormRechegoComponent,
    InputChassiComponent,
    ModalAnaliseRomaneioCeComponent,
    ModalCarregamentoExportComponent,
    ModalCarregamentoExportOkComponent,
    ModalChassiCarregamentoComponent,
    ModalChassiMovimentacaoComponent,
    ModalChassiReceberParquearComponent,
    ModalEditarRomaneioComponent,
    ModalEditarRomaneioCeComponent,
    ModalMultiplosRomaneiosComponent,
    ModalNovoVeiculoComponent,
    ModalNovoVeiculoCarregadoComponent,
    ModalParquearBlocoComponent,
    ModalRampaFilaComponent,
    ModalReceberParquearComponent,
    ModalRecebimentoExportComponent,
    ModalRechegoComponent,
    ModalRomaneioComponent,
    ModalVolumeExportacaoComponent,
    SubstituirChassiComponent,
    CarregamentoResumoPage,
    CarregamentoCanceladoPage,
    CarregamentoTabComponent,
    ConfiguracaoItemComponent,
    CarregamentoSimulacaoPage,
    CarregamentoSimulacaoChassiPage,
    CarregamentoSimulacaoLeituraPage,
    CarregamentoSimulacaoResumoPage,
    DashboardVagasPage,
    DashboardVagasBolsaoPage,
    DispositivoRemoverConfirmacaoPage,
    CarregamentoExportOperacaoPage,
    ConferenciaMenuPage,
    ConferenciaConfiguracaoNavioPage,
    ConferenciaConfiguracaoResumoPage,
    ConferenciaNavioSelecaoPage,
    ConferenciaNavioResumoPage,
    ConferenciaNavioPage,
    ConferenciaDestinoPage,
    ConferenciaExecucaoPage,
    ConferenciaFinalizadosPage,
    ConferenciaConfiguracaoPlanilhaPage,
    ConferenciaPlanilhaResumoPage,
    ConferenciaPlanilhaExecucaoPage,
    ModalConfirmacaoPage,
    ConferenciaLoteOnlineListagemPage,
    ConferenciaLoteResumoPage,
    NovaConferenciaMenuPage,
    NovaConferenciaConfiguracaoPage,
    NovaConferenciaConfiguracaoAreaPage,
    NovaConferenciaListarConfiguracoesPage,
    NovaConferenciaInputPage,
    NovaConferenciaExecucaoPage,
    ConferenciaHeaderComponent,
    InputChassiControllerComponent,
    ConferenciaResumoTurnoComponent,
    NovaConferenciaVeiculosPage,
    NovaConferenciaVeiculosConferidosPage,
    NovaConferenciaVeiculosPendentesPage,
    NovaConferenciaVeiculosTodosPage,
    ConferenciaVeiculosComponent,
    NovaConferenciaListarFinalizadasPage,
    NovaConferenciaJustificativaPage,
    ModalJustificativaNaoConferidoPage,
    ModalJustificativaItemAnuladoPage,
    ModalJustificativaIncluirConferenciaPage,
    NovaConferenciaListarConcluirPage,
    ModelInfoPage,
    ModelAlertPage,
    ModelErrorPage,
    ModalSelecaoChassiPage,
    SincronizacaoInfoComponent,
    BloqueioPage,
    BloquearPage,
    DesbloquearPage,
    FormBloqueioComponent,
    FormDesbloqueioComponent,
    ModalChassisBloqueioComponent,
    ModalChassisDesbloqueioComponent,
    LancamentoServicoPage,
    ModalLancamentoServicoComponent,
    FormLancamentoServicoComponent,
    ObservacoesPage,
    ModalObservacoesComponent,
    FormObservacoesComponent,
    AlterarCorPage,
    VistoriaPage,
    ModalChassisVistoriaComponent,
    BuscarAvariasPage,
    ListarAvariasPage,
    EditarAvariasPage,
    QualidadeDashboardBuscaAvariasPage,
    QualidadeMenuPage,
    LancamentoAvariaPage,
    LancarAvariaComponent,
    LancarAvariaSelecionarComponent,
    FormLancamentoAvariaComponent,
    ModalLancamentoAvariaComponent,
    ModalBuscaChassiComponent,
    ModalSelecionarChassiComponent,
    LancamentoAvariaSelecaoSuperficiePage,
    AlterarCorPage,
    ModalSelecionarChassiBuscaComponent,
    CanvasDrawComponent
  ],
  providers: [
    Camera,
    AuthService,
    StatusBar,
    Network,
    SplashScreen,
    ScreenOrientation,
    AppVersion,
    NativeStorage,
    Flashlight,
    BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler },

    DatePicker,
    DataService,
    NavioDataService,
    ConferenciaDataService,
    ConferenciaNavioLoteDataService,
    CarregamentoExportacaoDataService,
    ConfiguracaoService,
    DatabaseProvider,
    SQLite,
    NavioADO,
    ConferenciaConfiguracaoADO,
    NavioStorageProvider,
    ConferenciaConfiguracaoStorageProvider,
    ConferenciaStorageProvider,
    ArquivoDataService,
    ConferenciaService,
    AlertService,
    MomentoDataService,
    AvariaDataService,
    GravidadeDataService,
    File,
    WebView,
    FilePath
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
