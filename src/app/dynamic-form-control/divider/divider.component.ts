import { Component } from '@angular/core';
import { DynamicField } from '../field';
import { IInputField } from '../components';

@Component({
    selector: 'app-divider',
    template: '<hr/>',
})
export class DividerComponent extends DynamicField<IInputField> {
}
