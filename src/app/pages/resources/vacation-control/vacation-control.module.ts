import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translate } from 'translate';
import { FormControlModule } from 'form-control';
import { DynamicComponents } from 'dynamic-form-control';
import { DynamicVacationControlComponent, VacationControlComponent } from './vacation-control.component';

const components = [
    VacationControlComponent,
    DynamicVacationControlComponent
];

@NgModule({
    imports: [
        CommonModule,
        Translate,
        FormControlModule,
    ],
    providers: [
        {
            provide: DynamicComponents,
            multi: true,
            useValue: {
                'vacation-control': DynamicVacationControlComponent,
            }
        }
    ],
    declarations: components,
    entryComponents: components,
    exports: components,
})
export class VacationControlModule {

}
