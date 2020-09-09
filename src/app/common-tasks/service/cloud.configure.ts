import { NotifierService } from 'notifier';
import { AttachmentsService, FileUpload } from './attachment.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CloudUploadComponent } from '../../ui/cloud/cloud-upload.component';


export interface FileLoader extends File {
    loader: number;
}

export interface CloudUploadComponentUpdate extends CloudUploadComponent {
    multiplesLoad(index?: number, progress?: number): void;
    cancelDownload(index: number): void;
    uploadFile(event, cbSuccess?: VoidFunction): void;
    closeRequest(file: FileUpload, index?: number): void;
}


@Injectable({
    providedIn: 'root'
})
export class CloudConfigure {

    constructor(
        private _notifier: NotifierService,
        private _attachmentsService: AttachmentsService
    ) {
    }

    setCustomFunctionToCloud(cloud: any = {}) {
        cloud._uploaderService = this._attachmentsService;

        cloud.multiplesLoad = (index?: number, progress?: number): void => {
            const file: FileLoader = cloud.files[index];
            if (file) {
                file.loader = progress as number;
            }
        };

        cloud.cancelDownload = (i: number): void => {
            const file = cloud.files[i];
            cloud.closeRequest(file, i);
            cloud.files = cloud.files.filter((e, index) => index !== i);
        };

        cloud.closeRequest = (file: FileUpload, index?: number): void => {
            if (file && file.uploadProcess$ && typeof file.uploadProcess$.next === 'function') {
                file.uploadProcess$.next(true);
                file.uploadProcess$.complete();
            }
            if (cloud.files && cloud.files.length && typeof index === 'number' ) {
                cloud.files[index] = null;
            }
        };

        cloud.closeModal = (): void  => {
            cloud.modalService.dismissAll();
            cloud.files.forEach(cloud.closeRequest);
            cloud.files = [];
            cloud.progressUpload = 0;
        };

        cloud.uploadFile = (event, cbSuccess?: VoidFunction): void => {
            for (let index = 0; index < event.length; index++) {
                const element = event[index];

                cloud.files.push(
                    new FileUpload({
                        file: element,
                        uploadProcess$: null
                    })
                );
            }

            if (!cloud.updateFiles) {
                cloud.closeModal();
                return;
            }
            this._attachmentsService
                .uploadFiles(cloud.files, cloud.multiplesLoad.bind(cloud))
                .pipe(map((array: object[]) => {
                   return (Array.isArray(array) && array) || [];
                }))
                .subscribe(
                    (e) => {
                        cloud._uploaderService._attachmentsProvider.onCreatePublic(e);
                        cloud.closeModal();
                        this._attachmentsService.deleteContext();
                        if (typeof cbSuccess === 'function') {
                            cbSuccess();
                        }
                    },
                    () => {
                        cloud.closeModal();
                        this._attachmentsService.deleteContext();
                    }
                );
        };
    }
}
