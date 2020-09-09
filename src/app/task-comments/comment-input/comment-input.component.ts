import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { TaskCommentsProvider } from '../../../../projects/communication/src/lib/services/common/task-comments.provider';
import { FormComponent } from 'components';
import {
    IIdObject,
    ITask,
    ITaskComment,
} from 'communication';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierService } from 'notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetailsComponent } from '../../common-tasks/task-details/task-details.component';
import { TaskCommentsManagerService } from '../task-comments-manager.service';
import { Translate } from 'translate';
import { TaskAttachmentsComponent } from '../../common-tasks/task-attachments/task-attachments.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    ModalAddFileFromLinkComponent,
} from '../../common-tasks/task-attachments/modal-add-file-from-link/modal-add-file-from-link.component';
import { AttachmentsService } from '../../common-tasks/service/attachment.service';
import { CloudUploadComponent } from '../../ui/cloud/cloud-upload.component';
import { CloudConfigure, CloudUploadComponentUpdate } from '../../common-tasks/service/cloud.configure';
import { acceptFile } from '../../helpers/const/regx';
import { IPermissionsDirectiveData, PERMISSIONS_DIRECTIVE_DATA } from 'permissions';
import { IMentionsSubmitEvent } from '../../ui/mentions-input/mentions-input.component';

@Component({
    selector: 'app-comment-input',
    templateUrl: './comment-input.component.html',
    styleUrls: ['./comment-input.component.scss'],
    providers: [
        Translate.localizeComponent('task-comments'),
        TaskAttachmentsComponent,
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => CommentInputComponent),
        },
    ],
})
export class CommentInputComponent extends FormComponent<ITaskComment> implements AfterViewInit, OnInit, IPermissionsDirectiveData {
    private _disabled = false;
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    focused = false;
    acceptFile: string[] = acceptFile;

    @ViewChild('cloud', {static: false}) cloud: CloudUploadComponentUpdate;
    @ViewChild('context', {static: false}) context: ElementRef;
    @ViewChild('fileInput', {static: false}) fileInput: any;

    @Input() task: ITask;

    @Input()
    set disabled(value: boolean) {
        this._disabled = value;
        this.setDisableState();
    }

    get disabled() {
        return this._disabled;
    }

    fileUploadSuccess = (): void => {
        this.fileInput.nativeElement.type = '';
        this.fileInput.nativeElement.type = 'file';
        this.fileInput.nativeElement.value = '';
    };

    get membersIds() {
        return this.task.assignments.map(assignment => assignment.resourceId);
    }

    get creatorId() {
        return this.task.creatorId;
    }

    get paramsItemId() {
        return {
            projectId: this.task.projectId,
            taskId: this.task.id,
        };
    }

    get resources() {
        return this._parent.resources;
    }

    constructor(
        public provider: TaskCommentsProvider,
        protected _notifier: NotifierService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        public taskCommentsManager: TaskCommentsManagerService,
        private _parent: TaskDetailsComponent,
        private _dialogService: NgbModal,
        private attachmentsService: AttachmentsService,
        private _cloudConfigure: CloudConfigure,
        @Optional() @Inject(CloudUploadComponent) public cloudUploadComponent: CloudUploadComponent,
    ) {
        super();
        this.loadingHandler = _parent;

    }

    ngOnInit() {
        super.ngOnInit();
        this.setDisableState();
    }

    ngAfterViewInit() {
        this.attachmentsService.task.next(this.paramsItemId);
        this._cloudConfigure.setCustomFunctionToCloud(this.cloud);
    }

    setDisableState() {
        if (this.form) {
            if (this._disabled && this.form.enabled) {
                this.form.disable();

                if (this.controls.text.value) {
                    this.controls.text.setValue('', {emitEvent: false});
                }
            } else {
                this.form.enable();
            }
        }
    }

    toggleFocusState() {
        setTimeout(() => this.focused = !this.focused);
    }

    getDto(): ITaskComment {
        const {
            id: taskId,
        } = this.task;
        return {
            ...super.getDto(),
            taskId,
        };
    }

    protected _handleSuccessCreate(response?) {
        this.controls.text.setValue(null, {
            emitEvent: false,
        });
    }

    protected _handleDeleteItem(item: IIdObject) {
    }

    protected createForm(): FormGroup {
        return new FormGroup({
            text: new FormControl(null),
            fileInput: new FormControl(null),
            mentions: new FormControl(null),
        });
    }

    public handlePaste({clipboardData}: ClipboardEvent): void {
        const pastedFile: File[] = this.attachmentsService.getPastedImage(clipboardData);
        const text = clipboardData.getData('text');

        if (pastedFile) {
            this.context.nativeElement.click();
            this.cloud.uploadFile(pastedFile);
        } else if (text) {
            this.attachmentsService.linkUpload(text, this.task);
        }
    }

    attachLink() {
        const instance = this._dialogService.open(ModalAddFileFromLinkComponent, {
            windowClass: 'modal-add-link-dialog',
            container: 'body',
        });
        instance.result
            .then(task => {
                this.attachmentsService.linkUpload(task.url, this.task, task.title);
            })
            .catch(() => {
            });
    }

    attachFile() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(e: Event) {
        const files = e.target['files'] as File[];
        this.context.nativeElement.click();
        this.cloud.uploadFile(files, this.fileUploadSuccess.bind(this));
    }

    onSendMessage(data: IMentionsSubmitEvent) {
        const mentions = data.mentions.map(mention => mention.id);
        this.controls.mentions.setValue(mentions, {emitEvent: false});

        this.apply();
    }
}
