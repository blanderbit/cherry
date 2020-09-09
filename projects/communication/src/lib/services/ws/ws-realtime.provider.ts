import {IRealtimeMessage, RealtimeProvider} from '../common/realtime.provider';
import {Observable, Subscription} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {Inject} from '@angular/core';
import {CommunicationConfig} from '../../communication.config';
import {HttpClient, HttpParams} from '@angular/common/http';

export class WsRealtimeProvider extends RealtimeProvider {
    private _connecting = false;
    private _connectionsAttempts = 0;
    private _ws: WebSocket;

    private _reconect = (e) => {
        console.error(e);
        this.connect();
    }

    constructor(@Inject(CommunicationConfig) protected _config: CommunicationConfig,
                private httpClient: HttpClient) {
        super();
    }

    init(): Observable<any> {
        super.init();
        this.connect();

        return of(null);
    }

    destroy(): Observable<any> {
        this.disconnect();
        return of(null);
    }

    private _getAndModifyReconnectDelay() {
        return Math.log(this._connectionsAttempts++ * 10) * 1000;
    }

    disconnect() {
        if (!this._ws)
            return;

        this._ws.removeEventListener('close', this._reconect);
        this._ws.close();
        this._ws = null;
    }

    connect() {
        if (this._connecting)
            return;

        this._connecting = true;

        setTimeout(() => {
            this.httpClient.post(`${ this._config.http.realtime }/realtime/connect`, null).subscribe(
                (data: any) => this._createWebSocket(data && data.connectionId),
                (error) => {
                    this._connecting = false;
                    // this.connect(); for reconnect
                    console.error(error);
                },
            );
        }, this._getAndModifyReconnectDelay());
    }


    private _createWebSocket(connectionId: string) {
        this.disconnect();
        const {protocol, url} = this._config.ws;
        const baseUrl = protocol ? `${ protocol }://${ window.location.host }${ url }` : url;
        const _url = `${ baseUrl }?${ getParams({connectionId}) }`;
        const ws = this._ws = new WebSocket(_url);

        ws.addEventListener('open', () => {
            this._connecting = false;
            this._connectionsAttempts = 0;
        });

        ws.addEventListener('message', <any>((ev: any) => {
            const data = toLowerCase(safeParse(ev.data));
            console.log('ws.addEventListener', ev, data);

            if (data)
                this._message.next(data);
        }));

        ws.addEventListener('close', this._reconect);

        ws.addEventListener('error', (e) => console.error(e));
        
        window['ws'] = ws;
    }

    // private _subscribe(event: string, fn: (...params) => any) {
    //     if (!this._ws || !fn)
    //         return;
    //
    //     if (this._subscribers[event]) {
    //         console.error('Only one subscribers allowed');
    //         return;
    //     }
    //
    //     this._ws[event] = fn;
    //     this._ws.addEventListener(event, fn);
    // }

    // private _unsubscribe(event) {
    //     if (!this._subscribers[event])
    //         return;
    //
    //     this._ws.removeEventListener(event, this._subscribers[event]);
    //     delete this._subscribers[event];
    // }

    subscribe<T>(handler: (item: IRealtimeMessage<T>) => void): Subscription {
        return this.message.subscribe(handler);
    }
}


function safeParse(str: string): any {
    let obj;

    try {
        obj = JSON.parse(str);
    } catch (e) {
        obj = {};
    }

    return obj;
}

export function getParams(obj: any, params = new HttpParams()): HttpParams { // todo
    let value;

    // tslint:disable-next-line:forin
    for (const key in obj) {
        value = obj[key];
        if (typeof value === 'string') {
            params = params.append(key, value);
            continue;
        }

        if (typeof value === 'number') {
            params = params.append(key, `${ value }`);
            continue;
        }

        if (Array.isArray(value)) {
            const _obj = {};

            value.forEach(it => {
                _obj[key] = it;
                params = getParams(_obj, params);
            });
        }
    }

    return params;
}


function toLowerCase(obj) {
    const result = {};

    // tslint:disable-next-line:forin
    for (const key in obj) {
        const value = obj[key];
        result[key[0].toLowerCase() + key.slice(1)] = typeof value === 'object' && Array.isArray(value) ? toLowerCase(value) : value;
    }

    return result;
}
