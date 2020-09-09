import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from 'translate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'notifier';
import { FormComponent } from 'components';
import { HumanResourcesProvider, IHumanResource } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { MustMatch } from '../../../auth/form-validators';
import { userFormErrorMessages } from './errorMessage';
import { environment } from 'environment';

interface IUserFormRouteParams {
    id?: number;
}

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent extends FormComponent<IHumanResource> implements OnInit {
    public autoSave = false;
    public loadDataOnParamsChange = false;
    public loadDataOnInit = true;
    public errorMessages = userFormErrorMessages;
    public roles$ = this._provider.getRoles()
        .pipe(
            catchError(() => []),
        );

    get resourceId() {
        return this.routeParams.id;
    }

    get routeParams(): IUserFormRouteParams {
        return this._route.snapshot.params;
    }

    constructor(private _translateService: TranslateService,
                protected _provider: HumanResourcesProvider,
                private _fb: FormBuilder,
                protected _route: ActivatedRoute,
                protected _notifier: NotifierService,
                protected _router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.disableFieldsOnEdit();
    }

    submit(event) {
        event.preventDefault();
        this.apply();
    }

    disableFieldsOnEdit() {
        const editFields = ['firstName', 'lastName'];

        if (this.resourceId) {

            for (const key in this.controls) {
                if (!editFields.includes(key)) {
                    this.controls[key].disable({onlySelf: true});
                }
            }
        }
    }

    protected createForm(): FormGroup {
        const sharedLengthValidators = Validators.compose([
            Validators.required, Validators.minLength(3), Validators.maxLength(50),
        ]);
        const passwordValidators = Validators.compose([
            Validators.required, Validators.minLength(6), Validators.maxLength(50),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{6,}$/),
        ]);

        // TODO: Remove
        if (!environment.production) {
            const user: any = getFakeUser();

            setTimeout(() => this.setForm({
                ...user,
                password: user.email,
                confirmNewPassword: user.email,
            }));
        }

        return this._fb.group({
                email: [null,
                    [Validators.required, Validators.email]],
                userName: [null,
                    [Validators.required, sharedLengthValidators]],
                firstName: [null,
                    [Validators.required, sharedLengthValidators]],
                lastName: [null,
                    [Validators.required, sharedLengthValidators]],
                password: [null, [passwordValidators]],
                confirmNewPassword: [null, [Validators.required]],
                role: [null, [Validators.required]],
            },
            {
                updateOn: 'submit',
                validators: [MustMatch('password', 'confirmNewPassword')],
            },
        );
    }

    protected _handleSuccessCreate() {
        // TODO: SWAP
        // super._handleSuccessCreate();
        this._router.navigate(['/settings/users']);
        this._notifier.showSuccess('user.createSuccess');
    }

    protected _handleSuccessUpdate() {
        // super._handleSuccessUpdate();
        this._notifier.showSuccess('user.updateSuccess');
        this._router.navigate(['/settings/users']);
    }

    protected _handleErrorCreate(error: any) {
        this._checkErrorCode(error);
        this._notifier.showError('user.createFail');
    }

    protected _handleErrorUpdate(error: any) {
        this._checkErrorCode(error);
        this._notifier.showError('user.updateFail');
    }

    public changeLang(code: string): void {
        this._translateService.changeLang(code);
        this._notifier.showSuccess('profile-settings.language');
    }

    protected _getItem(): Observable<IHumanResource> {
        const id = this._route.snapshot.params['id'];

        return id ? super._getItem(id) : of(null);
    }

    protected _checkErrorCode(error: any) {
        if (error.status === 403) {
            return this._notifier.showError('action.permission');
        } else if (error.status === 400 && error.error.code === 1008) {
            return this._notifier.showError('action.existing');
        } else if (error.status === 400 && error.error.code === 1007) {
            return this._notifier.showError('action.existingEmail');
        } else return error;
    }
}


export function getFakeUser(id = Math.round(Math.random() * 1000)) {
    return {
        id,
        code: id.toString(),
        name: 'name',
        resourceId: id,
        userName: `username${id}`,
        firstName: `First Name ${id}`,
        lastName: `Last Name ${id}`,
        email: `Email${id}@test.com`,
        phone: id.toString(),
        responsible: 1,
        // age: this._generateDate(new Date(1950, 0, 1), new Date(2002, 0, 1)),
    };
}
