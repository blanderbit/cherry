import { Component, OnInit } from '@angular/core';
import { CountriesProvider, IHolidaysPolicy } from 'communication';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanySettingsForm } from '../company-settings-form.component';

export type ITypedFormGroup<T = any> = {
    [key in keyof T]: FormControl;
};

@Component({
    selector: 'app-holidays-form',
    templateUrl: './holidays-policy-form.component.html',
    styleUrls: [
        './holidays-policy-form.component.scss',
        '../company-settings-form.scss'
    ]
})
export class HolidaysPolicyFormComponent extends CompanySettingsForm<IHolidaysPolicy> implements OnInit {
    public countriesProvider = CountriesProvider;

    protected createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
            countryId: new FormControl(null, [
                Validators.required
            ]),
        } as ITypedFormGroup<IHolidaysPolicy>);
    }

    loadData(id?) {
        const countryControl = this.controls.countryId;

        if (id == null) {
            countryControl.enable();
        } else {
            countryControl.disable();
        }

        super.loadData(id);
    }

    reset() {
        super.reset();
        this.controls.countryId.enable();
    }
}
