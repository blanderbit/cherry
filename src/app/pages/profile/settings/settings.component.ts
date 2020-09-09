import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, throwError} from 'rxjs';
import {ILang, TranslateService} from 'translate';
import {NotifierService} from 'src/app/notifier/notifier.service';
import {IProfile, ProfileService} from 'src/app/identify/profile.service';
import {FormComponent, TranslateErrorHandler} from 'components';
import {AppConfig} from '../../../app.config';
import {UploadService} from '../../../ui/cloud/cloud-upload.component';
import {ActivatedRoute} from '@angular/router';
import {catchError, finalize, map} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {IPermissionsDirectiveData, PERMISSIONS_DIRECTIVE_DATA, PermissionsService} from 'permissions';
import {LocalizationService} from '../../../localization.service';
import {acceptFile} from '../../../helpers/const/regx';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [
        {
            provide: UploadService,
            useExisting: SettingsComponent,
        },
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => SettingsComponent),
        },
    ],
})
export class SettingsComponent extends FormComponent<IProfile> implements OnInit, UploadService, IPermissionsDirectiveData {
    public autoSave = true;
    public langList$: Observable<ILang[]>;
    public langOptions$: Observable<any>;
    public currentLang: string;
    public avatar$ = this._profileProvider.avatar$;
    public loadDataOnInit = true;
    public loadDataOnParamsChange = false;
    errorHandler = new TranslateErrorHandler('validation');
    acceptFile: string[] = acceptFile;

    constructor(private _profileProvider: ProfileService,
                private _translateService: TranslateService,
                private _localizationService: LocalizationService,
                protected _notifier: NotifierService,
                protected _route: ActivatedRoute,
                private _permissionsService: PermissionsService,
                @Inject(AppConfig) private _config: AppConfig,
    ) {
        super();
    }

    get creatorId() {
        return this._profileProvider.id;
    }


    getAcronym() {
        return ProfileService.getFullName(this._profileProvider.profile).acronym();
    }

    ngOnInit() {
        super.ngOnInit();
        this.langList$ = this._translateService.getLangList();
        this.currentLang = this._translateService.language;
        this.langOptions$ = this.langList$
            .pipe(
                map(langs => {
                    return langs.map(item => ({title: item.name, value: item.code} as any));
                }),
            );

    }

    protected _getItem(): Observable<IProfile> {
        return this._profileProvider.getProfile();
    }

    protected _update(obj: IProfile): Observable<IProfile> {
        return this._profileProvider.updateProfile(obj);
    }

    protected _handleSuccessUpdate() {
        this._notifier.showSuccess('profile-settings.updateSuccess');
    }

    protected _handleErrorUpdate(error: any) {
        this._notifier.showError(error, 'profile-settings.updateFail');
    }

    public changeLang(code: string): void {
        this._localizationService.changeLang(code);
        this._notifier.showSuccess('profile-settings.language');
    }

    protected createForm(): FormGroup {
        const nameValidators = Validators.compose([
            Validators.required, Validators.minLength(3), Validators.maxLength(50),
        ]);

        return new FormGroup({
            firstName: new FormControl(null, nameValidators),
            lastName: new FormControl(null, nameValidators),
            email: new FormControl(null),
            phone: new FormControl(null),
        }, {
            updateOn: 'blur',
        });
    }

    uploadFiles(formData): Observable<any> {
        const hide = this.showLoading();

        return this._profileProvider.changeAvatar(formData)
            .pipe(
                finalize(hide),
                catchError(err => {
                    if (err instanceof HttpErrorResponse && err.status === 413) {
                        this._notifier.showError('error.file-oversize');
                    }

                    return throwError(err);
                }),
            );
    }
}

