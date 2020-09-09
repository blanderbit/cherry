import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['../menuComponents.scss', './search.component.scss'],
})
export class SearchComponent {
    @Output() stateChange: EventEmitter<any> = new EventEmitter();
    searched;

    constructor() {
    }
}
