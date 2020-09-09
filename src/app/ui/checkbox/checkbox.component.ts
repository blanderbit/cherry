import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
    ],
})
export class CheckboxComponent implements ControlValueAccessor {

    _value: any;

    @Input() size: number = 26;
    @Input() iconSize: number = 11;
    @Input() checked: boolean = false;
    @Input() borderRadius: number = 50;

    @Input() set value(v) {
        this._value = v;
    }
    get value() {
        return this._value;
    }

    @Input() disabled = false;

    @Output() isChecked: EventEmitter<any> = new EventEmitter<any>();
    onChange = (v: any) => {};
    onTouched = () => {};

    check(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.onCheck(!this.checked);
        // this.isChecked.emit(this.item);
        // console.log(this.checked);
    }

    unselect() {
        this.onCheck(false);
    }

    select() {
        this.onCheck(true);
    }

    onCheck(v: boolean) {
        const value = this.checked = v ;

        this.onTouched();
        this.onChange(value);

        this.isChecked.emit(value);

    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // this.disabled = false;
    }

    writeValue(value: boolean): void {
        this.checked = value;
    }
}
