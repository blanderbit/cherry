import { NgModule } from '@angular/core';
import { InfoDialogComponent } from './info-dialog.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from '../dialog/dialog.module';
import { Translate } from 'translate';

@NgModule({
  declarations: [
    InfoDialogComponent,
  ],
  imports: [
    DialogModule,
    Translate,
    CommonModule,
  ],
  entryComponents: [
    InfoDialogComponent,
  ],
  exports: [
    InfoDialogComponent,
  ],
})
export class InfoDialogModule {
}
