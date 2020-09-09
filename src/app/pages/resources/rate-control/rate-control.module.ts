import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translate } from 'translate';
import { FormControlModule } from 'form-control';
import { DynamicRateControlComponent, RateControlComponent } from './rate-control.component';
import { DynamicComponents } from 'dynamic-form-control';

const components = [
    RateControlComponent,
    DynamicRateControlComponent
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
                'rate-control': DynamicRateControlComponent,
            }
        }
    ],
    declarations: components,
    entryComponents: components,
    exports: components,
})
export class RateControlModule {

}
