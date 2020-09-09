import { Injectable } from '@angular/core';
import { HttpProvider } from './http.provider';
import { CommunicationConfig, ExcludeId } from 'communication';
import { PermissionsProvider } from '../common/permissions.provider';
import { Observable, throwError } from 'rxjs';
import { IPermission } from '../../models/permissions/permission.interface';

@Injectable()
export class HttpPermissionsProvider extends HttpProvider<IPermission> implements PermissionsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.permissions}/permissions`;
    }

    createItem(item: ExcludeId<IPermission>, options?: any, projectId?: number): Observable<any> {
        return throwError('Not implemented');
    }

    updateItem(item: IPermission, projectId?): Observable<IPermission> {
        return throwError('Not implemented');
    }

    deleteItem(id: number | string, projectId?: number): Observable<any> {
        return throwError('Not implemented');
    }
}
