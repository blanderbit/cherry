import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SpinnerService {
    show = false;
    _showSpinner = new Subject();

    constructor() {
    }

    toggleSpinnerState(show: boolean): void {
        this.show = show;
        this._showSpinner.next(this.show);
    }
}
