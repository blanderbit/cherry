import { Provider } from 'communication';
import { Validators } from '@angular/forms';

function translate(suffix, prefix) {
    return prefix != null ? `${suffix}.${prefix}` : undefined;
}

function translateFn(suffix) {
    return (prefix) => translate(suffix, prefix);
}

function translateField(suffix, field) {
    const {
        name,
        placeholder,
        label,
        ...other
    } = field;

    return {
        name,
        ...other,
        placeholder: translate(suffix, placeholder),
        label: label ? translate(suffix, label) : translate(suffix, name),
    };
}

export class Components {
    static Input = 'input';
    static Select = 'select';
    static Autocomplete = 'autocomplete';
    static Row = 'row';
    static Divider = 'divider';

    static translates = {
        [Components.Select]: (suffix, {options, ...field}: ISelectField) => ({
            ...translateField(suffix, field),
            options: Components.translateOptions(`${suffix}.${field.name}`, options)
        })
    };

    static translateOptions(suffix, options) {
        return options && options.map(value => ({
            value,
            title: translate(`${suffix}Options`, value)
        }));
    }

    static input(name, type?) {
        return this._getField(this.Input, name, type);
    }

    static select(name, type?) {
        return this._getField(this.Input, name, type);
    }

    static divider() {
        return {
            component: this.Divider,
        };
    }

    private static _getField(component, name, type?): IFieldConfig {
        return {component, name, type};
    }

    static translate(suffix, fields: IFieldConfig | IFieldConfig[] | any): IFieldConfig[] {
        if (Array.isArray(fields))
            return fields.map(value => this.translate(suffix, value)) as any;

        const {component} = fields;

        const fn = this.translates[component] || translateField;
        return fn(suffix, fields as any);
    }
}

export type IFieldConfig = IBaseFieldConfig | IInputField | ISelectField | IAutocompleteField<any>;

export interface IBaseFieldConfig {
    name: string;
    component?: string;
    placeholder?: string;
    label?: string;
}

export interface IValidatedField {
    validators?: Validators[];
}

export interface IInputField extends IBaseFieldConfig, IValidatedField {
    component: 'input';
    type?: string;
}

export interface IRowComponent extends IBaseFieldConfig, IValidatedField {
    component: 'row';
}

export interface IAutocompleteField<T> extends IBaseFieldConfig, IValidatedField {
    component: 'autocomplete';
    provider: Provider | any;
    formatter?: (item: T) => string;
    paramsFormatter?: (params: any) => any;
}

export interface ISelectField extends IBaseFieldConfig, IValidatedField {
    component: 'select';
    provider: Provider;
    formatter?: (item: any) => { value: string, title: string };
    options?: string[];
}
