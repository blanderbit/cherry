import { ElementRef, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttachmentsProvider } from '../../../../projects/communication/src/lib/services/common/attachments.provider';
import { BehaviorSubject, forkJoin, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { IAttachmentWithCustomProperties } from 'communication';
import { NotifierService } from 'notifier';

export enum AttachmentType {
    LINK = 0,
    FILE = 1
}

export interface IUploadFilesParams {
    projectId: number;
    taskId: number|null;
}

export class FileUpload {
    file: File;
    uploadProcess$: Subject<null | boolean | undefined> | undefined | null;

    constructor(init?: Partial<FileUpload>) {
        Object.assign(<FileUpload>this, init);
    }
}


@Injectable({
    providedIn: 'root'
})
export class AttachmentsService {
    context: ElementRef;
    task: BehaviorSubject<IUploadFilesParams> = new BehaviorSubject(null);
    selectedFiles: BehaviorSubject<IAttachmentWithCustomProperties[]> = new BehaviorSubject([]);

    constructor(
        private _dialogService: NgbModal,
        protected _attachmentsProvider: AttachmentsProvider,
        private _notifier: NotifierService,
    ) {
    }

    setContext(context) {
        if (this.context) {
            return;
        }
        this.context = context;
        context.click();
    }

    deleteContext() {
        this.context = null;
    }

    linkUpload(link, option, title?) {
        const isLink = this._attachmentsProvider.isLink(link);
        const {
            id,
            projectId,
        } = option;

        if (isLink) {
            this._attachmentsProvider.createItemLink({
                name: title || link,
                uri: link,
                taskId: id,
            }, { projectId })
                .subscribe({
                    next: (e) => console.log(e),
                    error: () => this._notifier.showError('action-attachments.upload-link-error'),
                });
        }

    }

    uploadFiles(files: FileUpload[], progressCb?) {
        return this.task.pipe(
            switchMap((task: IUploadFilesParams) => {

                const { taskId, projectId } = task;

                const arr = [];
                let count = 0;
                const TransactionId = Date.now().toString();

                for (const element of files) {
                    const formData = new FormData();
                    formData.append('File', element.file, element.file.name);
                    formData.append('Name', element.file.name);
                    formData.append('TaskId', `${taskId || ''}`);
                    formData.append('TransactionId', TransactionId);
                    formData.append('Count', `${files.length}`);
                    const obj = {
                        count,
                    };

                    element.uploadProcess$ = new Subject();

                    const uploadProcess$ = this._attachmentsProvider.createItemFile(formData, { projectId })
                        .pipe(
                            takeUntil(element.uploadProcess$),
                            tap(res => {
                                if (res.type === HttpEventType.UploadProgress && typeof progressCb === 'function') {
                                    progressCb(obj.count, Math.round(res.loaded / res.total * 100));
                                }
                                if (res.type === HttpEventType.Response && typeof progressCb === 'function') {
                                    progressCb(obj.count, Math.round(100));
                                }
                                if (res.body) {
                                    this._notifier.showSuccess('action-attachments.successfully-upload');
                                }
                            }),
                            catchError((e) => {
                                this._notifier.showError(e.message, 'action-attachments.upload-error');
                                return of({ error: true, message: e.message });
                            }),
                            map(this._attachmentsProvider.getDataPipe),
                        );

                    arr.push(uploadProcess$);
                    count++;
                }
                return forkJoin(arr);
            }),
        );

    }

    getPastedImage(clipboardData): File[] | undefined {
        if (
            clipboardData &&
            clipboardData.files &&
            clipboardData.files.length
        ) {
            return (clipboardData.files);
        }
    }

    openInNewWindow = (link: string) => this._attachmentsProvider.openInNewWindow(link, this._attachmentsProvider.isHttp(link));

    download(item: IAttachmentWithCustomProperties) {
        if (item.attachmentType === AttachmentType.FILE) {
            this._attachmentsProvider.downloadFile(item.id, item.name, {});
        } else {
            this.openInNewWindow(item.uri);
        }
    }

    delete(item: IAttachmentWithCustomProperties) {
        return this._attachmentsProvider.deleteItemFile(item.id, { ids: item.id })
            .subscribe(
                () => {
                    this._notifier.showSuccess('action-attachments.successfully-deleted');
                },
                (e) => {
                    this._notifier.showError(e.message, 'action-attachments.delete-error');
                },
            );
    }

    deleteSelectedFiles(items: IAttachmentWithCustomProperties[]) {
        const ids: number[] = [];
        items.forEach(item => ids.push(item.id));
        return this._attachmentsProvider.deleteItemFile(ids, { ids })
            .subscribe(
                () => {
                    this._notifier.showSuccess('action-attachments.successfully-deleted');
                    this.selectedFiles.next([]);
                },
                (e) => this._notifier.showError(e.message, 'action-attachments.delete-error'),
            );
    }

    changeSelectedItem($event: boolean, item: IAttachmentWithCustomProperties) {
        const selectedFiles = this.selectedFiles.getValue();
        if ($event) {
            selectedFiles.push(item);
        } else {
            const index = selectedFiles.indexOf(item);
            if (index > -1) selectedFiles.splice(index, 1);
        }
        this.selectedFiles.next(selectedFiles);
    }
}
