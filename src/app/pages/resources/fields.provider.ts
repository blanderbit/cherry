import { numbersFromEnum } from 'components';
import { Components } from 'dynamic-form-control';
import { HumanResourcesProvider } from 'communication';
import { Validators } from '@angular/forms';

export class FieldsProvider {

    static NameValidators = [Validators.required, Validators.minLength(3), Validators.maxLength(50)];
    static CodeValidators = [Validators.required, Validators.maxLength(30)];

    static getResponsibleControl() {
        return {
            component: Components.Autocomplete,
            provider: HumanResourcesProvider,
            placeholder: 'placeholder.responsible',
            name: 'responsible',
            formatter: ({name}) => `${name}`,
        };
    }

    static getStatusControl(statusEnum, defaultValue) {
        return {
            name: 'status',
            options: Components.translateOptions('form.status', numbersFromEnum(statusEnum)),
            defaultValue,
        };
    }

    static getAvailabilityControl() {
        return {
            component: 'availability-control',
            name: 'availability',
        };
    }

    static getNameControl() {
        return {
            name: 'name',
            component: Components.Input,
            validators: this.NameValidators,
        };
    }

    static getCodeControl() {
        return {
            name: 'code',
            component: Components.Input,
            validators: this.CodeValidators,
        };
    }
}
