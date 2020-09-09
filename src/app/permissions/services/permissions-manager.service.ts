import { IIdObject, IPermission } from '../../../../projects/communication/src/lib/models';
import { Provider } from '../../../../projects/communication/src/lib/services';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class PermissionsManager<T extends IIdObject = IPermission, P = null> {
    private _params: P;
    private _permissions: T[];
    private _permissions$ = new BehaviorSubject<T[]>(null);
    public permissions$ = this._permissions$.asObservable().pipe(filter(Boolean));

    get params() {
        return this._params || <P>{};
    }

    set params(value) {
        this._params = value;
    }

    get permissions() {
        return this._permissions || [];
    }

    protected constructor(protected provider: Provider<T>) {
    }

    public loadPermissions(params?: P): Observable<T[]> {
        this.params = params;

        return this._loadPermissions(params)
            .pipe(
                catchError(() => {
                    // TODO: Implement permissions error handling
                    return throwError('Failed to load permissions.');
                }),
                tap(permissions => this.handlePermissionsResponse(permissions)),
            );

    }

    protected _loadPermissions(params?: P): Observable<T[]> {
        return this.provider.getItems(params);
    }

    public handlePermissionsResponse(permissions: T[]) {
        this._permissions = permissions;
        this.emitPermissionsUpdate(permissions);
    }

    public emitPermissionsUpdate(permissions: T[]) {
        this._permissions$.next(permissions);
    }
}

