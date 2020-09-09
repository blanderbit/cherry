import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CookieStorage } from 'cookie-storage';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
import { TransferState } from '@angular/platform-browser';
import { IPaginationResponse, PaginationResponse } from './models/pagination';

@Injectable()
export class HttpService extends HttpClient {
    private _requests = new Map();

    constructor(handler: HttpHandler,
                protected transferState: TransferState,
                @Optional() @Inject('PROXY_CONFIG') protected _proxyConfig: any,
                @Optional() @Inject('EXCLUDE_ROUTES_CONFIG') protected excludeFromRefreshMap: any,
                @Inject(PLATFORM_ID) protected _platformId: Object,
                @Inject(CookieStorage) protected _cookieStorage: Storage) {
        super(handler);
    }

    request(...args): Observable<any> {
        if (!args[2])
            args[2] = {};

        const [method, requestUrl, options] = args,
            arr = requestUrl.split('/').filter(Boolean),
            key = arr[1],
            url = arr.splice(2).join('/'),
            transferState = this.transferState,
            urlWithQuery: any = getFullUrl(requestUrl, options);

        if (transferState.hasKey(urlWithQuery)) {
            return of(transferState.get(urlWithQuery, null));
        }

        if (this._requests.has(urlWithQuery))
            return this._requests.get(urlWithQuery);

        const isServer = isPlatformServer(this._platformId),
            pipes = [map(value => responsePipe(value))];

        options['withCredentials'] = true;

        if (isServer) {
            const token = this._cookieStorage.getItem('token');
            const proxyConfig = this._proxyConfig;            
            const excludedRoutes = this.excludeFromRefreshMap as string[]; 
            const isRouteExcluded = excludedRoutes && excludedRoutes.includes(`/${url}`);

            if (!token && !isRouteExcluded)
                throw new Error('Invalid token');

            if (!options.headers)
                options['headers'] = new HttpHeaders();

            options['headers'] = options.headers.set('Authorization', `Bearer ${ token }`);

            if (key && proxyConfig[key]) {
                args[1] = getMicroServiceUrl(proxyConfig, key, getFullUrl(url, options));

                pipes.push(tap(value => transferState.set(urlWithQuery, value)));
                pipes.push(tap(value => console.log('server rendering response', urlWithQuery)));
                pipes.push(catchError(value => {
                    this._requests.delete(urlWithQuery);
                    console.log('Catch Server Error', urlWithQuery, args[1], value);
                    return throwError(value);
                }));
            }
        }

        // @ts-ignore
        let request = super.request(...args).pipe(...pipes);

        if (method === 'GET') {
            request = request.pipe(
                shareReplay(1),
                finalize(() => this._requests.delete(urlWithQuery)),
            );

            this._requests.set(urlWithQuery, request);
        }

        return request;
    }
}

function getMicroServiceUrl(proxyConfig, key, url) {
    const index = url.indexOf(`${ key }`);

    // index !== -1 for auth proxy
    return proxyConfig[key] + '/' + (index !== -1 ? url.slice(0, index) + url.slice(index + key.length - 1) : url);
}

function responsePipe(value: any) {
    if (isPaginationResponse(value)) {
        return new PaginationResponse(value.total, value.data);
    }

    return value ? (value.data || value) : value;
}

function isPaginationResponse(res: any): res is IPaginationResponse {
    return res && res.data && Array.isArray(res.data) && res.total != null;
}

function getFullUrl(url: string, options): string {
    const query = options && options.params && options.params.toString();

    return `${ url }?${ query }`;
}
