import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Translate } from 'translate';


@NgModule({
    declarations: [MenuComponent],
    imports: [
        CommonModule,
        NgbModule,
        Translate,
    ],
    exports: [MenuComponent],
})
export class MenuModule {
}
