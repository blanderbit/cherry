import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-trial-notification',
    templateUrl: 'trial-notification.component.html',
    styleUrls: ['trial-notification.component.scss']
})
export class TrialNotificationComponent implements OnInit {
    isOpen = true;
    expirationTime: number;
    daysRemaining: number;

    ngOnInit() {
        this.expirationTime = this._getExpirationTime();
        this.daysRemaining = this._getRemainingDays();
    }

    closeTrialPanel() {
        this.isOpen = false;
    }

    onUpgradeClick() {
        // TODO
    }

    private _getExpirationTime(): number {
        // TODO: get real expiration time when backend will be implement
        return new Date().getTime() + 1003231131; // current date + 11 days
    }

    private _getRemainingDays(): number {
       return moment(this.expirationTime).diff(moment(), 'days');
    }
}
