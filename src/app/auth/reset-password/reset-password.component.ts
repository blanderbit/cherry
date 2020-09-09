import { Component, OnInit } from '@angular/core';
import { TranslateErrorHandler } from 'components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IResetPasswordData, ProfileService } from '../../identify/profile.service';
import { Observable, of, throwError } from 'rxjs';
import { MustMatch, passwordValidationPattern } from '../form-validators';
import { NotifierService } from 'notifier';
import { AuthComponent } from '../auth.component';
import { slideInFromRightAnimation } from '../animations';
import { AuthFormComponent } from '../auth-form';
import { catchError, finalize } from 'rxjs/operators';
import { ServerErrorCodes } from '../../../../projects/communication/src/lib/models/server-error-codes.enum';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-reset-password',
    templateUrl: 'reset-password.component.html',
    styleUrls: ['reset-password.component.scss', '../auth.scss'],
    animations: [slideInFromRightAnimation],
})
export class ResetPasswordComponent extends AuthFormComponent<IResetPasswordData> implements OnInit {
    public loadDataOnParamsChange = false;
    public isUpdated = false;
    public showExpiredError = false;
    public errorHandler = new TranslateErrorHandler('errors');
    public initialized = false;

    get email() {
        return (this.route.snapshot.queryParams as Partial<IResetPasswordData>).email;
    }

    get queryParams() {
        return this._route.snapshot.queryParams as Partial<IResetPasswordData>;
    }

    constructor(private formBuilder: FormBuilder,
                protected _route: ActivatedRoute,
                protected _router: Router,
                protected _notifier: NotifierService,
                protected profileService: ProfileService,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this._checkToken();
    }

    protected _create(obj: IResetPasswordData): Observable<any> {

        return this.profileService.resetPassword({
            password: obj.password,
            confirmPassword: obj.confirmPassword,
            resetToken: AuthComponent.normalizeToken(this.queryParams.resetToken),
            email: this.queryParams.email,
        }).pipe(
            catchError((error) => this._catchExpiredTokenError(error)),
        );
    }

    protected createForm(): FormGroup {
        return this.formBuilder.group({
            password: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(50),
                    Validators.pattern(passwordValidationPattern),
                ],
                updateOn: 'submit',
            }),
            confirmPassword: new FormControl(null, {
                updateOn: 'submit',
            }),
        }, {
            validator: MustMatch('password', 'confirmPassword'),
        });
    }

    apply(e?) {
        this.valueChanged = true;
        super.apply(e);
    }

    protected _handleErrorCreate(error: any) {
        this.redirectToErrorPage();
    }

    protected _handleSuccessCreate(response) {
        this.isUpdated = true;
    }

    private _checkToken(): void {
        this.profileService.resetPasswordValidation({
            token: this.queryParams.resetToken,
            email: this.email,
        })
            .pipe(
                catchError((error) => this._catchExpiredTokenError(error)),
                finalize(() => this.initialized = true),
            )
            .subscribe({
                next: null,
                error: () => this.redirectToErrorPage()
            });
    }

    resendInstructions() {
        const hide = this.showLoading();

        this.profileService.forgotPassword({
            email: this.email,
        })
            .pipe(finalize(hide))
            .subscribe(
                () => this.showSuccess('Forgot password link has been resent'),
                (error) => this.showError(error, 'Failed to resend password link'),
            );
    }

    private _catchExpiredTokenError(error: HttpErrorResponse): Observable<never | any> {
        const errorCode = error.error.code as number;

        if (errorCode === ServerErrorCodes.ResetPasswordTokenExpired) {
            this.showExpiredError = true;
            return of(null);
        }

        return throwError(error);
    }
}
