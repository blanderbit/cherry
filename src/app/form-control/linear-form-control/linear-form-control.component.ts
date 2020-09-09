import { Component } from '@angular/core';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
    selector: 'linear-form-control',
    templateUrl: './linear-form-control.component.html',
    styleUrls: ['./linear-form-control.component.scss'],
})
export class LinearFormControlComponent extends FormControlComponent {
    hideError = true;
}
