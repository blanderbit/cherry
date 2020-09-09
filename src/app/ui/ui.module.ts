import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorizeDirective } from './colorize.directive';
import { HighlightDirective } from './highlight.directive';
import { AutofocusDirective } from './autofocus.directive';

const DIRECTIVES = [ColorizeDirective, HighlightDirective, AutofocusDirective];

@NgModule({
    declarations: [
        ...DIRECTIVES,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ...DIRECTIVES
    ]
})
export class UiModule {
}
