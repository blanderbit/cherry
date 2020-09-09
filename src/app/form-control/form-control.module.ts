import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlComponent } from './form-control/form-control.component';
import { Translate } from 'translate';
import { IconFormControlComponent } from './icon-form-control/icon-form-control.component';
import { LinearFormControlComponent } from './linear-form-control/linear-form-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '../ui/select/select.module';


@NgModule({
    declarations: [
        FormControlComponent,
        IconFormControlComponent,
        LinearFormControlComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Translate,
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        SelectModule,

        FormControlComponent,
        IconFormControlComponent,
        LinearFormControlComponent,
    ],
})
export class FormControlModule {
}
