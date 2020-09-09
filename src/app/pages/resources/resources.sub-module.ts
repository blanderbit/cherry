import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ResourceFormComponent } from './resource-form/resource-form.component';
import { ResourcesComponent } from './resources/resources.component';
import { CommonModule } from '@angular/common';
import { FormControlModule } from 'form-control';
import { LoaderModule } from 'loader';
import { CloudModule } from '../../ui/cloud/cloud.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { Translate } from 'translate';
import { AvailabilityControlComponent, DynamicAvailabilityControlComponent } from './availability-control/availability-control.component';
import { DynamicComponents, DynamicFormControlModule } from 'dynamic-form-control';
import { GridModule } from '../../ui/ag-grid/ag-grid.module';
import { UserModule } from '../../user/user.module';
import { NavigationBackModule } from '../../ui/navigation-back/navigation-back.module';
import { DialogModule } from '../../ui/dialogs/dialog/dialog.module';
import { PermissionsModule } from 'permissions';
import { PermissionActionType, ResourceKind } from 'communication';
import { IPermissionRouterData, PermissionsGuard } from '../../identify/permissions.guard';
import { AccessSettingModule } from './access-setting/access-setting.module';
import { resourceFormConfig } from './token';
import { CheckboxModule } from '../../ui/checkbox/checkbox.module';

export function getResourcesRoutes(detailComponent, routerData: IResourcesRoutesDataParams) {
    return RouterModule.forChild([
        {
            path: '',
            component: ResourcesComponent,
        },
        {
            path: 'create',
            component: detailComponent,
            canActivate: [PermissionsGuard],
            data: {
                permissionAction: routerData.permissionCreate,
            } as IResourcesRoutingData,
        },
        {
            path: ':id',
            component: detailComponent,
            canActivate: [PermissionsGuard],
            data: {
                permissionAction: routerData.permissionUpdate,
            } as IResourcesRoutingData,
        },
    ]);
}

export type IResourcesRoutingData = IPermissionRouterData;

interface IResourcesRoutesDataParams {
    permissionUpdate: PermissionActionType;
    permissionCreate: PermissionActionType;
}

export interface IResourceFormConfig {
    showApplicationsAccess: boolean;
    disableAvatarUpdate: boolean;
    disableUserNameUpdate: boolean;
    resourceKind: ResourceKind;
    statusEditableOnCreate: boolean;
    statusEditableOnUpdate: boolean;
}

export interface IResourcesSubModuleConfig extends IResourcesRoutesDataParams {
    providers?: Provider[];
    imports?: (ModuleWithProviders | any)[];
    resourceFormConfig?: Partial<IResourceFormConfig>;
}

export function ResourcesSubModule(config: NgModule & IResourcesSubModuleConfig) {
    return NgModule({
        ...config,
        imports: [
            BaseResourcesModule,
            getResourcesRoutes(ResourceFormComponent, {
                permissionCreate: config.permissionCreate,
                permissionUpdate: config.permissionUpdate,
            }),
            DialogModule,
            ...(config.imports || []),
        ],
        providers: [
            ...(config.providers || []),
            {
                provide: DynamicComponents,
                multi: true,
                useValue: {
                    'availability-control': DynamicAvailabilityControlComponent,
                },
            },
            {
                provide: resourceFormConfig,
                useValue: config.resourceFormConfig || null,
            }
        ],
    });
}

@NgModule({
    imports: [
        CommonModule,
        FormControlModule,
        LoaderModule,
        CloudModule,
        NgbTypeaheadModule,
        RouterModule,
        Translate,
        DynamicFormControlModule,
        GridModule.withComponents([]),
        UserModule,
        NavigationBackModule,
        PermissionsModule,
        AccessSettingModule,
        CheckboxModule,
    ],
    exports: [
        DynamicFormControlModule,
    ],
    declarations: [
        ResourcesComponent,
        ResourceFormComponent,
        AvailabilityControlComponent,
        DynamicAvailabilityControlComponent,
    ],
    entryComponents: [
        DynamicAvailabilityControlComponent,
    ],
})
export class BaseResourcesModule {

}
