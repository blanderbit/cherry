import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, RadioControlValueAccessor } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioButtonComponent),
            multi: true
        }
    ]
})
export class RadioButtonComponent implements ControlValueAccessor {
    public control = new FormControl();

    @Input()
    name = 'radio';

    @Input()
    label = '';

    @Input()
    value;

    registerOnChange(fn: any): void {
        this.control.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.control.valueChanges
            .pipe(first())
            .subscribe(fn);
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    writeValue(value: any): void {
        this.control.setValue(value);
    }
}
