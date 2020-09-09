import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { Translate } from 'translate';
import { AttachmentsProvider, IAttachment } from '../../../../projects/communication/src/lib/services/common/attachments.provider';
import { ItemsComponent, LoadingComponent } from 'components';
import { ITask, IAttachmentWithCustomProperties, PermissionAction } from 'communication';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPreviewComponent } from './modal-preview/modal-preview.component';
import { AttachmentsService, AttachmentType } from '../service/attachment.service';
import { PermissionsService, ProjectsPermissionsManager } from 'permissions';
import { IPreviewPermission, PreviewPermissions } from './modal-preview';

export const cross = require('../../../assets/img/error/cross.png');
export const loader = require('../../../assets/svg/loader.svg');

@Component({
    selector: 'app-task-attachments',
    templateUrl: './task-attachments.component.html',
    styleUrls: ['./task-attachments.component.scss'],
    providers: [
        ...Translate.localizeComponent('task-comments'),
        {
            provide: LoadingComponent,
            useExisting: forwardRef(() => TaskAttachmentsComponent),
        },
    ],
})
export class TaskAttachmentsComponent extends ItemsComponent<IAttachmentWithCustomProperties> implements OnInit {
    loadDataOnParamsChange = false;
    loadDataOnInit = true;
    itemPending = null;
    dropdownShown = false;
    hoveredItem: number;
    cross: string = cross;
    loader: string = loader;

    @Input() item: ITask;
    @Input() hideDeleteAction = false;

    get membersIds() {
        return this.item.assignments.map(assignment => assignment.resourceId);
    }

    constructor(
        protected _provider: AttachmentsProvider,
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _notifier: NotifierService,
        private _dialogService: NgbModal,
        private projectPermissionsManager: ProjectsPermissionsManager,
        private attachmentsService: AttachmentsService,
        private permissionsService: PermissionsService,
        private _injector: Injector,
    ) {
        super();
    }

    loadData(params?: any) {
        super.loadData({
            projectId: this.item.projectId,
            taskId: this.item.id,
        });
    }

    changeItem(event) {
        this.items[event.index] = event.item;
    }

    onDropdownToggle(shown, index, item) {
        this.dropdownShown = shown;
        if (shown) {
            this.hoveredItem = index;
            this.itemPending = item;
        } else {
            this.hoveredItem = null;
            this.itemPending = null;
        }
    }

    setHoveredItem(index, action) {
        this.items[index].active = action;
    }

    preview(item: IAttachmentWithCustomProperties) {
        const hasPermission = this.permissionsService.hasPermissions(PermissionAction.PreviewTaskAttachment, {
            creatorId: item.creatorId,
            membersIds: this.membersIds,
        });

        if (!hasPermission) return;

        if (item.attachmentType === AttachmentType.FILE) {
            if (
                this._provider.isImage(item.mimeType, item.name) ||
                this._provider.isVideo(item.mimeType, item.name)
            ) {
                const instance = this._dialogService.open(ModalPreviewComponent, {
                    windowClass: 'modal-preview-dialog',
                    container: 'body',
                    injector: Injector.create({
                        parent: this._injector,
                        providers: [
                            {
                                provide: PreviewPermissions,
                                useValue: {
                                    downloadAction: PermissionAction.DownloadTaskAttachment,
                                    deleteAction: PermissionAction.DeleteAttachmentFromTask,
                                } as IPreviewPermission,
                            },
                        ],
                    }),
                });
                instance.componentInstance.hideDeleteAction = this.hideDeleteAction;
                instance.componentInstance.item = item;
                instance.componentInstance.creatorId = item.creatorId;
                instance.componentInstance.membersIds = this.membersIds;

                instance.result
                    .then(task => console.log(this.itemPending, task))
                    .catch(i => console.log(i));
            } else {
                this.attachmentsService.download(item);
            }
        } else {
            this.attachmentsService.openInNewWindow(item.uri);
        }
    }

    download = (itemPending: IAttachmentWithCustomProperties) => this.attachmentsService.download(itemPending);

    delete(itemPending) {
        this.attachmentsService.delete(itemPending);
    }

    protected _handleCreateItem(item: IAttachment) {
        if (item.taskId === (this.item && this.item.id)) {
            super._handleCreateItem(item);
        }
    }
}

