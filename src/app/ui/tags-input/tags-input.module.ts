import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicTagsInputComponent, TagsInputComponent } from './components/tags-input/tags-input.component';
import { TagComponent } from './components/tag/tag.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Translate } from 'translate';
import { DynamicComponents } from 'dynamic-form-control';
import { FormControlModule } from 'form-control';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTypeaheadModule,
        Translate,
        FormControlModule,
    ],
    declarations: [
        TagsInputComponent,
        TagComponent,
        DynamicTagsInputComponent,
    ],
    providers: [
        {
            provide: DynamicComponents,
            multi: true,
            useValue: {
                'tags-input': DynamicTagsInputComponent,
            }
        }
    ],
    exports: [
        TagsInputComponent,
        DynamicTagsInputComponent,
    ],
    entryComponents: [
        DynamicTagsInputComponent,
    ]
})
export class TagsInputModule {
}
