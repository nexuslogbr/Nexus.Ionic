import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCancelarCarregamentoPage } from './modal-cancelar-carregamento';

@NgModule({
  declarations: [
    ModalCancelarCarregamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCancelarCarregamentoPage),
  ],
})
export class ModalCancelarCarregamentoPageModule {}
