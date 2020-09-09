import { ControlValueAccessor, FormArray, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

export class BaseControlValueAccessor implements ControlValueAccessor {
    form: FormGroup | FormArray;

    registerOnChange(fn: any): void {
        this.form.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.form.valueChanges.pipe(first()).subscribe(fn);
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(value: any): void {
        if (!value)
            return;

        this.form.setValue(value);
    }
}
