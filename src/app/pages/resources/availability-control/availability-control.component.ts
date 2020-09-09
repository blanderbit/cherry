import { Component, forwardRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DynamicField } from 'dynamic-form-control';
import { numbersFromEnum } from 'components';
import { DayOfWeek } from 'communication';
import { BaseControlValueAccessor } from '../../base-control-value.accessor';

@Component({
    selector: 'dynamic-availability-control',
    template: `
        <div [formGroup]="form">
            <availability-control [formControlName]="formControlName"></availability-control>
        </div>
    `,
    styles: []
})
export class DynamicAvailabilityControlComponent extends DynamicField {
}

const [Sunday, ...Days] = numbersFromEnum(DayOfWeek);

@Component({
    selector: 'availability-control',
    templateUrl: './availability-control.component.html',
    styleUrls: ['./availability-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AvailabilityControlComponent),
            multi: true,
        },
    ],
})
export class AvailabilityControlComponent extends BaseControlValueAccessor {
    Days = [...Days, Sunday];

    form = new FormArray([]);

    getFormGroup(day) {
        return this.form.controls[day];
    }

    writeValue(values: any): void {
        if (!this.form.length) {
            const controls = numbersFromEnum(DayOfWeek).map(getControls);

            for (const i of controls)
                this.form.push(new FormGroup(i));
        }

        // for (const value of values) {
        //     const control = this.form.get(value.day);
        //
        //     control.setValue(value);
        // }
    }
}

function getControls(day) {
    const isWeekend = day === DayOfWeek.Sunday || day === DayOfWeek.Saturday;

    return {
        enabled: new FormControl(!isWeekend),
        time: new FormControl(isWeekend ? 0 : 8 * 60)
    };
}
