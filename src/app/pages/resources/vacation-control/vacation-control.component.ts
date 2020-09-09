import { Component, forwardRef } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DynamicField } from 'dynamic-form-control';
import { BaseControlValueAccessor } from '../../base-control-value.accessor';

@Component({
    selector: 'dynamic-availability-control',
    template: `
        <div [formGroup]="form">
            <vacation-control [formControlName]="formControlName"></vacation-control>
        </div>
    `,
})
export class DynamicVacationControlComponent extends DynamicField {
}

@Component({
    selector: 'vacation-control',
    templateUrl: './vacation-control.component.html',
    styleUrls: ['../availability-control/availability-control.component.scss', './vacation-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VacationControlComponent),
            multi: true,
        },
    ],
})
export class VacationControlComponent extends BaseControlValueAccessor {
    form = new FormGroup({
        vacation: new FormControl(20, [Validators.required]),
        illness: new FormControl(5, [Validators.required]),
    });
}
