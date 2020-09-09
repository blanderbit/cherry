import { ExcludeId, IIdObject, Provider } from 'communication';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface IProviderDecoratorConfig {
    beforeCreate?: (params: any) => Observable<any>;
    beforeGetItems?: (params: any) => Observable<any>;
}

export class ProviderDecorator<T extends IIdObject> extends Provider<T> {
    constructor(private provider: Provider<T>,
                private _config: IProviderDecoratorConfig = {}) {
        super(null);
        Object.assign(this, provider);
    }

    createItem(item: ExcludeId<T>): Observable<T> {
        const {beforeCreate = of} = this._config;

        return beforeCreate(item).pipe(switchMap(_item => this.provider.createItem(_item)));
    }

    deleteItem(id: number): Observable<boolean> {
        return this.provider.deleteItem(id);
    }

    getItemById(id): Observable<T> {
        return this.provider.getItemById(id);
    }

    getItems(params?): Observable<T[]> {
        const {beforeGetItems = of} = this._config;

        return beforeGetItems(params).pipe(switchMap((p) => this.provider.getItems(p)));
    }

    updateItem(item: T): Observable<T> {
        return this.provider.updateItem(item);
    }
}
