import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttachmentsService } from '../service/attachment.service';
import { ICloudUpload } from '../../../../projects/communication/src/lib/models/cloud-upload';

@Directive({
    selector: '[DragNDrop]'
})

export class DragndropDirective {
    @Input() context: ElementRef;
    @Input() cloud: ICloudUpload;

    constructor(
        private _dialogService: NgbModal,
        private attachmentsService: AttachmentsService
    ) {
    }

    @HostListener('window:dragover', ['$event'])
    private onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (!(evt.dataTransfer && evt.dataTransfer.types.includes('Files'))) {
            return;
        }

        this.attachmentsService.setContext(this.context);
    }

    @HostListener('window:dragleave', ['$event'])
    private onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        if (evt.relatedTarget === null) {
            this.attachmentsService.deleteContext();
            if (this.cloud) this.cloud.closeModal();
        }
    }
}
