import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialMenuComponent } from './material-menu.component';
import { Translate } from 'translate';

@NgModule({
    declarations: [
        MaterialMenuComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatMenuModule,
        Translate,
    ],
    exports: [MaterialMenuComponent],
})
export class MaterialMenuModule {
}
