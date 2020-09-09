import { Injectable } from '@angular/core';
import { CommunicationConfig } from 'communication';
import { IPermission, PermissionsCommentsAction, PermissionValue, PermissionsAction, PermissionAction } from '../../models';
import { PermissionsProvider } from '../common/permissions.provider';
import { HttpPermissionsProvider } from './http.permissions.provider';
import { IProjectIdProvider } from 'permissions';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class HttpProjectsPermissionsProvider extends HttpPermissionsProvider implements PermissionsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${super._getURL(config)}/projects`;
    }

    getItems(obj?: IProjectIdProvider): Observable<IPermission[]> {
        const projectId = obj && obj.projectId;
        if (projectId) {

            return this._http.get<IPermission[]>(this._getRESTURL(projectId));
        }

        return throwError('You try to load project permissions without specifying projectId');
    }
}
