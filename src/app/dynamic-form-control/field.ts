import {IFieldConfig} from './components';
import {FormControl, FormGroup} from '@angular/forms';
import {Inject} from '@angular/core';
import {FormComponent} from 'components';

export interface IDynamicField {
    field: IFieldConfig;
    readonly form?: FormGroup;
}

export abstract class DynamicField<T extends IFieldConfig = IFieldConfig> implements IDynamicField {

    get error() {
        const {name} = this.field;
        const {errors = {}} = this.formComponent;

        return errors[name];
    }

    get form() {
        return this.formComponent.form;
    }

    get formControlName() {
        return this.field.name;
    }

    get title() {
        return this.field.label || this.field.name;
    }

    get placeholder() {
        return this.field.placeholder || this.title;
    }

    constructor(@Inject(FormComponent) protected formComponent: FormComponent<any>) {

    }

    field: T;
    static getFromControlTemplate(content) {
        return `
        <app-form-control [formGroup]="form" [title]="title" [error]="error">
            ${content}
        </app-form-control>
        `;
    }

    static getControls(controls) {
        if (Array.isArray(controls))
            return controls.reduce((acc, item) => ({
                ...acc,
                ...this.getControls(item)
            }), {});

        return {[controls.name]: new FormControl(controls.defaultValue, controls.validators)};
    }

    static getFormGroup(controls, options?) {
        return new FormGroup(this.getControls(controls), options);
    }
}
