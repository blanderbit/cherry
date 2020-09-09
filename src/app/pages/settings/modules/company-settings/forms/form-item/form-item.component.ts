import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-form-item',
    templateUrl: './form-item.component.html',
    styleUrls: [
        './form-item.component.scss',
        '../company-settings-form.scss'
    ]
})
export class FormItemComponent {
    @Input() label: string;
}
