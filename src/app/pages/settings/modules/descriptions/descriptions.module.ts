import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DescriptionsComponent } from './descriptions/descriptions.component';
import { DescriptionFormComponent } from './description-form/description-form.component';
import { FormControlModule } from 'form-control';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Translate } from 'translate';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormControlModule,
        TextFieldModule,
        Translate.localize('descriptions'),
        RouterModule.forChild([
            {
                path: '',
                component: DescriptionsComponent
            },
        ]),
    ],
    declarations: [
        DescriptionsComponent,
        DescriptionFormComponent,
    ],
})
export class DescriptionsModule {
}
