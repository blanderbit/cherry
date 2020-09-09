import { IIdObject, Provider } from 'communication';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

export class MapHandler<T extends IIdObject = IIdObject> {
    private readonly _subscriptions: any;
    private _items$ = new BehaviorSubject({});
    public items$ = this._items$.asObservable();

    constructor(protected provider: Provider, public readonly items: { [id: string]: T } | { [id: number]: T }) {
        this._subscriptions = [
            provider.delete$ && provider.delete$.pipe(map(getPayload))
                .subscribe(res => this._handleDeleteItem(res)),

            provider.update$ && provider.update$.pipe(map(getPayload))
                .subscribe(res => this._handleUpdateItem(res)),

            provider.create$ && provider.create$.pipe(map(getPayload))
                .subscribe(res => this._handleCreateItem(res)),
        ].filter(Boolean);
    }

    loadItems(ids: number[]): Observable<T[]> {
        ids = ids.getUnique().filter(id => !this.items[id]);

        if (!ids.length)
            return of([]);

        return (<Observable<T[]>>this.provider.getBaseItemsByIds(ids)).pipe(
            tap((items) => this._handleCreateItem(items))
        );
    }

    setItems(items: T[]) {
        this._handleCreateItem(items);
    }

    protected _handleUpdateItem(items: T | T[]) {
        try {
            if (!items)
                return;

            if (Array.isArray(items)) {
                for (const element of items)
                    this._handleUpdateItem(element);

                return;
            }

            const item = this.items[items.id];

            if (item) {
                Object.assign(item, items);
                this.emitItemsUpdate();
            }
        } catch (e) {
            console.error('error', e);
        }
    }

    protected _handleCreateItem(item: T | T[]) {
        try {
            if (!item)
                return;
            if (Array.isArray(item)) {
                for (const i of item) {
                    this._handleCreateItem(i);
                }
            } else if (!this.items[item.id]) {
                this.items[item.id] = item;
                this.emitItemsUpdate();
            }
        } catch (e) {
            console.error('error', e);
        }

    }

    private emitItemsUpdate() {
        const v = Object.keys(this.items).reduce((acc, key) => {
            return {...acc, ...this.items[key]};
        }, {});

        this._items$.next(v);
    }

    protected _handleDeleteItem(items: IIdObject | IIdObject[]) {
        if (!items)
            return;

        if (Array.isArray(items)) {
            for (const item of items)
                this._handleDeleteItem(item);

            return;
        }

        const _id = typeof items === 'object' ? items.id : items;

        delete this.items[_id];
        this.emitItemsUpdate();
    }

    dispose() {
        for (const subscription of this._subscriptions)
            subscription.unsubscribe();
    }
}

function getPayload(message) {
    return message && message.payload;
}
