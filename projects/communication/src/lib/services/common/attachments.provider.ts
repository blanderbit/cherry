import { ExcludeId, Provider } from './provider';
import { Observable } from 'rxjs';
import { IIdObject } from '../../models';
import { FileImage } from '../../../../../../src/assets/files/files-images';

export interface IAttachment extends IIdObject  {
    id: number;
    attachmentType: number;
    creatorId: number;
    fileName: string;
    mimeType: string;
    name: string;
    path: string;
    projectId: number;
    taskId?: number;
    uploadTime: string;
}
export interface IIds {
    ids: number|number[];
}

export abstract class AttachmentsProvider extends Provider<IAttachment> {

    abstract createItemLink (item: ExcludeId<any>, options?: any): Observable<any>;

    abstract createItemFile (item: ExcludeId<any>, options?: any): Observable<any>;

    abstract deleteItemFile (id: number | number[], options?: IIds);

    abstract downloadFile (id: number | string, fileName: string, options: {});

    abstract getThumbnailFile (id: number | string, options: {});

    abstract onCreatePublic (item: ExcludeId<any>);

    abstract fileSave (res: Blob,  name: string): void;

    abstract getDataPipe (item: any): object | undefined;

    abstract create(requestURL: (string | number)[], item: ExcludeId<any>, options?: any): Observable<any>;

    abstract checkOneRegx (array: string[], regx: RegExp);

    abstract regxCreate(regx: RegExp): RegExp ;

    abstract isImage (...texts: string[]): boolean;

    abstract isVideo (...texts: string[]): boolean;

    abstract file (first: string, second: string): RegExpMatchArray;

    abstract findImage (findExtention: string): FileImage | null;

    abstract isLink (link: string): boolean;

    abstract isHttp (link: string): boolean;

    abstract openInNewWindow(link: string, isLink: boolean): void;

    abstract getItems(params?): Observable<any>;

}

