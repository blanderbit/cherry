import { Component, Input } from '@angular/core';

@Component({
    selector: 'icon-form-control',
    templateUrl: './icon-form-control.component.html',
    styleUrls: ['./icon-form-control.component.scss'],
})
export class IconFormControlComponent {
    @Input()
    icon = 'date';

}

