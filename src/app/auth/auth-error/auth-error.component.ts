import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { slideInFromRightAnimation } from '../animations';

@Component({
    selector: 'app-auth-error',
    templateUrl: 'auth-error.component.html',
    styleUrls: ['auth-error.component.scss'],
    animations: [slideInFromRightAnimation]
})
export class AuthErrorComponent {

    constructor(private _location: Location) {
    }

    goBack() {
        this._location.back();
    }
}
