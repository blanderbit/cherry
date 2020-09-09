import { EditableDivDirective } from './editable-div.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSSRDirective } from './nossr.directive';
import { OnlyNumberDirective } from './only-number.directive';
import { ClickOutsideDirective } from './click-outside.directive';

const DIRECTIVES = [
    EditableDivDirective,
    NoSSRDirective,
    OnlyNumberDirective,
    ClickOutsideDirective,
];

@NgModule({
    declarations: [
        ...DIRECTIVES
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ...DIRECTIVES
    ]
})
export class CustomDirectivesModule {
}
