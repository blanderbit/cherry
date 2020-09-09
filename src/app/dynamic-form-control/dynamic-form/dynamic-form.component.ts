import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IFieldConfig } from 'dynamic-form-control';

@Component({
    selector: 'dynamic-form',
    template: `        
        <ng-container *ngFor="let field of controls;" [dynamicField]="field" [group]="form"></ng-container>
    `,
})
export class DynamicFormComponent {
    @Input()
    controls: IFieldConfig[];

    @Input()
    form: FormGroup;
}
