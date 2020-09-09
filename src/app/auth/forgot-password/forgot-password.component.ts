import { AppConfig } from 'src/app/app.config';
import { NotifierService } from 'notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateErrorHandler } from 'components';
import { ProfileService } from '../../identify/profile.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { emailValidationPattern } from '../form-validators';
import { loginUrl } from '../auth.routes';
import { slideInFromRightAnimation } from '../animations';
import { AuthFormComponent } from '../auth-form';

export interface IForgotPasswordInfo {
    email: string;
    id: string; // just for form component
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['../auth.scss', './forgot-password.component.scss'],
    animations: [slideInFromRightAnimation]
})
export class ForgotPasswordComponent extends AuthFormComponent<IForgotPasswordInfo> {
    public loadDataOnParamsChange = false;
    public errorHandler = new TranslateErrorHandler('errors');
    public loginUrl = loginUrl;
    isEmailSent = false;

    constructor(
        private formBuilder: FormBuilder,
        private _authService: ProfileService,
        protected _profile: ProfileService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
        @Inject(AppConfig) private _communicationConfig: AppConfig,
    ) {
        super();
    }

    protected createForm(): FormGroup {
        return this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(emailValidationPattern)]],
        }, {
            updateOn: 'submit'
        });
    }

    protected _create(obj: IForgotPasswordInfo): Observable<any> {
        return this._authService.forgotPassword(obj).pipe(
            tap(() => this.isEmailSent = true),
        );
    }

    protected _handleErrorCreate(error: any) {
        this.redirectToErrorPage();
    }

    protected _handleSuccessCreate(response?) {
        this.isEmailSent = true;
    }

    resendEmail() {
        this._profile.forgotPassword({
            email: this.formValue.email,
        }).subscribe(() => this.notifier.showSuccess('Verification email sent'));
    }
}
