import {Component, forwardRef} from '@angular/core';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DynamicField} from 'dynamic-form-control';
import {BaseControlValueAccessor} from '../../base-control-value.accessor';
import {CurrencyProvider} from '../../../../../projects/communication/src/lib/services/common/currency.provider';
import {catchError, map, tap} from 'rxjs/operators';
import {ICurrency} from '../../../../../projects/communication/src/lib/models/currency';
import {Observable} from 'rxjs';

export interface IRateControlParams {
    value: number;
    // currency id
    currency: number;
}

@Component({
    selector: 'dynamic-rate-control',
    template: DynamicField.getFromControlTemplate(`        
            <rate-control [formControlName]="formControlName"></rate-control>
    `),
})
export class DynamicRateControlComponent extends DynamicField {
}

@Component({
    selector: 'rate-control',
    templateUrl: './rate-control.component.html',
    styleUrls: ['./rate-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RateControlComponent),
            multi: true,
        },
    ],
})
export class RateControlComponent extends BaseControlValueAccessor {
    form = new FormGroup({
        value: new FormControl(),
        currency: new FormControl(0),
    } as { [key in keyof IRateControlParams]: FormControl });

    items$: Observable<ICurrency[]> = this.currencyProvider.getItems().pipe(
        catchError(() => []),
    );
    menuItems$ = this.items$
        .pipe(
            map(item => item.map(e => {

                return ({
                    title: e.code,
                    value: e.id,
                });
            })),
            tap((res) => this.setDefaultCurrency(res.map(r => {
                return +r.value;
            }))),
        );

    get formValue() {
        return this.form.value as IRateControlParams;
    }

    constructor(public currencyProvider: CurrencyProvider) {
        super();
    }

    registerOnChange(fn: any): void {
        super.registerOnChange(({value, currency} = <any>{}) => fn({value: +value, currency: +currency}));
    }

    private setDefaultCurrency(currencies: number[]) {
        const currency = this.formValue.currency;

        if (currencies && currencies.length && !currency) {
            this.form.get('currency').patchValue(currencies[0]);
        }
    }
}
