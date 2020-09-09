import { PermissionsProvider } from '../common/permissions.provider';
import { FakeProvider } from './fake.provider';
import { RealtimeProvider } from '../common/realtime.provider';
import { Inject, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IPermission } from '../../models/permissions/permission.interface';

export abstract class FakePermissionsProvider extends FakeProvider<IPermission> implements PermissionsProvider {
    protected constructor(
        @Optional() @Inject(RealtimeProvider) _realtimeProvider: RealtimeProvider,
    ) {
        super(_realtimeProvider);
    }

    protected _getItems(): IPermission[] {
        return [];
    }

    getItems(params?: { skip: number; take: number }): Observable<IPermission[]> {
        return of([]);
    }
}
