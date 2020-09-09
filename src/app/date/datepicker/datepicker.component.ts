import {Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidatorFn} from '@angular/forms';
import {NgbDate, NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {distinctUntilChanged} from 'rxjs/operators';
import * as moment from 'moment';
import {FocusableOption, FocusOrigin, ListKeyManagerOption} from '@angular/cdk/a11y';

export const DateSequenceErrorKey = 'dateSequenceError';

const DATE_SEQUENCE_ERROR = {
    [DateSequenceErrorKey]: true,
};

export interface IDateLessThanValidatorOptions {
    dateParser?: (date: any) => any;
}

export class DateValidators {
    static dateLessThan(dateField1: string, dateField2: string, options: IDateLessThanValidatorOptions = {
        dateParser: (v) => v,
    }): ValidatorFn {
        return (formGroup: FormGroup): { [key: string]: boolean } | null => {
            const formatter = options.dateParser;
            const control1 = formGroup.get(dateField1);
            const control2 = formGroup.get(dateField2);

            if (!control1 || !control2)
                return null;


            const date1 = formatter(control1.value);
            const date2 = formatter(control2.value);

            if ((date1 != null && date2 != null) && moment(date1).isAfter(date2)) {
                control1.setErrors(DATE_SEQUENCE_ERROR);
                return DATE_SEQUENCE_ERROR;
            }

            if (control1.hasError(DateSequenceErrorKey)) {
                delete control1[DateSequenceErrorKey];
            }

            return null;
        };
    }

    static dateSequence(compareField: string): ValidatorFn {
        return (c: FormControl): { [key: string]: boolean } | null => {
            const form = c.parent;
            const value = c.value;
            const compareToValue = (form && form.controls[compareField]) ? form.controls[compareField].value : null;

            if (value != null && (compareToValue != null) && (value > compareToValue)) {
                return {
                    [DateSequenceErrorKey]: true,
                };
            }

            return null;
        };
    }
}

export interface IRangeParams {
    from: string;
    to: string;
}

export interface IDateRangeParams {
    startDate: string;
    endDate: string;
}

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true,
        },
    ],
})
export class DatepickerComponent implements FocusableOption, ControlValueAccessor, OnInit, ListKeyManagerOption {
    private _value;
    control = new FormControl();
    hoveredDate = null;
    min: NgbDateStruct;
    max: NgbDateStruct;
    @ViewChild('d', { static: false }) datePicker;

    @Input()
    set value(value: string) {
        this.writeValue(this.adapter.fromModel(value));
    }

    @Input()
    set minDate(value: string) {
        this.min = value ? this.adapter.fromModel(value) : null;
    }

    @Input()
    set maxDate(value: string) {
        this.max = this.adapter.fromModel(value);
    }

    @Input()
    set disabled(value: boolean) {
        this.setDisabledState(value);
    }

    @Input() showWeekNumbers = false;

    @Output() dateSelect = new EventEmitter<string>();

    @Input() placeholder = 'datepicker.placeholder';

    @Input() error: any;

    @Input() showIcon = true;

    @Input() highlightWeek = false;

    @Input() icon = 'icon-date';

    get focused() {
        return this.datePicker.isOpen();
    }

    onChange = (value) => {};
    onTouched = () => {};

    constructor(private adapter: NgbDateAdapter<string>) {
    }

    ngOnInit() {
        this.control.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(value => {
                console.log('VALUe CHANGED');

                this.onChange(value);
                this.dateSelect.emit(value);

            });
    }

    isHovered(date: NgbDate) {
        return date.equals(this.hoveredDate);
    }

    open() {
        this.datePicker.open();
    }

    close() {
        this.datePicker.close();
    }

    isWithinWeek(date: NgbDate): boolean {
        const serverDate = this.adapter.toModel(date);
        const selectedDate = this.control.value;

        const start = Date.weekFirstDay(serverDate);
        const end = Date.weekLastDay(serverDate);

        return moment(selectedDate).isBetween(start, end, 'day');
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        isDisabled ? this.control.disable({ emitEvent: false }) :
            this.control.enable({ emitEvent: false });
    }

    writeValue(obj: any): void {
        if (obj && this._value !== obj) {
            this._value = obj;
            this.control.setValue(obj);
        }
    }

    focus(origin?: FocusOrigin): void {
        this.open();
    }
}

