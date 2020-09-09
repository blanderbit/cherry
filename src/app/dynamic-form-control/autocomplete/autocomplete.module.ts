import { ANALYZE_FOR_ENTRY_COMPONENTS, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Translate } from 'translate';
import { FormControlModule } from 'form-control';
import { AutocompleteComponent, DynamicAutocompleteComponent } from './autocomplete/autocomplete.component';
import { GridAutocompleteComponent } from './grid-autocomplete/grid-autocomplete.component';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';

const components = [
    AutocompleteComponent,
    DynamicAutocompleteComponent,
    GridAutocompleteComponent
];

@NgModule({
    imports: [
        CommonModule,
        NgbTypeaheadModule,
        Translate,
        FormControlModule,
        CustomDirectivesModule,
    ],
    providers: [
        {
            provide: ANALYZE_FOR_ENTRY_COMPONENTS,
            useValue: [
                GridAutocompleteComponent,
            ],
            multi: true
        },
    ],
    declarations: components,
    entryComponents: components,
    exports: components,
})
export class AutocompleteModule {
}
