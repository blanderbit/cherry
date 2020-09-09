import { Component, Input } from '@angular/core';
import { IResendVerificationEmailData, ProfileService } from '../../identify/profile.service';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'notifier';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss', '../auth.scss']
})
export class VerifyEmailComponent {
    @Input()
    public title: string;

    constructor(
        public profile: ProfileService,
        public route: ActivatedRoute,
        private notifier: NotifierService,
    ) {
    }

    @Input()
    resendEmail() {
        const queryParams = this.route.snapshot.queryParams as IResendVerificationEmailData;

        const params: IResendVerificationEmailData =  {
            email: queryParams.email
        };

        if (queryParams.companyId) {
            params.companyId = +queryParams.companyId;
        }

        this.profile.resendVerificationEmail(params)
            .subscribe(
                () => this.notifier.showSuccess('register.email-resent'),
                (err) => this.notifier.showError(err, 'register.failed-resend-email'),
            );
    }

    resend(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.resendEmail();
    }
}
