import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanySettingsForm } from '../company-settings-form.component';
import { CurrencyProvider } from '../../../../../../../../projects/communication/src/lib/services/common/currency.provider';
import { IResourceType } from '../../../../../../../../projects/communication/src/lib/models/resource-type';

export type ITypedFormGroup<T = any> = {
    [key in keyof T]: FormControl;
};

@Component({
    selector: 'app-resource-type-form',
    templateUrl: './resource-type-form.component.html',
    styleUrls: [
        '../company-settings-form.scss',
        './resource-type-form.component.scss'
    ]
})
export class ResourceTypeFormComponent extends CompanySettingsForm<IResourceType> implements OnInit {
    public currencyProvider = CurrencyProvider;

    protected createForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ]),
            rate: new FormControl(null, [
                Validators.required,
                Validators.min(0),
                Validators.max(999999),
            ]),
            currency: new FormControl(null, [
                Validators.required
            ]),
        } as ITypedFormGroup<IResourceType>);
    }
}
