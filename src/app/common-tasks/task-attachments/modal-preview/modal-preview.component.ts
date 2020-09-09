import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AttachmentsProvider } from '../../../../../projects/communication/src/lib/services/common/attachments.provider';
import { NotifierService } from 'notifier';
import { IAttachmentWithCustomProperties } from 'communication';
import { DashboardRoutes } from '../../../pages/dashboard/dashboard.routes';
import { AttachmentsService } from '../../service/attachment.service';
import { IPreviewPermission, PreviewPermissions } from './index';
import { IPermissionsDirectiveData, PERMISSIONS_DIRECTIVE_DATA } from 'permissions';

@Component({
    selector: 'app-modal-preview',
    templateUrl: './modal-preview.component.html',
    styleUrls: ['./modal-preview.component.scss'],
    providers: [
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => ModalPreviewComponent),
        },
    ],
})
export class ModalPreviewComponent implements AfterViewInit, IPermissionsDirectiveData {
    item: IAttachmentWithCustomProperties;
    image: boolean;
    video: boolean;
    routes = DashboardRoutes;
    hideDeleteAction = false;

    membersIds: number[];
    creatorId: number;

    constructor(
        public modal: NgbActiveModal,
        protected _provider: AttachmentsProvider,
        protected _notifier: NotifierService,
        private changeDetector: ChangeDetectorRef,
        private attachmentsService: AttachmentsService,
        @Inject(PreviewPermissions) public previewPermissions: IPreviewPermission,
    ) {
    }

    downloadFile() {
        this._provider.downloadFile(this.item.id, this.item.name, {});
    }

    deleteFile() {
        this._provider.deleteItemFile(this.item.id, {ids: this.item.id})
            .subscribe(
                () => this._notifier.showSuccess('action-attachments.successfully-deleted'),
                (e) => this._notifier.showError(e.message, 'action-attachments.delete-error'),
            );
        this.attachmentsService.changeSelectedItem(false, this.item);
        this.modal.dismiss('deleted file');
    }

    ngAfterViewInit(): void {
        this.image = this._provider.isImage(this.item.mimeType, this.item.name);
        this.video = this._provider.isVideo(this.item.mimeType, this.item.name);
        this.changeDetector.detectChanges();
    }
}
