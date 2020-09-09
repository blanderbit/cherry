import { HttpProvider } from './http.provider';
import { CommunicationConfig, IResource, ResourcesProvider } from 'communication';
import { Observable } from 'rxjs';
import { RealtimeAction, RealtimeSuffix } from '../common/realtime.provider';
import { HttpParams } from '@angular/common/http';
import { IIds } from '../common/attachments.provider';


export class HttpResourcesProvider<T extends IResource = IResource> extends HttpProvider<T> implements ResourcesProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.resources}/resources`;
    }

    protected _getType(): string {
        return RealtimeSuffix.Resource;
    }

    _getObservableForDelete() {
        return this._getObservable(RealtimeAction.Delete, RealtimeSuffix.Resource);
    }

    protected _getPhotoUrl(id) {
        return this._concatUrl(id, 'photos');
    }

    getPhotoUrl(id: number | string): string {
        return this._getPhotoUrl(id);
    }

    uploadPhoto(id, file, reportProgress = true): Observable<any> {
        const formData = new FormData();
        formData.append('FormFile', file);

        return this._http.post(this.getPhotoUrl(id), formData, reportProgress && {
            reportProgress: true,
            observe: 'events'
        });
    }

    getAssignedItemsById(options?: IIds): Observable<any> {
        const params = this.createParams(options);
        const requestURL = ['ids'];

        return this._http.get<any>(`${this._concatUrl(...requestURL)}`, {params});
    }

    protected createParams(options = {}): HttpParams {
        return new HttpParams({fromObject: options});
    }
}
