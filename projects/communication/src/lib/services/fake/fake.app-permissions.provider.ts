import { AppPermissionsProvider } from '../common/app-permissions.provider';
import { AppPermissionsAction, IIdObject } from 'communication';
import { FakeProvider } from './fake.provider';
import { Observable, of } from 'rxjs';
import { AppPermissionsActions } from '../../models/permissions/system-permissions-actions';

export interface IAppPermission extends IIdObject {
    name: AppPermissionsAction;
    isDefault: boolean;
}


export abstract class FakeAppPermissionsProvider extends FakeProvider<IAppPermission> implements AppPermissionsProvider {
    protected _getItems(): IAppPermission[] {
        return [
            { name: AppPermissionsActions.task, isDefault: true },
            { name: AppPermissionsActions.project, isDefault: false },
            { name: AppPermissionsActions.time, isDefault: true },
            { name: AppPermissionsActions.kanban, isDefault: true },
            { name: AppPermissionsActions.gantt, isDefault: false },
            { name: AppPermissionsActions.calendar, isDefault: false },
            { name: AppPermissionsActions.resource, isDefault: false },
        ] as IAppPermission[];
    }

    getItems(params?: {skip: number; take: number}): Observable<IAppPermission[]> {
        return of(this._getItems());
    }
}
