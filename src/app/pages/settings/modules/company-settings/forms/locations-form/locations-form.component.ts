import { Component, OnInit } from '@angular/core';
import { CountriesProvider, HolidaysPolicyProvider, ILocation } from 'communication';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITypedFormGroup } from '../holidays-policy-form/holidays-policy-form.component';
import { CompanySettingsForm } from '../company-settings-form.component';

@Component({
    selector: 'app-locations-form',
    templateUrl: './locations-form.component.html',
    styleUrls: [
        '../company-settings-form.scss',
        './locations-form.component.scss',
    ],
})
export class LocationsFormComponent extends CompanySettingsForm<ILocation> implements OnInit {
    public countriesProvider = CountriesProvider;
    public holidaysPolicyProvider = HolidaysPolicyProvider;

    protected createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                ],
            ),
            address: new FormControl(null, [
                    Validators.required,
                ],
            ),
            countryId: new FormControl(null, [
                    Validators.required,
                ],
            ),
            holidayPolicyId: new FormControl(null),
        } as ITypedFormGroup<ILocation>);
    }
}
