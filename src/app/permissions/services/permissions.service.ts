import { Injectable } from '@angular/core';
import { ProjectsPermissionsManager } from './projects-permissions-manager.service';
import { SystemPermissionsManager } from './system-permissions-manager.service';
import { IPermission, PermissionActionType, PermissionValue } from 'communication';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import { ProfileService } from '../../identify/profile.service';

interface IPermissionsData {
    creatorId?: number;
    membersIds?: number[];
}

@Injectable()
export class PermissionsService {
    public permissionsChange$: Observable<IPermission[]>;

    static actionForbidden(action: IPermission): boolean {
        if (action) {
            return action.value === PermissionValue.Deny || action.value === PermissionValue.NotSet;
        }

        return false;
    }

    get profileId() {
        return this._profile && this._profile.profile.resourceId;
    }

    constructor(private _systemPermissionsManager: SystemPermissionsManager,
                private _profile: ProfileService,
                private _projectsPermissionsManager: ProjectsPermissionsManager) {
        this._initPermissionsSubscription();
    }

    public hasPermissions(action: PermissionActionType, permissionData?: IPermissionsData): boolean {
        if (!this._systemPermissionsManager || !this._projectsPermissionsManager) return false;

        const permission = this._combinePermissionsArray().find(p => p.actionId === action);

        return !!(permission && this._getPermissionValue(permission, (permissionData || {})));
    }

    public isNotForbidden(action: PermissionActionType) {
        const permission = this._combinePermissionsArray().find(p => p.actionId === action);

        return !PermissionsService.actionForbidden(permission);
    }

    public isForbidden(action: PermissionActionType) {
        return !this.isNotForbidden(action);
    }

    private _getPermissionValue(permission: IPermission, permissionData?: IPermissionsData): boolean {
        const {value} = permission;
        const userId = this.profileId;

        switch (value) {
            case PermissionValue.Allow:
                return true;
            case PermissionValue.Own:
                const {creatorId} = (permissionData || {}) as IPermissionsData;

                return userId === creatorId;

            case PermissionValue.Member:
                const {membersIds} = (permissionData || {}) as IPermissionsData;

                return (membersIds || []).includes(userId);

            case PermissionValue.NotSet:
            case PermissionValue.Deny:
            default:
                return false;
        }
    }

    private _initPermissionsSubscription(): void {
        this.permissionsChange$ = merge(
            this._projectsPermissionsManager.permissions$,
            this._systemPermissionsManager.permissions$,
        ).pipe(
            startWith(this._combinePermissionsArray()),
            map(() => this._combinePermissionsArray()),
        );
    }

    private _combinePermissionsArray(): IPermission[] {
        return [...this._projectsPermissionsManager.permissions, ...this._systemPermissionsManager.permissions];
    }
}

function throwMissingPermissionsData(action: PermissionActionType, missingData: string = '') {
    throw new Error(`Permission action ${action} requires additional data to resolve permission ${missingData.toUpperCase()}`);
}
