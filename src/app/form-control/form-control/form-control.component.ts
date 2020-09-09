import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-form-control',
    templateUrl: './form-control.component.html',
    styleUrls: ['./form-control.component.scss'],
})
export class FormControlComponent {
    @Input() title: string;
    @Input() titleSize = 13;
    @Input() error: string = '';
    @Input() hideError = false;
    @Input() hideTitle = false;
}
