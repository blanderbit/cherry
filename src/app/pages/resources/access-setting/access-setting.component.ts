import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { AppPermissionsAction, AppPermissionsProvider, IHumanResource, IRole, SystemRolesProvider } from 'communication';
import { ItemsComponent } from 'components';
import { IAppPermission } from '../../../../../projects/communication/src/lib/services/http/http.app-permissions.provider';
import { CheckboxComponent } from '../../../ui/checkbox/checkbox.component';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


type HumanResourceFiled = keyof IHumanResource;

const APPS_CONTROL: HumanResourceFiled = 'apps';
const ROLE_CONTROL: HumanResourceFiled = 'systemRoleId';

@Component({
    selector: 'app-access-setting',
    templateUrl: './access-setting.component.html',
    styleUrls: ['./access-setting.component.scss'],
})
export class AccessSettingComponent extends ItemsComponent<IAppPermission> {
    private _humanResource: IHumanResource;
    public loadDataOnInit = true;
    public loadDataOnParamsChange = false;
    public defaultRole: IRole;

    @ViewChildren('apps', {read: CheckboxComponent})
    public checkboxes: QueryList<CheckboxComponent>;

    @Input()
    public set humanResource(value: IHumanResource) {
        this._humanResource = value;
    }

    public get humanResource() {
        return this._humanResource;
    }

    @Input()
    public form: FormGroup;

    public roles$ = this.rolesProvider.getItems()
        .pipe(
            catchError(() => of([])),
            tap(roles => this.defaultRole = SystemRolesProvider.getDefaultRole(roles)),
            tap(() => this.setUpRoleControl()),
            tap(() =>  this._resetAccessIfNoRole()),
            map(SystemRolesProvider.excludeDefaultRole),
        );

    get systemRoleId(): number {
        return (this.humanResource && this.humanResource.systemRoleId) || (this.defaultRole && this.defaultRole.id);
    }

    set systemRoleId(value: number) {
        this.humanResource = {...this.humanResource, systemRoleId: value};
    }

    get appsFormGroup() {
        return (this.form && this.form.controls as {apps: FormGroup}).apps;
    }

    get appFormControls() {
        return this.appsFormGroup && this.appsFormGroup.controls;
    }

    get systemRoleIdControl(): FormControl {
        return this.form.get(ROLE_CONTROL) as FormControl;
    }

    constructor(
        public _provider: AppPermissionsProvider,
        public rolesProvider: SystemRolesProvider,
        public route: ActivatedRoute,
        public router: Router,
    ) {
        super();
    }

    setUpAppsControl() {
        const addControl: boolean = this.form && !this.form.get(APPS_CONTROL);

        if (addControl) {
            this.form.addControl(APPS_CONTROL, this.getAppsControl());
        }
    }

    setUpRoleControl() {
        const addControl: boolean = this.form && !this.form.get(ROLE_CONTROL);

        if (addControl) {
            this.form.addControl(ROLE_CONTROL, this.getSystemRoleIdControl());
        }
    }


    protected _handleResponse(response: IAppPermission[]) {
        super._handleResponse(response);
        this.setUpAppsControl();
    }

    public onCheckboxCheck(value: IRole) {
        const id = value.id === this.systemRoleId ? this.defaultRole && this.defaultRole.id : value.id;

        this.systemRoleId = id;
        this.systemRoleIdControl.setValue(id);
        this._resetAccessIfNoRole();
    }

    private getAppsControl() {
        const apps = this.humanResource && this.humanResource.apps || [];

        return new FormGroup(
            this.items.reduce((acc, item) => {
                acc[item.name] = new FormControl(AppPermissionsProvider.isAppEnabled(item, apps));
                return acc;
            }, {}),
        );
    }

    private getSystemRoleIdControl() {
        return new FormControl(this.systemRoleId);
    }

    private _resetAccessIfNoRole(): void {
        const controlNames: AppPermissionsAction[] = ['gantt', 'resource'];

        if (this.appFormControls) {
            controlNames.forEach(controlName => {
                const control = this.appFormControls[controlName];
                if (this.systemRoleId === this.defaultRole.id) {
                    control.setValue(false);
                    control.disable({emitEvent: false});
                } else {
                    control.enable({emitEvent: false});
                }
            });
        }

    }
}
