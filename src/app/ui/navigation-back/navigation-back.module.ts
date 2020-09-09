import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBackComponent } from './navigation-back.component';
import { Translate } from 'translate';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        NavigationBackComponent
    ],
    imports: [
        CommonModule,
        Translate,
        RouterModule
    ],
    exports: [
        NavigationBackComponent
    ]
})
export class NavigationBackModule {
}
