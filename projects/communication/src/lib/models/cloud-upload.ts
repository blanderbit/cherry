import { ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


export interface ICloudUpload {
    acceptFile: [];
    acceptString: string;
    closeResult: string;
    contentType: [];
    fileInput: ElementRef <{}>;
    files: [];
    filesChanged: EventEmitter <{}>;
    modalService: NgbModal;
    multipleLoaderFiles: boolean;
    multiplesLoad: void;
    progressUpload: number;
    showOverlay: boolean;
    updateFiles: boolean;
    uploadFile: void;
    closeModal: any;
}
