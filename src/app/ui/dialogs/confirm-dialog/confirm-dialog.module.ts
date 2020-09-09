import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translate } from 'translate';
import { DialogModule } from '../dialog/dialog.module';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    declarations: [
        ConfirmDialogComponent,
    ],
    imports: [
        CommonModule,
        Translate,
        DialogModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
    exports: [
        ConfirmDialogComponent
    ],
})
export class ConfirmDialogModule {
}
