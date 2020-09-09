import { Component } from '@angular/core';
import { DynamicField } from '../field';
import { IFieldConfig } from '../components';

@Component({
    selector: 'row-component',
    template: `
        <dynamic-form [controls]="controls" [form]="form"></dynamic-form>`,
    styles: [
            `
            dynamic-form {
                display: flex;
                flex-direction: row;
            }

            ::ng-deep dynamic-form > * {
                flex-grow: 1;
                width: 100%;
            }
            
            ::ng-deep dynamic-form > *:not(:first-child) {
                margin-left: 5px;
            }
        `
    ]
})
export class RowComponent extends DynamicField<IFieldConfig> {
    get controls(): IFieldConfig[] {
        return this.field as any;
    }
}
