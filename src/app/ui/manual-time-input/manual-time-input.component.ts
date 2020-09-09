import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ManualTimeInputService } from './manual-time-input.service';

const MINUTES_IN_DAY = 24 * 60;

@Component({
    selector: 'app-manual-time-input',
    templateUrl: './manual-time-input.component.html',
    styleUrls: ['./manual-time-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ManualTimeInputComponent),
            multi: true,
        },
    ],
})
export class ManualTimeInputComponent implements ControlValueAccessor {
    private _value: number;
    public control = new FormControl(0);

    @Output()
    public valueChange = new EventEmitter();

    @ViewChild('input', { static: false })
    public inputElement;

    @Input()
    public maxMinutes = MINUTES_IN_DAY;

    public onChange = (value: any) => {};
    public onTouched = () => {};

    @Input() set value(value: number) {

        this.writeValue(value);
    }

    get value(): number {
        return this._value;
    }

    @Input() set disabled(isDisabled: boolean) {
        this.setDisabledState(isDisabled);
    }

    constructor(private timeInputService: ManualTimeInputService) {
    }

    onBlur() {
        const value = this.timeInputService.parseTimeInput(this.control.value);
        const minutes = this.timeInputService.toMinutes(value);
        const previousValue = this._value;
        this.writeValue(minutes != null ? minutes : this._value);
        if (minutes !== previousValue)
            this.valueChange.emit(minutes);

        this.onTouched();
    }

    triggerBlur() {
        this.inputElement.nativeElement.blur();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    writeValue(minutes: number): void {
        minutes = Number(minutes) || 0;
        if (minutes > this.maxMinutes) {
            minutes = this.maxMinutes;
        }

        const timeString = this.timeInputService.fromMinutes(minutes, this.maxMinutes);
        const prevValue = this._value;

        if (timeString) {
            if (minutes !== this._value) {
                this._value = minutes;
            }

            this.control.setValue(timeString);

            if (prevValue != null && prevValue !== this._value) {
                this.onChange(this._value);
            }
        }
    }
}
