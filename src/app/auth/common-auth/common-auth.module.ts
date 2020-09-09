import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTypeToggleDirective } from './input-type-toggle.directive';

@NgModule({
    declarations: [
        AuthFormComponent,
        InputTypeToggleDirective,
    ],
    exports: [
        AuthFormComponent,
        InputTypeToggleDirective,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class CommonAuthModule { }
