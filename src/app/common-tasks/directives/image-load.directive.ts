import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AttachmentsProvider } from '../../../../projects/communication/src/lib/services/common/attachments.provider';
import { ProjectsPermissionsManager } from 'permissions';
import { IAttachmentWithCustomProperties } from 'communication';
import { AttachmentType } from '../service/attachment.service';

export const cross = require('../../../assets/img/error/cross.png');

@Directive({
    selector: '[ImageLoadDirective]',
})

export class ImageLoadDirective implements OnInit {
    @Input()
    item: IAttachmentWithCustomProperties;

    @Input()
    index: number;

    @Output()
    changeItem = new EventEmitter();

    get isLink () {
        return this.item && (this.item.attachmentType === AttachmentType.LINK) &&  this.item.uri;
    }

    get isImage () {
        return this.http.isImage(this.mimeType, this.name);
    }

    get isVideo () {
        return this.http.isVideo(this.mimeType, this.name);
    }

    get file  () {
        return this.http.file(this.mimeType, this.name);
    }

    get name() {
        return (this.item && this.item.name) || '';
    }

    get mimeType() {
        return (this.item && this.item.mimeType) || '';
    }

    constructor(
        private http: AttachmentsProvider,
        private project: ProjectsPermissionsManager,
        private _sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.getImage();
    }

    getImage(): any {
        if (this.item && this.item.load) {
            return;
        }

        if (this.isLink) {
            const isFindFile = this.http.findImage('link');
            return this.setSrc(isFindFile.src, true);
        }

        if (this.file && this.file.length) {
            const isFindFile = this.http.findImage(this.file[0]);
            const fileResult = isFindFile && isFindFile.src;
            return this.setSrc(fileResult, true);
        }

        if (this.isImage || this.isVideo) {
            return this.http.getThumbnailFile(this.item.id, {projectId: this.project.projectId})
                .subscribe(response => {
                    const reader: FileReader = new FileReader();
                    reader.readAsDataURL(response);
                    reader.onloadend = () => {
                        const value = this._sanitizer.bypassSecurityTrustUrl(reader.result as string);
                        this.setSrc(value, false, this.isVideo);
                    };
                });
        }
        this.setSrc(cross);
    }

    setSrc(src, isFile = false, isVideo = false) {
        const item: any = {
            ...this.item,
            load: true,
            link: src,
            svgVideo: isVideo && this.http.findImage('video').src,
            isFile
        };
        this.changeItem.emit({
            item,
            index: this.index
        });
    }
}
