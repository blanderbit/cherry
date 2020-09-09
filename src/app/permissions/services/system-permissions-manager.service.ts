import { Injectable } from '@angular/core';
import { PermissionsManager } from './permissions-manager.service';
import { SystemPermissionsProvider } from '../../../../projects/communication/src/lib/services/common/system-permissions.provider';
import { AppPermissionsAction, AppPermissionsProvider, ExcludeId, IPermission, PermissionValue } from 'communication';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ISystemPermissionsManagerParams {
   appActions: AppPermissionsAction[];
   customPermissions?: IPermission[];
}

@Injectable()
export class SystemPermissionsManager extends PermissionsManager<IPermission, ISystemPermissionsManagerParams> {
    constructor(protected provider: SystemPermissionsProvider,
                protected appsPermissionsProvider: AppPermissionsProvider) {
        super(provider);
    }

    _loadPermissions(params?: ISystemPermissionsManagerParams ): Observable<IPermission[]> {
        return forkJoin([
            super._loadPermissions(params),
            this.appsPermissionsProvider.getItems().pipe(
                map(apps => {
                    return apps.map(app => ({
                        actionId: app.name,
                        value: AppPermissionsProvider.isAppEnabled(app, params.appActions)
                            ? PermissionValue.Allow : PermissionValue.Deny,
                    } as IPermission));
                }),
            ),
        ]).pipe(
            map(([systemPermissions, appPermissions]) =>
                [...systemPermissions, ...appPermissions, ...(params.customPermissions || [])]),
        );
    }
}
