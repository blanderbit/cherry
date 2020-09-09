import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivate, CanActivateChild,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { PermissionActionType } from 'communication';
import { IPermissionsDirectiveData, PermissionsService } from 'permissions';
import { isPlatformServer } from '@angular/common';

export interface IPermissionRouterData {
    permissionAction?: PermissionActionType;
}

@Injectable()
export class PermissionsGuard implements CanActivate, CanActivateChild {

    constructor(private _permissionsService: PermissionsService,
                private _activatedRoute: ActivatedRoute,
                private _router: Router,
                @Inject(PLATFORM_ID) private _platformId: Object,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this._canActivate(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this._canActivate(route, state);
    }

    public canActivateByPermissionsData(permissionAction: PermissionActionType, data?: IPermissionsDirectiveData) {
        this._setAccess(permissionAction, false, data);
    }

    private _canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // prevent running on server side
        if (isPlatformServer(this._platformId))
            return true;

        const permission = ((route.data || {}) as IPermissionRouterData).permissionAction;

        if (!permission) return true;

        return this._setAccess(permission, true);
    }

    private _setAccess(permissionAction: PermissionActionType, notForbiddenStrategy = true, data?: IPermissionsDirectiveData): boolean {
        const canActivate = notForbiddenStrategy ? this._permissionsService.isNotForbidden(permissionAction) :
            this._permissionsService.hasPermissions(permissionAction, data);

        if (!canActivate) {
            this._router.navigate(['error/403']).then(() => false);
        }

        return canActivate;
    }
}


