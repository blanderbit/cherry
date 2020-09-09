import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { ItemsComponent, LoadingComponent } from 'components';
import {
    AttachmentsProvider,
    IAttachment
} from '../../../../../projects/communication/src/lib/services/common/attachments.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'notifier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    IPermissionsDirectiveData,
    PERMISSIONS_DIRECTIVE_DATA,
    PermissionsService,
    ProjectsPermissionsManager
} from 'permissions';
import {
    ITask,
    PermissionAction,
    IAttachmentWithCustomProperties,
    TasksProvider, ProjectsProvider,
} from 'communication';
import { ProjectDetailsContainerComponent } from '../details-wrapper/project-details-container.component';
import { CloudConfigure, CloudUploadComponentUpdate } from '../../../common-tasks/service/cloud.configure';
import { AttachmentsService, AttachmentType } from '../../../common-tasks/service/attachment.service';
import { ModalPreviewComponent } from '../../../common-tasks/task-attachments/modal-preview/modal-preview.component';
import { Translate } from 'translate';
import {
    ModalAddFileFromLinkComponent,
} from '../../../common-tasks/task-attachments/modal-add-file-from-link/modal-add-file-from-link.component';
import { acceptFile } from '../../../helpers/const/regx';
import { DashboardRoutes } from '../../dashboard/dashboard.routes';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IPreviewPermission, PreviewPermissions } from '../../../common-tasks/task-attachments/modal-preview';

export const cross = require('../../../../assets/img/error/cross.png');
export const loader = require('../../../../assets/svg/loader.svg');

export enum SortFilesBy {
name = 'name',
date = 'uploadTime'
}

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss'],
    providers: [
        ...Translate.localizeComponent('task-comments'),
        {
            provide: LoadingComponent,
            useExisting: forwardRef(() => FilesComponent),
        },
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => FilesComponent),
        },
    ],
})
export class FilesComponent extends ItemsComponent<IAttachmentWithCustomProperties>
    implements OnInit, AfterViewInit, IPermissionsDirectiveData {
    cross = cross;
    loader = loader;
    hoveredItem: number;
    itemPending: IAttachmentWithCustomProperties = null;
    dropdownShown: boolean = false;
    fileChecked: number;
    taskItems: ITask[] = null;
    displayItemsStyle: boolean = false;
    public loadDataOnInit = true;
    public loadDataOnParamsChange = false;
    routes = DashboardRoutes;
    acceptFile: string[] = acceptFile;
    sortFilesByName: boolean = false;
    sortCases = SortFilesBy;

    @ViewChild('cloud', {static: false}) cloud: CloudUploadComponentUpdate;
    @ViewChild('context', {static: false}) context: ElementRef;
    @ViewChild('fileInput', {static: false}) fileInput: ElementRef<HTMLInputElement>;

    get projectId() {
        return this.project && this.project.id;
    }

    get project() {
        return this._parent.item;
    }

    get membersIds() {
        return this._parent.item.members.map(member => member.id);
    }

    get creatorId() {
        return this._parent.item.creatorId;
    }

    get isProjectActive() {
        return ProjectsProvider.isProjectActive(this.project);
    }

    get paramsItemId() {
        return {
            projectId: this.projectId,
            taskId: null
        };
    }

    constructor(
        protected _provider: AttachmentsProvider,
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _notifier: NotifierService,
        private _dialogService: NgbModal,
        private projectPermissionsManager: ProjectsPermissionsManager,
        @Inject(ProjectDetailsContainerComponent) private _parent: ProjectDetailsContainerComponent,
        private _cloudConfigure: CloudConfigure,
        private attachmentsService: AttachmentsService,
        protected _tasksProvider: TasksProvider,
        private _permissionsService: PermissionsService,
        private _injector: Injector
    ) {
        super();
    }

    ngOnInit() {
        this.projectPermissionsManager.setProjectContext(this.projectId);
        super.ngOnInit();

        this._tasksProvider.getItems().subscribe((tasks: ITask[]) => {
            this.taskItems = tasks;
        });
        this.attachmentsService.task.next(this.paramsItemId);
    }

    protected _getItems(params?): Observable<IAttachmentWithCustomProperties[]> {
        return this._provider.getItems(params).pipe(
            map(items => {
                const dataCurrent = this.items || [];
                return items.map(newItem => dataCurrent.find(({id}) => id === newItem.id) || newItem);
            })
        );
    }

    sortFilesBy(param: string) {
        const params = {
            projectId: this.projectId,
            orderBy: param,
        };
        this.loadData(params);

        this.sortFilesByName = param === this.sortCases.name;
    }

    nameOfTask(id: number) {
        const task = this.taskItems && this.taskItems.find(item => item.id === id);
        return task && task.name;
    }

    setHoveredItem(index: number, action: boolean) {
        this.items[index].active = action;
    }

    setSelectedItem(index: number, action: boolean) {
        if (action) {
            this.fileChecked = index;
            this.items[index].selected = true;
        } else {
            this.items[index].selected = false;
            this.fileChecked = null;
        }
    }

    changeItem(event) {
        this.items[event.index] = event.item;
    }

    onDropdownToggle(shown: boolean, index: number, item: IAttachmentWithCustomProperties) {
        this.dropdownShown = shown;
        if (shown) {
            this.hoveredItem = index;
            this.itemPending = item;
        } else {
            this.hoveredItem = null;
            this.itemPending = null;
        }
    }

    ngAfterViewInit() {
        this._cloudConfigure.setCustomFunctionToCloud(this.cloud);
    }

    onFileSelected(e: Event) {
        const files = e.target['files'] as File[];
        this.context.nativeElement.click();
        this.cloud.uploadFile(
            files,
            () => {
                this.fileInput.nativeElement.type = '';
                this.fileInput.nativeElement.type = 'file';
                this.fileInput.nativeElement.value = '';
            },
        );
    }

    delete() {
        this.attachmentsService.delete(this.itemPending);
        this.changeSelectedItem(false, this.itemPending);
    }

    download() {
        this.attachmentsService.download(this.itemPending);
    }

    preview(item: IAttachmentWithCustomProperties) {
        const hasPermission = this._permissionsService.hasPermissions(PermissionAction.PreviewProjectAttachment, {
            membersIds: this.membersIds,
            creatorId: this.creatorId,
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
                                    downloadAction: PermissionAction.DownloadProjectAttachment,
                                    deleteAction: PermissionAction.DeleteAttachmentFromProject,
                                } as IPreviewPermission,
                            },
                        ],
                    })
                });
                instance.componentInstance.item = item;
                instance.componentInstance.hideDeleteAction = !this.isProjectActive;
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

    changeSelectedItem($event: boolean, item: IAttachmentWithCustomProperties) {
        this.attachmentsService.changeSelectedItem($event, item);
    }



    addLink() {
        const instance = this._dialogService.open(ModalAddFileFromLinkComponent, {
            windowClass: 'modal-add-link-dialog',
            container: 'body',
        });
        instance.result
            .then(task => {
                const options = {
                    id: null,
                    projectId: this.projectId,
                };

                this.attachmentsService.linkUpload(task.url, options, task.title);
            })
            .catch((err) => console.log(err));
    }

    trackByItem = (_: number, item: IAttachmentWithCustomProperties) => item.id;

    protected _handleCreateItem(item: IAttachment) {
        if (item.projectId === this.projectId) {
            super._handleCreateItem(item);
        }
    }
}
