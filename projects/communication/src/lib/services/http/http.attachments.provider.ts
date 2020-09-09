import { HttpProvider } from './http.provider';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CommunicationConfig } from '../../communication.config';
import {  RealtimeSuffix  } from '../common/realtime.provider';
import { ExcludeId } from '../common/provider';
import { HttpParams } from '@angular/common/http';
import { AttachmentsProvider, IAttachment, IIds } from '../common/attachments.provider';
import { FileImage, filesImages } from '../../../../../../src/assets/files/files-images';
import { regxFile, regxHttp, regxImage, regxLink, regxVideo } from '../../../../../../src/app/helpers/const/regx';


const Suffix: string = 'attachments';

export abstract class HttpAttachmentsProvider extends HttpProvider<IAttachment> implements AttachmentsProvider {
    fileSave (res: Blob,  name: string): void {
        const url = URL.createObjectURL(res);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    protected _getType (): string {
        return RealtimeSuffix.Attachments;
    }

    protected _getURL (config: CommunicationConfig): string {
        return `${config.http.attachments}`;
    }

    protected _getRESTURL  (array = []): string {
        return this._concatUrl(Suffix, ...array);
    }

    protected createParams(options = {}): HttpParams {
        return new HttpParams({fromObject: options});
    }

    getItems = (obj): Observable<any> => super.getItems(obj);

    getItemById(id: number | string): Observable<any> {
        return this._http.get<any>(this._getRESTURL([id]));
    }

    createItemLink (item: ExcludeId<any>, options?: any): Observable<any> {
        return this.create(['links'], item, options)
            .pipe(
                map(this.getDataPipe),
                tap((i) => i && this.onCreate(i))
            );
    }


    createItemFile = (item: ExcludeId<any>, options?: any): Observable<any> =>
        this.create(['files'], item, options)


    deleteItemFile(id: number|number[], options?: IIds ) {
        const params = this.createParams(options);
        const requestURL = ['ids'];
        return this._http.delete(`${this._getRESTURL(requestURL)}`, {params})
            .pipe(
                tap(() => this.onDelete(id)),
            );
    }

    downloadFile(URL_ID: number, fileName: string, options: {}) {
        const params = this.createParams(options);
        const requestURL = ['files', URL_ID, 'download'];
        return this._http.get(`${this._getRESTURL(requestURL)}`, {params, responseType: 'blob'})
            .subscribe((res: any) => this.fileSave(res, fileName));
    }

    getThumbnailFile(URL_ID: (number | string), options: {}) {
        const params = this.createParams(options);
        const requestURL = ['files', URL_ID, 'download'];
        return this._http.get(`${this._getRESTURL(requestURL)}`,
            {
                params,
                responseType: 'blob'
            });
    }

    onCreatePublic (items) {
        return this.onCreate(items);
    }

    create(requestURL: (string | number)[], item: ExcludeId<any>, options?: any): Observable<any> {
        const params = this.createParams(options);
        return this._http.post(`${this._getRESTURL(requestURL)}`, item, {
            params,
            reportProgress: true,
            observe: 'events'
        });
    }

    public getDataPipe = (item: any) => item && item.body && item.body.data;

    checkOneRegx = (array: string[] = [], regx: RegExp) => {
        return array.some((item: string) => regx.test(item));
    }

    regxCreate = (regx: RegExp): RegExp => new RegExp(regx);

    isImage = (...texts: string[]): boolean => this.checkOneRegx(texts, this.regxCreate(regxImage));

    isVideo = (...texts: string[]): boolean => this.checkOneRegx(texts, this.regxCreate(regxVideo));

    file = (first: string, second: string): RegExpMatchArray => {
        return first.match(this.regxCreate(regxFile)) || second.match(this.regxCreate(regxFile)) || [];
    }

    findImage = (findExtention: string): FileImage | null => {
        return filesImages.find((i: FileImage) => i.extention.includes(findExtention));
    }

    isLink = (link: string): boolean => this.regxCreate(regxLink).test(link);

    isHttp = (link: string): boolean => this.regxCreate(regxHttp).test(link);

    openInNewWindow(link: string, isLink = true) {
        let url: string = '';
        if (!isLink) {
            url += 'http://';
        }

        url += link;
        window.open(url, '_blank');
    }
}
