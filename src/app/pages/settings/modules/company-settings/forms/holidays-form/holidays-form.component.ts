import {Component, OnInit} from '@angular/core';
import {IHoliday} from 'communication';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanySettingsForm} from '../company-settings-form.component';
import {PARAM_KEYS} from '../../keys';

export type ITypedFormGroup<T = any> = {
    [key in keyof T]?: FormControl;
};

@Component({
    selector: 'app-holidays-form',
    templateUrl: './holidays-form.component.html',
    styleUrls: [
        './holidays-form.component.scss',
        '../company-settings-form.scss',
    ],
})
export class HolidaysFormComponent extends CompanySettingsForm<IHoliday> implements OnInit {


    ngOnInit() {
        super.ngOnInit();

        this._route.queryParams.subscribe((params) => {
            this.form.controls.date.patchValue(new Date(params.year));
        });
    }

    protected createForm(): FormGroup {

        return new FormGroup({
            name: new FormControl(null, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
            date: new FormControl(new Date(this._route.snapshot.queryParams.year), [
                Validators.required,
            ]),
        } as ITypedFormGroup<IHoliday>);
    }

    getDto(): IHoliday {
        return {...super.getDto(), holidayPolicyId: +this.route.snapshot.params[PARAM_KEYS.POLICY_ID]};
    }

    apply(e?: Event) {
        this.valueChanged = true;
        super.apply(e);
    }

    protected _handleSuccessCreate() {
        super._handleSuccessCreate();
        this.valueChanged = false;
    }

    protected _handleErrorCreate(error: any) {
        super._handleErrorCreate(error);
        this.valueChanged = false;
    }

    reset() {
        if (!this.valueChanged)
        super.reset();
    }
}
