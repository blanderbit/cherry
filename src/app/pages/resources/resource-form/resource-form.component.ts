import { Component, forwardRef, Inject, OnInit, Optional, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent, TranslateErrorHandler } from 'components';
import {
    AnyResource,
    HumanResourcesProvider, HumanResourceStatus,
    IHumanResource,
    Provider,
    ResourceKind,
    ResourcesProvider,
} from 'communication';
import { NotifierService } from 'notifier';
import { FormGroup } from '@angular/forms';
import { isPlatformBrowser, Location } from '@angular/common';
import { FieldsProvider } from '../fields.provider';
import { DynamicField, IFieldConfig, ISelectField } from 'dynamic-form-control';
import { FormOptions } from '../form.options';
import { FormHandler } from '../form.handler';
import { Observable } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { IResourceFormConfig } from '../resources.sub-module';
import { ProfileService } from '../../../identify/profile.service';
import { ResourcesPermissions } from '../resources.module';
import { IResourcesPermissions } from '../resources/resources.component';
import { resourceFormConfig } from '../token';
import { AccessSettingComponent } from '../access-setting/access-setting.component';
import { acceptFile } from '../../../helpers/const/regx';
import { ITypedFormGroup } from '../../settings/modules/company-settings/forms/holidays-form/holidays-form.component';

@Component({
    selector: 'app-resource-form',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.scss'],
    providers: [
        {
            provide: FormComponent,
            useExisting: forwardRef(() => ResourceFormComponent),
        },
    ],
})
export class ResourceFormComponent extends FormComponent<AnyResource> implements OnInit {
    formControls = [];
    loadDataOnInit = false;
    loadDataOnParamsChange = true;
    ResourceStatuses = [];

    reader;
    imagePreview: any;
    file;

    errorHandler = new TranslateErrorHandler('form.errors');

    canUpload = true;

    acceptFile: string[] = acceptFile;

    @ViewChild(AccessSettingComponent, { static: false }) accessComponent?: AccessSettingComponent;

    get canRemove() {
        return !this.needCreate && this.item.kind !== ResourceKind.Human;
    }

    isStatusReadonly = false;

    get showAccess(): boolean {
        return this.config && this.config.showApplicationsAccess && !this.initializing;
    }

    get avatarUpdateDisabled() {
        return this.config && this.config.disableAvatarUpdate;
    }

    get userNameUpdateDisabled() {
        return this.config && this.config.disableUserNameUpdate;
    }

    get resourceKind(): string {
        return this.config && ResourceKind[this.config.resourceKind];
    }

    constructor(protected _route: ActivatedRoute,
        protected _provider: Provider,
        protected _router: Router,
        protected _notifier: NotifierService,
        protected _location: Location,
        protected _resourcesProvider: ResourcesProvider,
        protected _profile: ProfileService,
        @Optional() protected _formHandler: FormHandler,
        @Inject(PLATFORM_ID) protected _platformId: string,
        @Optional() protected _formOptions: FormOptions,
        @Inject(FieldsProvider) protected _fields: IFieldConfig[],
        @Optional() @Inject(resourceFormConfig) public config: IResourceFormConfig,
        @Optional() @Inject(ResourcesPermissions) public permissions: IResourcesPermissions) {
        super();

        const status: ISelectField = _fields.find(isStatusField) as ISelectField;

        this.formControls = _fields.filter(f => f !== status);
        this.ResourceStatuses = status.options;
    }

    ngOnInit() {
        super.ngOnInit();
        if (this._formHandler)
            this._formHandler.handleComponentInit(this);

        if (isPlatformBrowser(this._platformId)) {
            this.reader = new FileReader();
            this.reader.onload = (e: any) => this.imagePreview = e.target.result;
        }
    }

    protected _getItem(params?: any): Observable<AnyResource> {
        if (params && params.id) {
            return super._getItem(params.id);
        }

        return of(null);
    }

    protected handleItem(item: AnyResource): void {
        super.handleItem(item);

        const { statusEditableOnCreate = true, statusEditableOnUpdate = true } = this.config;

        if ((this.needCreate && !statusEditableOnCreate) || (!this.needCreate && !statusEditableOnUpdate)) {
            this.controls.status.disable({ emitEvent: false });
        }

        if (!this.needCreate && this.userNameUpdateDisabled) {
            const isCurrentUser = item.id === this._profile.profile.resourceId;

            if (!isCurrentUser) {
                this.controls.firstName.disable({ emitEvent: false });
                this.controls.lastName.disable({ emitEvent: false });
                this.controls.email.disable({ emitEvent: false });
                (this.controls as ITypedFormGroup<IHumanResource>).phone.disable({ emitEvent: false });
            }
        }
    }

    handleFileChanged([file] = [null]) {
        if (!file)
            return;

        this.file = file;
        this.reader.readAsDataURL(file);

        if (!this.needCreate) {
            this.uploadPhoto(this.item).subscribe(
                () => {
                    const userPhotoChanged = this.item && this.item.id === this._profile.resourceId;
                    this.item = { ...this.item };

                    if (userPhotoChanged) {
                        this._profile.onAvatarChanged();
                    }
                },
                e => this._notifier.showError(e, 'action.photo-error-updated'),
            );
        }
    }

    createForm(): FormGroup {
        return DynamicField.getFormGroup(this._fields, this._formOptions);
    }

    protected setForm(item: AnyResource, emitEvent) {
        super.setForm(item, emitEvent);

        if (this._formHandler)
            this._formHandler.handleFormInit(this);
    }

    protected _create(obj: AnyResource): Observable<AnyResource> {
        return super._create(obj).pipe(mergeMap(i => this.uploadPhoto(i)));
    }

    uploadPhoto(resource): Observable<AnyResource> {
        if (this.file) {
            return this._resourcesProvider.uploadPhoto(resource.id, this.file, false).pipe(
                tap(() => this._notifier.showSuccess('action.photo-successfully-updated')),
            );
        }

        return of(resource);
    }

    protected _update(obj: AnyResource): Observable<any> {
        return this._updateStatus(obj).pipe(
            switchMap(() => this.provider.updateItem(obj))
        );
    }

    private _updateStatus(obj: AnyResource): Observable<any> {
        const needUpdateStatus = obj.status !== this.item.status && this.config.resourceKind === ResourceKind.Human;

        return needUpdateStatus ? (this._provider as HumanResourcesProvider).updateStatus({
            id: obj.id,
            status: obj.status as HumanResourceStatus,
        }) : of(null);
    }

    protected _handleSuccessCreate(response?) {
        super._handleSuccessCreate(response);
        this._navigateOnSuccessAction();
    }

    cancel() {
        this._navigateOnSuccessAction();
    }

    getDto(): AnyResource {
        const obj = super.getDto();
        const apps = obj && (obj as IHumanResource).apps as unknown as { [key: string]: boolean };

        return {
            ...obj,
            apps: Object.keys(apps || {}).filter(app => apps[app])
        } as AnyResource;
    }

    protected _navigateOnSuccessAction(item?: null) {
        this._router.navigate(['../'], {
            relativeTo: this._route,
        });
    }
}

function isStatusField({ name }) {
    return name === 'status';
}
