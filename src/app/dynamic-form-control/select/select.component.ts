import { Component, Inject, Injector, OnInit } from '@angular/core';
import { DynamicField } from '../field';
import { ISelectField } from '../components';
import { FormComponent } from 'components';
import { NotifierService } from '../../notifier/notifier.service';

@Component({
    selector: 'dynamic-select',
    template: DynamicField.getFromControlTemplate(`
        <select [formControlName]="field.name">
            <option value="null" selected disabled>{{placeholder | translate}}</option>
            <option *ngFor="let option of field.options" [value]="option.value">{{option.title | translate}}</option>
        </select>
    `),
})
export class SelectComponent extends DynamicField<ISelectField> implements OnInit {

    constructor(@Inject(FormComponent) formComponent: FormComponent<any>,
                private _notifier: NotifierService,
                private _injector: Injector) {
        super(formComponent);
    }

    ngOnInit(): void {
        // tslint:disable-next-line:prefer-const
        let {provider, formatter = (i) => i} = this.field;

        if (typeof provider === 'function')
            provider = this._injector.get(provider as any);

        if (provider) {
            provider.getItems().subscribe(
                (items) => this.field.options = Array.isArray(items) ? items.map(formatter) : [],
                (error) => this._notifier.showError(error, 'Can\'t load options'),
            );
        }
    }
}
