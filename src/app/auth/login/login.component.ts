import { ILoginData, ProfileService } from './../../identify/profile.service';
import { ICompany } from './../../../../projects/communication/src/lib/models/companies';
import { flatMap, switchMap, tap } from 'rxjs/operators';
import { NotifierService } from './../../notifier/notifier.service';
import { HumanResourcesProvider } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateErrorHandler } from 'components';
import { AuthRoutes, forgotPasswordUrl, signUpUrl, createCompanyUrl, selectCompanyUrl } from '../auth.routes';
import { emailValidationPattern, passwordValidationPattern } from '../form-validators';
import { slideInFromLeftAnimation } from '../animations';
import { ServerErrorCodes } from '../../../../projects/communication/src/lib/models/server-error-codes.enum';
import { AuthFormComponent } from '../auth-form';
import { DashboardRoutes } from 'src/app/pages/dashboard/dashboard.routes';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../auth.scss', './login.component.scss'],
    animations: [slideInFromLeftAnimation],
})
export class LoginComponent extends AuthFormComponent<ILoginData> implements OnInit {
    public autoSave = false;
    public loadDataOnParamsChange = false;
    public loadDataOnInit = false;
    public forgotPasswordUrl = forgotPasswordUrl;
    public signUpUrl = signUpUrl;
    public errorHandler = new TranslateErrorHandler('errors');
    public companies: ICompany[];

    get isCompanyMember(): boolean {
        return this.companies && this.companies.length === 1;
    }

    get isCompaniesMember() {
        return this.companies && this.companies.length > 1;
    }

    constructor(
        private _profileService: ProfileService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _provider: HumanResourcesProvider,
        protected _notifier: NotifierService,
    ) {
        super();
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.pattern(emailValidationPattern),
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(50),
                Validators.pattern(passwordValidationPattern),
            ]),
        }, {
            updateOn: 'submit',
        });
    }

    protected _create(obj: ILoginData): Observable<any> {
        return this._profileService.login(obj)
            .pipe(
                switchMap((res) => this._profileService.getMyCompanies().pipe(
                    tap((companies: ICompany[]) => this.companies = companies),
                    flatMap(companies => {
                        if (this.isCompanyMember) {
                            const companyId = companies[0].id;
                            return this._profileService.selectCompany(companyId, true, false);
                        }

                        this.router.navigate([this.getRedirectUrl(companies)]);
                    })
                )),
            );
    }

    getRedirectUrl(companies: ICompany[]): string {
        const count = (companies || []).length;

        switch (count) {
            case 0:
                return createCompanyUrl;
            case 1:
                return `/${DashboardRoutes.HOME}`;
            default:
                return selectCompanyUrl;
        }
    }

    apply(e?: Event) {
        this.valueChanged = true;
        super.apply();
    }

    protected _handleErrorCreate(error) {
        if (error.error.code === ServerErrorCodes.TooManyLoginAttempts) {
            this.notifier.showError(error, 'Too many login attempts. Try again in 5 minutes');
        } else {
            this.notifier.showError('login.invalid');
        }
    }

    getDto(): ILoginData {
        const { email, password } = this.formValue;

        return {
            userName: email,
            password,
        } as ILoginData;
    }

    protected _handleSuccessCreate() {
        if (!this.isCompanyMember) {
            const route = this.isCompaniesMember ? AuthRoutes.SelectCompany : AuthRoutes.CreateAccount;
            this.authNavigate(route);
        }
    }

    // TODO: Handle redirect url
    // const queryParams = this.route.snapshot.queryParams as IConfirmEmailData;
    // if (queryParams.email) {
    //     this.router.navigate(['/', AuthRoutes.Auth, AuthRoutes.SelectCompany]).then();
    // } else {
    //     const redirect = this.route.snapshot.queryParamMap.get('redirect'),
    //         config = this._communicationConfig,
    //         authentication = config && config.authentication,
    //         url = redirect || (authentication && authentication.redirect);
    //
    //     if (url) window.location.replace(url);
    //     else this.notifier.showError('Please provide valid redirect URL');
    // }
}

