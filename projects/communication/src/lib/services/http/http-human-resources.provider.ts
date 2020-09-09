import { IHumanResource, IResource, IUpdateHumanResourceStatus } from '../../models/resource';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { HttpResourcesProvider } from './http-resources.provider';
import { ExcludeId, HumanResourcesProvider } from 'communication';
import { RealtimeSuffix } from '../common/realtime.provider';
import { map } from 'rxjs/operators';

/*
* https://stackoverflow.com/questions/53546691/preserving-plus-sign-in-urlencoded-http-post-request
* For phone number
* */
export class UrlEncodingCodec extends HttpUrlEncodingCodec {

    decodeKey(key: string): string {
        return super.decodeKey(key);
    }

    decodeValue(value: string): string {
        return super.decodeValue(value);
    }

    encodeKey(k: string): string {
        return standardEncoding(k);
    }

    encodeValue(v: string): string {
        return standardEncoding(v);
    }
}

export function normalizeFormDataObject(obj, key = null) {
    let result = {};

    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            const value = obj[property];

            if (typeof value === 'object' && !Array.isArray(value)) {
                result = {
                    ...result,
                    ...normalizeFormDataObject(obj[property], property),
                };
            } else {
                result[[key, property].filter(Boolean).join('.')] = value;
            }
        }
    }

    return result;
}

function standardEncoding(v: string): string {
    return encodeURIComponent(v);
}

export class HttpHumanResourcesProvider extends HttpResourcesProvider<IHumanResource> implements HumanResourcesProvider {
    get usersUrl() {
        return this._communicationConfig && this._communicationConfig.http.users;
    }

    get identityUrl() {
        return this._communicationConfig && this._communicationConfig.http.identity;
    }

    protected _getType(): string {
        return RealtimeSuffix.HumanResource;
    }

    getRoles(): Observable<any> {
        return this._http.get(`${this.usersUrl}/users/roles`);
    }

    getAvatarUrl(id: number): string {
        return this._getPhotoUrl(id);
    }

    uploadAvatar(data, id): Observable<any> {
        return this._http.post(this._getPhotoUrl(id), data, {
            reportProgress: true,
            observe: 'events',
        });
    }

    getUploadPhotoUrl(id: number | string): string {
        return `${this._communicationConfig.http.identity}/users/${id}/photos`;
    }

    protected _getRESTURL(id?): string {
        return this._concatUrl('human', id);
    }

    updateItem(item: IHumanResource): Observable<IHumanResource> {
        if (!item.phone)
            delete item.phone;

        return super.updateItem(item);
    }

    createItem(item: ExcludeId<IHumanResource>, params?: any): Observable<any> {
        if (!item.phone)
            delete item.phone;

        for (const key in item)
            if (item[key] == null || key == null)
                delete item[key];

        const body = new HttpParams({fromObject: normalizeFormDataObject(item), encoder: new UrlEncodingCodec()});
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

        return super.createItem(body as any, headers);
    }

    getBaseItemById(id: number): Observable<IResource> {
        return this.getBaseItemsByIds([id]).pipe(map(res => res[0]));
    }

    getBaseItemsByIds(ids: number[]): Observable<IResource[]> {
        const params = new HttpParams({fromObject: {ids: ids.map(String)}});

        return this._http.get<[]>(this._getRESTURL('basic'), {params});
    }

    updateStatus(obj: IUpdateHumanResourceStatus): Observable<any> {
        return this._http.put<any>(this._concatUrl('human', obj.id, 'status'), obj);
    }
}
