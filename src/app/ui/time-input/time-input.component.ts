import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TimeToStringPipe } from 'date';

enum SameValueHandlingStrategy {
    TakeFirst,
    Summarize,
}

@Component({
    selector: 'app-time-input',
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimeInputComponent),
            multi: true,
        },
        TimeToStringPipe,
    ],
})
export class TimeInputComponent implements OnInit, ControlValueAccessor {
    readonly sameValuesHandlingStrategy: SameValueHandlingStrategy = SameValueHandlingStrategy.Summarize;
    // value in minutes
    time = 0;
    control = new FormControl();

    @Input() set disabled(value: boolean) {
        this.setDisabledState(value);
    }

    @Input() set value(v: number) {
        this.writeValue(v);
    }

    @Output() timeChange = new EventEmitter<number>();

    onTouched = () => {};
    onChange = (v: any) => {};

    constructor(private timeToStringPipe: TimeToStringPipe) {
    }

    ngOnInit() {
        this.control.valueChanges
            .pipe()
            .subscribe((v) => {
                this.time = this.parseValue(v);
                this.onChange(this.time);
                this.timeChange.emit(this.time);
            });
    }

    parseValue(v: string) {
        const flags = this.getRegexFlags();
        const minutesRegex = new RegExp(/\d+(?=m)/, flags);
        const hoursRegex = new RegExp(/\d+(?=h)/, flags);

        const minutes = (v.match(minutesRegex) || []).reduce(sumValues, 0);
        const hours = (v.match(hoursRegex) || []).reduce(sumValues, 0);

        return (hours * 60) + parseInt(minutes, 10);
    }

    getRegexFlags() {
        switch (this.sameValuesHandlingStrategy) {
            case SameValueHandlingStrategy.Summarize:
                return 'g';
            case SameValueHandlingStrategy.TakeFirst:
            default:
                return '';
        }
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

    writeValue(v: any): void {
        this.control.setValue(this.timeToStringPipe.transform(v));
    }
}

function sumValues(prev, curr) {
    return prev + parseInt(curr, 10);
}
