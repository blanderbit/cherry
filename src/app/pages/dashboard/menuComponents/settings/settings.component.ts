import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['../menuComponents.scss', './settings.component.scss'],
})
export class SettingsComponent {
    @Output() stateChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }
}
