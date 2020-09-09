// tslint:disable:no-bitwise

import { Component, OnInit } from '@angular/core';
import { ItemsComponent } from 'components';
import { NotificationSettingsProvider } from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { INotificationSetting, NotificationSettingKeyType, NotificationSettingIdsMap, NotificationSettingType } from './models';
import { NotifierService } from 'notifier';

@Component({
    selector: 'app-notification-settings',
    templateUrl: './notification-settings.component.html',
    styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent extends ItemsComponent<INotificationSetting> implements OnInit {
    loadDataOnParamsChange = false;
    setPaginationQueryParams = false;
    loadDataOnInit = true;

    form: FormGroup;
    taskSettingKeys: NotificationSettingKeyType[] = [
        'newTask',
        'taskCompleted',
        'taskCancelled',
        'assigmentCompleted',
        'yourAssigmentCompleted',
        'assigmentDeleted',
        'taskDeleted',
        'newComment',
        'attachmentAdded',
    ];
    projectSettingKeys: NotificationSettingKeyType[] = [
        'projectInvitation',
    ];
    private _defaultSettings: INotificationSetting[];

    constructor(protected _provider: NotificationSettingsProvider,
                protected _route: ActivatedRoute,
                protected _notifier: NotifierService,
                protected _router: Router) {
        super();
    }

    ngOnInit() {
        this._createForm();
        super.ngOnInit();
    }

    protected _handleResponse(response: INotificationSetting[]) {
        super._handleResponse(response);
        this._defaultSettings = response;
        this._setFormValues(response);
    }

    save(): void {
        const hide = this.showLoading(true);
        const settings = this._getFormValues();

        this._provider.updateItems(settings)
            .pipe(finalize(hide))
            .subscribe(() => {
                this._defaultSettings = settings;
                this.form.markAsPristine();
                this.showSuccess('action.successfully-updated');
            }, error => {
                this.showError(error, 'action.update-error');
            });
    }

    cancel(): void {
        this._setFormValues(this._defaultSettings);
        this.form.markAsPristine();
    }

    private _createForm(): void {
        const controls = Object.keys(NotificationSettingIdsMap).reduce((acc, current) => {
            return {...acc, [current]: new FormArray([new FormControl(), new FormControl()])};
        }, {});

        this.form = new FormGroup(controls);
    }

    private _setFormValues(settings: INotificationSetting[]): void {
        settings.forEach((setting) => {
            const controlName = this._getControlNameBySetting(setting);
            const controls = (this.form.controls[controlName] as FormArray).controls;
            const controlValues = this._convertSettingTypeToControlsValue(setting.value);

            controls[0].setValue(controlValues.web);
            controls[1].setValue(controlValues.email);
        });
    }

    private _getFormValues(): INotificationSetting[] {
        return Object.keys(this.form.controls)
            .reduce((acc: INotificationSetting[], controlName: string) => [...acc, ...this._getSettingsByControlName(controlName)], []);
    }

    private _getSettingsByControlName(controlName: NotificationSettingKeyType): INotificationSetting[] {
        const controls = (this.form.controls[controlName] as FormArray).controls;

        return NotificationSettingIdsMap[controlName]
            .map(id => ({id, value: this._convertControlsValueToSettingType(controls[0].value, controls[1].value)}));
    }

    private _getControlNameBySetting(setting: INotificationSetting): NotificationSettingKeyType {
        return Object.keys(NotificationSettingIdsMap).find((key) => {
            return NotificationSettingIdsMap[key].some(id => id === setting.id);
        });
    }

    private _convertControlsValueToSettingType(web: boolean, email: boolean): NotificationSettingType {
        const webIndex = Number(web) * NotificationSettingType.Web;
        const emailIndex = Number(email) * NotificationSettingType.Email;

        return webIndex | emailIndex;
    }

    private _convertSettingTypeToControlsValue(type: NotificationSettingType): {web: boolean, email: boolean} {
        switch (type) {
            case NotificationSettingType.NotSet:
                return {web: false, email: false};
            case NotificationSettingType.Web:
                return {web: true, email: false};
            case NotificationSettingType.Email:
                return {web: false, email: true};
            case NotificationSettingType.All:
                return {web: true, email: true};
        }
    }
}
