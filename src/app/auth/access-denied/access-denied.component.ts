import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.scss', '../auth.scss']
})
export class AccessDeniedComponent {
    constructor(private location: Location) {
    }

    goBack(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.location.back();
    }
}
