import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Provider } from '../common/provider';
import { ExcludeId } from '../common/provider.js';
import { IIdObject } from '../../models/id.object';
import { DEFAULT_PAGE_SIZE } from '../../../../../../src/app/ui/ag-grid/paginator/paginator.component';
import { PaginationResponse } from '../../models/pagination';
import { Inject, Optional } from '@angular/core';
import { RealtimeProvider } from '../common/realtime.provider';

export abstract class FakeProvider<T extends IIdObject> extends Provider<T> {
    protected _delay: number;
    protected _getItemsParams;

    protected get delay(): number {
        return this._delay >= 0 ? this._delay : 0;
    }

    protected _store: { [key: number]: T } = {};

    get store() {
        return this._store;
    }

    constructor(@Optional() @Inject(RealtimeProvider) _realtimeProvider: RealtimeProvider) {
        super(_realtimeProvider);
        const items = this._getItems();

        for (const item of items) {
            this._store[item.id] = item;
        }
    }

    protected abstract _getItems(): T[];
    protected itemsFilter(item: T): boolean {
        return true;
    }

    getItemById(id): Observable<T> {
        if (id == null || !this._store[id]) {
            return throwError(`Item with ${ id } not found`);
        }

        return this._wrapDataInObservable(this._store[id]);
    }

    createItem(item: ExcludeId<T>): Observable<T> {
        if (!item) {
            return throwError('Invalid item');
        }

        const _item: T = {...item, id: Object.keys(this._store).length + 1} as T;
        this._store[_item.id] = _item;

        // @ts-ignore
        return this._wrapDataInObservable(_item)
            .pipe(
                map(this.combineResponse(item)),
                tap(this.onCreate)
            );
    }

    updateItem(item: T): Observable<T> {
        if (!item || item.id == null) {
            return throwError('Invalid item');
        }

        this._store[item.id] = item;

        // @ts-ignore
        return this._wrapDataInObservable(this._store[item.id])
            .pipe(
                map(this.combineResponse(item)),
                tap((v) => this.onUpdate(v))
            );
    }

    deleteItem(id: number): Observable<any> {
        if (id == null || !this._store[id]) {
            return throwError(`Invalid item id - ${ id }`);
        }

        delete this._store[id];

        return this._wrapDataInObservable(true)
            .pipe(
                tap(() => this.onDelete({id}))
            );
    }

    getItems(params?: { skip: number, take: number }): Observable<T[]> {
        this._getItemsParams = params;
        const {skip = 0, take = DEFAULT_PAGE_SIZE} = params || {};

        const items = Object.keys(this._store)
            .map(id => this._store[id])
            .filter((v) => this.itemsFilter(v))
            .splice(skip, take);


        const totalItems = Object.keys(this._store)
            .map(id => this._store[id])
            .filter((v) => this.itemsFilter(v)).length || 0;

        return this._wrapDataInObservable(new PaginationResponse(totalItems, items));
    }

    protected _wrapDataInObservable(data): Observable<any> {
        return of(data).pipe(delay(this.delay));
    }
}
