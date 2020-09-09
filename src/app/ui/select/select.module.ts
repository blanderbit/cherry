import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { MenuModule } from 'menu';
import { Translate } from 'translate';

@NgModule({
    declarations: [SelectComponent],
    imports: [
        CommonModule,
        MenuModule,
        Translate,
    ],
    exports: [SelectComponent]
})
export class SelectModule {
}
