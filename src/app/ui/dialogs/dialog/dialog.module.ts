import { NgModule } from '@angular/core';
import { Translate } from 'translate';
import { DialogComponent } from './dialog.component';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'loader';

@NgModule({
    declarations: [
        DialogComponent,
    ],
    imports: [
        Translate,
        CommonModule,
        LoaderModule,
    ],
    entryComponents: [
        DialogComponent,
    ],
    exports: [
        DialogComponent,
    ],
})
export class DialogModule {
}
