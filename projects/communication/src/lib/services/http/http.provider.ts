import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { ExcludeId, Provider } from '../common/provider';
import { CommunicationConfig } from '../../communication.config';
import { IIdObject } from '../../models/id.object';
import { map, take, tap } from 'rxjs/operators';
import { RealtimeProvider } from '../common/realtime.provider';

const URL_ERROR_KEY = 'Invalid proxy configuration';

@Injectable()
export abstract class HttpProvider<T extends IIdObject> extends Provider<T> {
    protected _baseUrl: string;

    constructor(@Inject(HttpClient) protected _http: HttpClient,
                @Inject(CommunicationConfig) protected _communicationConfig: CommunicationConfig,
                @Inject(RealtimeProvider) _realtimeProvider?: RealtimeProvider) {
        super(_realtimeProvider);
        console.log('new', this.constructor.name);

        this._communicationConfig.config$
            .pipe(
                take(1)
            ).subscribe(config => this.setBaseUrl(config));

    }

    private setBaseUrl(config: CommunicationConfig) {
        try {
            this._baseUrl = this._getURL(config) || URL_ERROR_KEY;
        } catch (e) {
            console.error('Invalid base url configuration', e);
        }
    }

    protected abstract _getURL(config: CommunicationConfig): string;

    getItemById(id: number | string): Observable<T> {
        return this._http.get<T>(this._getRESTURL(id));
    }
    
    getItems(obj?: any): Observable<T[]> {
        let params = {};
        if (obj) {
            params = new HttpParams({fromObject: obj});
        }

        return this._http.get<T[]>(this._getRESTURL(), {params});
    }

    createItem(item: ExcludeId<T>, options?: any): Observable<any> {
        return this._http.post(this._getRESTURL(), item, options)
            .pipe(
                map(this.combineResponse(item)),
                tap(i => this.onCreate(i)),
            );
    }

    updateItem(item: T): Observable<any> {
        return this._http.put<any>(this._getRESTURL(item.id), item)
            .pipe(
                map(this.combineResponse(item)),
                tap(this.onUpdate),
            );
    }

    deleteItem(id: number | string): Observable<any> {
        return this._http.delete(this._getRESTURL(id))
            .pipe(
                tap(() => this.onDelete({id})),
            );
    }

    getItemsByIds(ids?: number[]): Observable<T[]> {
        if (!ids || !ids.length) {
            return of([]);
        }

        return forkJoin(ids.map(id => this.getItemById(id)));
    }

    protected _concatUrl(...params: (string | number)[]): string {
        return `${this._baseUrl}`.concat('/', params.filter(Boolean).map(toString).join('/'));
    }

    protected _getRESTURL(id?) {
        return this._concatUrl(id);
    }

    protected arrayToUrl(...params: (string | number)[]) {
        return params.filter(Boolean).map(toString).join('/');
    }
}

function toString(i) {
    return i.toString();
}
