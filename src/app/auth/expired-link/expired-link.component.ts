import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slideInFromRightAnimation } from '../animations';

@Component({
    selector: 'app-expired-link',
    templateUrl: 'expired-link.component.html',
    styleUrls: ['expired-link.component.scss', '../auth.scss'],
    animations: [slideInFromRightAnimation],
})
export class ExpiredLinkComponent {
    @Input() loading = false;
    @Input() buttonText = 'Resend Instructions';
    @Output() onResend = new EventEmitter<Event>();
}
