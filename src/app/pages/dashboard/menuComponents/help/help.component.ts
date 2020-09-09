import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['../menuComponents.scss', './help.component.scss'],
})
export class HelpComponent {
    @Output() stateChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

}
