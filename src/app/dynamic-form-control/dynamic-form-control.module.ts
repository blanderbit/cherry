import { ANALYZE_FOR_ENTRY_COMPONENTS, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translate } from 'translate';
import { InputComponent } from './input/input.component';
import { GridInputComponent } from './input/grid-input/grid-input.component';
import { SelectComponent } from './select/select.component';
import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from '../ui/select/select.module';
import { DynamicComponents } from './dynamic.components';
import { FormControlModule } from 'form-control';
import { RowComponent } from './row-component/row.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DividerComponent } from './divider/divider.component';
import { AutocompleteModule, DynamicAutocompleteComponent } from 'autocomplete';

const components = [
    InputComponent,
    GridInputComponent,
    SelectComponent,
    RowComponent,
    DividerComponent,
    DynamicFormComponent
];

@NgModule({
    providers: [
        {
            provide: DynamicComponents,
            useValue: {
                input: InputComponent,
                select: SelectComponent,
                autocomplete: DynamicAutocompleteComponent,
                row: RowComponent,
                divider: DividerComponent,
            },
            multi: true,
        },
        {
            provide: ANALYZE_FOR_ENTRY_COMPONENTS,
            useValue: [
                GridInputComponent,
            ],
            multi: true
        }
    ],
    declarations: [
        DynamicFieldDirective,
        ...components,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Translate,
        SelectModule,
        AutocompleteModule,
        FormControlModule,
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        SelectModule,

        DynamicFieldDirective,

        ...components,
    ],
    entryComponents: [...components],
})
export class DynamicFormControlModule {
}
