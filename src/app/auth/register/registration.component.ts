import { AppConfig } from 'src/app/app.config';
import { NotifierService } from 'notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { IConfirmEmailData, ProfileService } from 'src/app/identify/profile.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateErrorHandler } from 'components';
import { loginUrl } from '../auth.routes';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ServerErrorCodes } from '../../../../projects/communication/src/lib/models/server-error-codes.enum';
import { emailValidationPattern } from '../form-validators';
import { slideInFromRightAnimation } from '../animations';
import { AuthFormComponent } from '../auth-form';
import { IErrorResponse } from '../../../../projects/communication/src/lib/models/error-response';
import { AuthService } from '../auth.service';

export interface IRegistrationInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    id: string; // just for form component
}

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['../auth.scss', './registration.component.scss'],
    animations: [slideInFromRightAnimation]
})
export class RegistrationComponent extends AuthFormComponent<IRegistrationInfo> implements OnInit {
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public errorHandler = new TranslateErrorHandler('errors');
    public loginUrl = loginUrl;
    public showVerification: boolean;

    get email() {
        return this.formValue.email;
    }

    constructor(
        private _profileService: ProfileService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
        protected _ngbModal: NgbModal,
        protected _authService: AuthService,
    ) {
        super();

        const params = this.route.snapshot.queryParams as IConfirmEmailData;
        this.showVerification = !!params.email;
    }

    protected createForm(): FormGroup {
        return new FormGroup(
            {
                email: new FormControl('', {
                    validators: [
                        Validators.required,
                        Validators.pattern(emailValidationPattern),
                    ],
                },
                ),
            }, {
            updateOn: 'submit'
        },
        );
    }

    protected _create(obj: IRegistrationInfo): Observable<any> {
        return this._profileService.createUser(obj);
    }

    apply(e: Event) {
        this.valueChanged = true;
        super.apply(e);
    }

    protected _handleErrorCreate(error: IErrorResponse) {
        const code = error.error.code;

        switch (code) {
            case ServerErrorCodes.EmailAlreadyExist:
                this._authService.showLoginDialog({ userName: this.email });
                break;
            case ServerErrorCodes.EmailIsNotConfirmed:
                this.showEmailVerification();
                break;
            case ServerErrorCodes.EmailAlreadyConfirmed:
                this.notifier.showError('Email already confirmed');
                break;
            default:
                this.redirectToErrorPage();
        }
    }

    protected _handleSuccessCreate() {
        this.showEmailVerification();
    }

    showEmailVerification() {
        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
            queryParams: {
                email: this.email,
            } as Partial<IConfirmEmailData>,
        }).then(() => this.showVerification = true);
    }
}
