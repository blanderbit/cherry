import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateErrorHandler } from 'components';
import { NotifierService } from 'notifier';
import { Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { ICompanyIdProvider } from '../../../../projects/communication/src/lib/models/companies';
import { IErrorReponseData, IErrorResponse } from '../../../../projects/communication/src/lib/models/error-response';
import { ServerErrorCodes } from '../../../../projects/communication/src/lib/models/server-error-codes.enum';
import { IConfirmEmailData, IResendVerificationEmailData, IUpdateUserData, ProfileService } from '../../identify/profile.service';
import { ITypedFormGroup } from '../../pages/settings/modules/company-settings/forms/holidays-form/holidays-form.component';
import { AuthFormComponent } from '../auth-form';
import { AuthComponent } from '../auth.component';
import { createCompanyUrl, loginUrl, privacyPolicyUrl, termsOfUseUrl } from '../auth.routes';
import { AuthService } from '../auth.service';
import { ICreateAccountResolverData } from '../create-account.resolver';
import { MustMatch, passwordValidationPattern } from '../form-validators';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ICompany } from './../../../../projects/communication/src/lib/models/companies';

export type ICreateAccountQueryParams = IConfirmEmailData & ICompanyIdProvider;

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss', '../auth.scss'],
})
export class CreateAccountComponent extends AuthFormComponent<IUpdateUserData> implements OnInit {
    public loginUrl = loginUrl;
    public termsOfUseUrl = termsOfUseUrl;
    public privacyPolicyUrl = privacyPolicyUrl;
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    errorHandler = new TranslateErrorHandler('errors');
    checkStatus = true;
    showExpiredError = false;
    showVerifyEmail = false;
    queryParams: ICreateAccountQueryParams;
    showLoader = false;
    companies: ICompany[];

    get email(): string {
        return this.queryParams && this.queryParams.email;
    }

    get companyId(): number {
        return this.queryParams && +this.queryParams.companyId;
    }

    constructor(private _formBuilder: FormBuilder,
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _profile: ProfileService,
        protected _notifier: NotifierService,
        protected _ngbModal: NgbModal,
        protected _authService: AuthService,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        const queryParams = this.route.snapshot.queryParams as ICreateAccountQueryParams;

        this.queryParams = queryParams;
        this.queryParams = {
            ...queryParams,
            token: AuthComponent.normalizeToken(queryParams.token),
        };

        const emailVerificationsError = this.route.snapshot.data as ICreateAccountResolverData;

        if (emailVerificationsError && emailVerificationsError.data && emailVerificationsError.data.code) {
            this.handleConfirmEmailError(emailVerificationsError.data);
        }

    }

    handleConfirmEmailError(error: IErrorReponseData) {
        const code = error && error.code;

        if (code === ServerErrorCodes.EmailVerificationTokenExpired) {
            this.showExpiredError = true;
        } else {
            this.redirectToErrorPage();
        }
    }

    protected _create(obj: IUpdateUserData): Observable<IUpdateUserData> {
        return this._profile.updateUser(obj);
    }

    createForm(): FormGroup {
        const controlOptions: AbstractControlOptions = {
            validators: Validators.compose([
                Validators.required, Validators.minLength(3), Validators.maxLength(50),
            ]),
            updateOn: 'submit',
        };

        return this._formBuilder.group({
            firstName: new FormControl(null, controlOptions),
            lastName: new FormControl(null, controlOptions),
            password: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(passwordValidationPattern),
                ],
                updateOn: 'submit',
            }),
            confirmPassword: new FormControl(null, {
                updateOn: 'submit',
            }),
            subscribedToNewsletter: new FormControl(false, {
                updateOn: 'submit',
            }),
            isTermOfUseAndPrivacyPolicyAccepted: new FormControl(false, {
                validators: [Validators.requiredTrue],
                updateOn: 'submit',
            }),
        } as ITypedFormGroup<IUpdateUserData>, {
            validator: MustMatch('password', 'confirmPassword'),
        });
    }

    getDto(): IUpdateUserData {
        const { email, companyId = null } = this.queryParams;

        const dto = {
            email,
            ...super.getDto(),
        };

        if (companyId && !isNaN(+companyId)) {
            dto.companyId = +companyId;
        }

        return dto;
    }

    apply(e?: Event) {
        this.valueChanged = true;
        super.apply(e);
    }

    protected _handleSuccessCreate() {
        const hide = this.showLoading();

        if (this.companyId) {
            this.minLoadingTime = 500;
            this.showLoader = true;
        }

        this._profile.login({
            userName: this.email,
            password: this.formValue.password,
        }).pipe(
            switchMap(() => this._profile.getMyCompanies()),
            finalize(hide)
        ).subscribe(
            (companies: ICompany[]) => {
                const oneCompanyMember = companies && companies.length === 1;
                const companyId = this.companyId || oneCompanyMember && companies[0].id;

                if (companyId) {
                    this._profile.selectCompany(companyId).subscribe();
                } else {
                    this.router.navigate([createCompanyUrl]);
                }
            });
    }

    protected _handleErrorCreate(err: IErrorResponse) {
        const code = err.error.code;

        switch (code) {
            case ServerErrorCodes.EmailIsNotConfirmed:
                this.showVerifyEmail = true;
                break;
            case ServerErrorCodes.PasswordIsAlreadySet:
                const ref = this._ngbModal.open(LoginDialogComponent, {
                    windowClass: 'login-dialog',
                });

                (ref.componentInstance as LoginDialogComponent).email = this.email;
                break;
            case ServerErrorCodes.UserDoesNotBelognToRequestedCompany:
            case ServerErrorCodes.UserInitationHasBeenCanceled:
                this._authService.redirectToAccessDeniedPage();
                break;
            default:
                this.redirectToErrorPage();
        }
    }

    resendInstructions() {
        const hide = this.showLoading();

        const params: IResendVerificationEmailData = {
            email: this.email
        };

        if (this.companyId) {
            params.companyId = this.companyId;
        }

        this._profile.resendVerificationEmail(params)
            .pipe(finalize(hide))
            .subscribe(
                () => this._handleSuccessResend(),
                (error) => this._handleErrorResend(error),
            );
    }


    private _handleSuccessResend() {
        const message = this.companyId ? 'register.invitation-link-resent' : 'register.email-resent';
        this.showSuccess(message);
    }

    private _handleErrorResend(error) {
        const message = this.companyId ? 'register.failed-resend-invitation-link' : 'register.failed-resend-email';
        this.showError(error, message);
    }
}
