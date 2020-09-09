import { Component } from '@angular/core';
import { DynamicField } from '../field';
import { IInputField } from '../components';

@Component({
    selector: 'dynamic-input',
    template: DynamicField.getFromControlTemplate(`
        <input [formControlName]="field.name" [placeholder]="placeholder | translate" [type]="field.type">
    `),
})
export class InputComponent extends DynamicField<IInputField> {
}
