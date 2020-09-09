import { merge, Observable, of, throwError } from 'rxjs';
import { IIdObject } from '../../models/id.object';
import { IRealtimeMessage, RealtimeAction, RealtimeProvider, RealtimeSuffix } from '../common/realtime.provider';
import { Inject, Optional } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';

export type ExcludeId<T> = {
    [P in Exclude<keyof T, keyof IIdObject>]?: T[P]
};

export interface IActionConfig {
    prefix?: string;
    type?: string;
    transform: (m: IRealtimeMessage<any>) => any;
}

export abstract class Provider<T extends IIdObject = any> {

    constructor(@Optional() @Inject(RealtimeProvider) protected _realtimeProvider?: RealtimeProvider) {
        this.create$ = this._getObservableForCreate();
        this.update$ = this._getObservableForUpdate();
        this.delete$ = this._getObservableForDelete();
    }

    public create$: Observable<any>;
    public update$: Observable<any>;
    public delete$: Observable<any>;

    protected onCreate = this._bindRealtime(RealtimeAction.Create);
    protected onUpdate = this._bindRealtime(RealtimeAction.Update);
    protected onDelete = this._bindRealtime(RealtimeAction.Delete);

    protected _getObservableForUpdate(): Observable<any> {
        return this._getObservableFor(this.getUpdatesActions());
    }

    protected _getObservableForDelete(): Observable<any> {
        if (this._getType())
            return this._getObservableFor(this.getDeleteActions());
    }

    protected _getObservableForCreate(): Observable<any> {
        if (this._getType())
            return this._getObservableFor(this.getCreateActions());
    }

    private _getObservableFor(actions: (string | IActionConfig)[]): Observable<any> {
        // if string action passed - use it as it is, if object - construct action
        return merge(...actions.map(a => {
            if (typeof a === 'string')
                return this._getObservable(a);
            else
                return this._getObservable(a.type || a.prefix, a.type != null ? '' : null).pipe(map(a.transform));
        }));
    }

    protected getPayload() {
        return message => message && message.payload;
    }

    getUpdatesActions(): (string | IActionConfig)[] {
        return [RealtimeAction.Update];
    }

    getDeleteActions(): (string | IActionConfig)[] {
        return [RealtimeAction.Delete];
    }

    getCreateActions(): (string | IActionConfig)[] {
        return [RealtimeAction.Create];
    }

    protected _getType() {
        console.warn('Implement getType');
        return '';
    }

    protected _getObservable(action: string | RealtimeAction, prefix?: string): Observable<any> {
        this._realtimeProvider.message.subscribe(i => console.log(i))
        return this._realtimeProvider && this._realtimeProvider.message.pipe(
            tap(({type}) => {
                    // console.log(
                    //     'ACTION', action,
                    //     RealtimeProvider.getType(
                    //         action, prefix == null ? this._getType() : ''
                    //     ).toLowerCase() === type.toLowerCase(),
                    //     RealtimeProvider.getType(
                    //         action, prefix == null ? this._getType() : ''
                    //     ).toLowerCase(), type.toLowerCase(), this.constructor.name);
                }
            ),
            filter(({type}) =>
                RealtimeProvider.getType(action, prefix == null ? this._getType() : prefix).toLowerCase() === type.toLowerCase()),
        );
    }

    _emitRealtime(items, action: RealtimeAction | string, actionPrefix = null) {
        if (Array.isArray(items)) {
            items.map(i => this._emitRealtime(i, action, actionPrefix));
        } else {
            console.log('EMIT REALTIME', {
                payload: items,
                type: RealtimeProvider.getType(action, actionPrefix == null ? this._getType() : actionPrefix)
            });
            if (this._realtimeProvider) {
                this._realtimeProvider.notifyInternal({
                    payload: items,
                    type: RealtimeProvider.getType(action, actionPrefix == null ? this._getType() : actionPrefix)
                });
            }
        }
    }

    protected _bindRealtime(action: RealtimeAction) {
        return (item) => this._emitRealtime(item, action);
    }

    protected combineResponse(item: any): (response: number | any) => any {
        return (response: number | any) => {
            if (typeof item === 'object') {
                if (Array.isArray(item)) {
                    return item;
                }

                if (typeof response === 'number')
                    return {...item, id: response};

                return {...item, ...response};
            }
        };
    }

    abstract getItemById(id): Observable<T>;

    abstract createItem(item: ExcludeId<T>): Observable<T>;

    abstract updateItem(item: T): Observable<T>;

    patchItem(item: Partial<T>, field?: string): Observable<Partial<T>> {
        return throwError(`Implement patchItem for ${this.constructor.name}`);
    }

    abstract deleteItem(id: number | string): Observable<boolean>;

    abstract getItems(params?): Observable<T[]>;

    getItemsByIds(ids: number[]): Observable<T[]> {
        console.error('implement getItemsByIds');
        return of([]);
    }

    getBaseItemById(id: number): Observable<Partial<T>> {
        console.error('implement getBaseItemById');
        return of(null);
    }

    getBaseItemsByIds(ids: number[]): Observable<Partial<T>[]> {
        console.error('implement getBaseItemsByIds');
        return of([]);
    }
}
