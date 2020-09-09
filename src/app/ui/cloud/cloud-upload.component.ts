import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { NotifierService } from '../../notifier/notifier.service';
import { Translate } from 'translate';
import { handleFileSize } from '../../../../projects/communication/src/lib/functions';

export abstract class UploadService {
    abstract uploadFiles(formData, cb?: void): Observable<any>;
}

@Component ({
    selector: 'app-cloud-upload',
    templateUrl: './cloud-upload.component.html',
    styleUrls: ['./cloud-upload.component.scss'],
    providers: Translate.localizeComponent('upload')
})
export class CloudUploadComponent implements OnInit {
    closeResult: string;
    files: any = [];
    acceptString = 'image/*';
    progressUpload;

    @ViewChild('fileInput', {static: true})
    fileInput: ElementRef<HTMLInputElement>;

    @Input()
    acceptFile;

    @Input()
    updateFiles = true;

    @Input()
    multipleLoaderFiles = true;

    @Output()
    filesChanged = new EventEmitter();

    @Input()
    disable = false;

    @Input()
    showOverlay = true;

    contentType: string[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/x-icon', 'image/gif', 'image/bmp'];

    constructor(private modalService: NgbModal,
                private _notifier: NotifierService,
                @Optional() @Inject(UploadService) private _uploaderService: UploadService) {
    }

    ngOnInit() {
        if (this.acceptFile) {
            this.acceptString = this.acceptFile.join(', ');
        }
    }

    uploadFile(event: File[]): void {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.files.push(element);
        }

        this.filesChanged.emit(this.files);

        if (!this.updateFiles) {
            this.closeModal();
            return;
        }

        const formData = new FormData();
        formData.append('FormFile', this.files[0]);
        if (!this.files.length)
            return;

        this._uploaderService.uploadFiles(formData)
            .pipe(handleFileSize).subscribe(
            (res: any) => {
                if (res.type === HttpEventType.UploadProgress && !this.multipleLoaderFiles) {
                    this.progressUpload = Math.round(res.loaded / res.total * 100);
                } else if (res instanceof HttpResponse) {
                    this.closeModal();
                    this._notifier.showSuccess(`upload.success`);
                }
            },
            error => {
                this.closeModal();
                this._notifier.showError(error, `upload.error`);
            }
        );
    }

    deleteAttachment(index): void {
        this.files.splice(index, 1);
    }

    open(content: TemplateRef<any>): void {
        if (!this.disable) {
            if (this.showOverlay) {
                this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;
                }, (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
            } else {
                this.fileInput.nativeElement.click();
            }
        }
    }

    closeModal(): void {
        this.modalService.dismissAll();
        this.files = [];
        this.progressUpload = 0;
    }

    cancelDownload(i: number) {
        this.files = this.files.filter((e, index) => index !== i);
    }

    private getDismissReason(reason): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

}
