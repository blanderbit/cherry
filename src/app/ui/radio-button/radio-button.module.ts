import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { Translate } from 'translate';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        RadioButtonComponent
    ],
    imports: [
        CommonModule,
        Translate,
        ReactiveFormsModule
    ],
    exports: [
        RadioButtonComponent,
    ]
})
export class RadioButtonModule {
}
