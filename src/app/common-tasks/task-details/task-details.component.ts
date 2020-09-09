import { Component, DoCheck, ElementRef, EventEmitter, forwardRef, Inject, OnInit, Optional, Output, ViewChild } from '@angular/core';
import {
    AssignmentsProvider,
    AssignmentStatus,
    HumanResourcesProvider,
    IAssignment,
    IHumanResource,
    IIdObject,
    IProject,
    IRealtimeMessage,
    IResource,
    ITaskComment,
    ITaskWithProgressDetails,
    PermissionAction,
    ProjectsProvider,
    ProjectStatus,
    RealtimeProvider,
    redirectTo404,
    TASK_STATUSES_BY_PROJECT_STATUS,
    TaskFields,
    TaskOrDeliverable,
    TasksProvider,
    TaskStatus,
    TaskType,
    TimeProvider,
} from 'communication';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormComponent, ItemsComponent, LoadingComponent, numbersFromEnum } from 'components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, filter, finalize, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { NotifierService } from 'notifier';
import { Translate } from 'translate';
import {
    IProjectMenuItemsContainer,
    MenuItemsContainer,
    ProjectDetailsContainerComponent,
} from '../../pages/projects/details-wrapper/project-details-container.component';
import { DateValidators } from 'date';
import { ProfileService } from '../../identify/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AssigneeComponent } from 'src/app/common-tasks/assignee/assignee.component';
import { MetaService } from '@ngx-meta/core';
import { ITaskCommentsParams } from '../../task-comments/task-comments/task-comments.component';
import { TaskCommentsManagerService } from '../../task-comments/task-comments-manager.service';
import { FIRST_PAGE_ASC_PARAMS, FIRST_PAGE_DESC_PARAMS } from '../task-comments';
import {
    IPermissionsDirectiveData,
    IProjectIdProvider,
    IProjectPermissionsManagerParams,
    PERMISSIONS_DIRECTIVE_DATA,
    PermissionsService,
    ProjectsPermissionsManager,
} from 'permissions';
import { PermissionsGuard } from '../../identify/permissions.guard';
import { CloudUploadComponent } from '../../ui/cloud/cloud-upload.component';
import { CloudConfigure, CloudUploadComponentUpdate } from '../service/cloud.configure';
import { acceptFile } from '../../helpers/const/regx';
import { IItem } from 'menu';
import { AssignmentsRealtimeActions } from '../../../../projects/communication/src/lib/services/http/http-assignments.provider';
import { AssignmentsStatusService, IUpdateAssignmentStatusMessage } from '../assignments-status.service';
import {
    AttachmentsProvider,
    IAttachment
} from "../../../../projects/communication/src/lib/services/common/attachments.provider";
import {TaskAttachmentsComponent} from "../task-attachments/task-attachments.component";

export interface ITaskWithCreator extends ITaskWithProgressDetails {
    creator: IHumanResource;
    project?: IProject;
}

const FORM_VALIDATORS = [DateValidators.dateLessThan('startDate', 'endDate')];

interface ITaskCommentsComponent extends ItemsComponent<ITaskComment> {
    loadLastComments: (params?: ITaskCommentsParams) => void;
}

interface IClassItem extends IItem {
    class?: string;
}

@Component({
    selector: 'app-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss'],
    providers: [
        ...Translate.localizeComponent('common-tasks'),
        {
            provide: LoadingComponent,
            useExisting: forwardRef(() => TaskDetailsComponent),
        },
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => TaskDetailsComponent),
        },
        CloudUploadComponent,
    ],
})
export class TaskDetailsComponent extends FormComponent<ITaskWithCreator> implements OnInit, IPermissionsDirectiveData, DoCheck {
    revertChangesOnError = true;
    TaskType = TaskType;
    TaskStatus = TaskStatus;
    ProjectStatus = ProjectStatus;
    taskStatuses = numbersFromEnum(TaskStatus);
    taskPriorities: IClassItem[] = [];
    taskActivityTypes: IClassItem[] = [];
    loadDataOnInit = false;
    loadDataOnParamsChange = true;
    autoSave = true;
    queryParam: any;
    shouldTaskBeHighlighted = TasksProvider.shouldBeHighlighted;
    patchFields = [TaskFields.EndDate, TaskFields.StartDate, TaskFields.Status];
    permissions = this._permissionsManager.permissions$;
    acceptFile: string[] = acceptFile;
    resources: IResource[];

    private _scrollContainer: ElementRef<HTMLElement>;
    private _commentsComponent: ITaskCommentsComponent;
    private _comments: ElementRef<HTMLElement>;
    private _assignmentsComponent: AssigneeComponent;

    @Output()
    navigateBack = new EventEmitter();

    @ViewChild('cloud', {static: false}) cloud: CloudUploadComponentUpdate;
    @ViewChild('context', {static: false}) context: ElementRef;
    private itemChecked: boolean = false;

    @ViewChild('scroll', {static: false})

    set scrollContainer(value: ElementRef<HTMLElement>) {
        if (!this._scrollContainer) {
            this._scrollContainer = value;
            this.taskCommentsManager.init(this);
        }
    }

    get scrollContainer() {
        return this._scrollContainer;
    }

    get taskCompleted(): boolean {
        return this.item.status === TaskStatus.Completed;
    }

    @ViewChild('commentsComponent', {static: false})
    set commentsComponent(value: ITaskCommentsComponent) {
        if (!this._commentsComponent) {
            this._commentsComponent = value;
        }
    }

    get commentsComponent() {
        return this._commentsComponent;
    }

    @ViewChild('commentsContainer', {static: false, read: ElementRef})
    set comments(value: ElementRef<HTMLElement>) {
        if (!this._comments) {
            this._comments = value;
            this.taskCommentsManager.init(this);
        }
    }

    get comments() {
        return this._comments;
    }


    @ViewChild(AssigneeComponent, {static: false})
    set assignments(value: AssigneeComponent) {
        this._assignmentsComponent = value;
    }

    get infiniteScrollDownDisabled() {
        const {taskCommentsManager, loading, commentsComponent} = this;
        return taskCommentsManager.infiniteScrollDisabled || loading || commentsComponent && commentsComponent.loading;
    }

    get isTaskActive() {
        return TasksProvider.isTaskActive(this.item);
    }

    get isProjectActive() {
        if (this.item) {
            return ProjectsProvider.isProjectActive(this.project);
        }
    }

    get isTypeTask() {
        return this.item && this.item.type === TaskType.Task;
    }

    get project() {
        return this.item && this.item.project;
    }

    get projectStatus() {
        return this.project && this.project.status;
    }

    // edit state for all task controls
    get taskEditDisabled() {
        const taskStatus = this.item.status;
        return !this.isProjectActive || taskStatus === TaskStatus.Archived;
    }

    get taskControlEditDisabled() {
        const taskStatus = this.item.status;
        const projectStatus = this.project.status;

        if (projectStatus === ProjectStatus.Draft) {
            // disabled control edit if task is not draft
            return taskStatus !== TaskStatus.Draft;
        }

        if (projectStatus === ProjectStatus.InProgress) {
            return ![TaskStatus.Requested, TaskStatus.InProgress].includes(taskStatus);
        }

        return true;
    }

    get startDateDisabled() {
        const taskStatus = this.item.status;
        const projectStatus = this.project.status;

        if (projectStatus === ProjectStatus.Draft) {
            return taskStatus !== TaskStatus.Draft;
        }

        if (projectStatus === ProjectStatus.InProgress) {
            return taskStatus !== TaskStatus.Requested;
        }

        return true;
    }

    get taskStatusEditDisabled() {
        const taskStatus = this.item.status;
        const projectStatus = this.project.status;

        if (projectStatus === ProjectStatus.InProgress) {
            return ![TaskStatus.Requested, TaskStatus.InProgress, TaskStatus.Completed, TaskStatus.Canceled].includes(taskStatus);
        }

        return true;
    }

    get workCompletedEditDisabled() {
        const projectStatus = this.project.status;
        const taskStatus = this.item.status;

        if (projectStatus === ProjectStatus.InProgress) {
            return taskStatus !== TaskStatus.InProgress;
        }

        return true;
    }

    get scrollDistance() {
        return this.taskCommentsManager.scrollToTopDistance;
    }

    get taskId() {
        const params = this.route.snapshot.params as IIdObject;
        return params.id;
    }

    get projectId() {
        const parentParams = this.route.parent && this.route.parent.snapshot.params as IIdObject;
        const queryParams = this.route.snapshot.queryParams as IProjectIdProvider;

        if (parentParams && parentParams.id) {
            return parentParams.id;
        } else if (queryParams.projectId) {
            return queryParams.projectId;
        }
    }

    get creatorId() {
        return this.item && this.item.creatorId;
    }

    get formRawValue(): Partial<ITaskWithCreator> {
        return this.form && this.form.getRawValue();
    }

    get membersIds() {
        return this.item && this.item.assignments ?
            this.item.assignments.map(member => member.resourceId) : [];
    }

    constructor(protected _provider: TasksProvider,
                private _projectProvider: ProjectsProvider,
                private _usersProvider: HumanResourcesProvider,
                public _profileService: ProfileService,
                protected _route: ActivatedRoute,
                protected _router: Router,
                protected _metaService: MetaService,
                public taskCommentsManager: TaskCommentsManagerService,
                private _location: Location,
                protected _notifier: NotifierService,
                public _permissionsManager: ProjectsPermissionsManager,
                private _permissionsService: PermissionsService,
                private _fb: FormBuilder,
                private _assignmentsProvider: AssignmentsProvider,
                private _assignmentsStatusService: AssignmentsStatusService,
                private _timeProvider: TimeProvider,
                private _cloudConfigure: CloudConfigure,
                private _permissionsGuard: PermissionsGuard,
                @Optional() @Inject(ProjectDetailsContainerComponent) public parent: ProjectDetailsContainerComponent,
                @Optional() @Inject(MenuItemsContainer) private _menuItemsContainer: IProjectMenuItemsContainer,
    ) {
        super();

        this.loadingHandler = parent;

        if (_menuItemsContainer) {
            _menuItemsContainer.setItems([
                _menuItemsContainer.getDeleteMenuItem(),
            ]);
        }

        _projectProvider.update$.subscribe((message: IRealtimeMessage<IProject>) => {
            const project = message && message.payload;

            if (project && project.id === this.project.id) {
                this.handleProjectChange(project);
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadSelectsData();

        this._projectProvider.update$
            .pipe(untilDestroyed(this))
            .subscribe(project => {
                this.handleProjectChange(project.payload);
            });

        this._assignmentsStatusService.updateCompletedStatus$.pipe(
            filter(payload => payload.taskId === this.item.id),
            untilDestroyed(this),
        ).subscribe(assignment => {
            this._handleUpdateAssignmentsStatus(assignment);
        });

        this._initResourcesSubscription();
    }

    loadSelectsData() {
        const hide = this.showLoading();

        forkJoin([
            this._provider.getTaskPriorities(),
            this._provider.getTaskTypes(),
        ]).pipe(
            finalize(hide),
        ).subscribe(([priorities, types]) => {
            this.taskPriorities = priorities.map(priority => ({
                title: `priority.${priority.name}`,
                value: priority.id,
                class: priority.name,
            }) as IItem);

            this.taskActivityTypes = types.map(priority => ({
                title: `activityType.${priority.name}`,
                value: priority.id,
                class: priority.name,
            }) as IItem);
        });
    }

    onScroll(e) {
        if (!this.taskCommentsManager.descending) {
            this.commentsComponent.loadData();
        }
    }

    onScrollUp(e) {
        if (this.taskCommentsManager.descending) {
            this.commentsComponent.loadData();
        }
    }

    toLastComments() {
        this.commentsComponent.loadData(FIRST_PAGE_DESC_PARAMS);
    }

    toFirstComments() {
        this.commentsComponent.loadData(FIRST_PAGE_ASC_PARAMS);
    }

    public getTranslateByType(key: string) {
        if (key != null && this.item) {
            return this._getTranslateKey(`task-type.${this.item.type}.${key}`);
        }
    }

    public getDto(): ITaskWithCreator {
        // clear dto from redundant data
        const {project, assignments, creator, ...rest} = super.getDto();
        return rest as ITaskWithCreator;
    }

    public handleProjectChange(updatedProject: IProject) {
        if (this.item) {
            const project = {...this.item.project, ...updatedProject};

            this.item = {...this.item, project};
            this.updateAvailableStatuses();
        }
    }

    public updateAvailableStatuses() {
        const status = this.item.status;
        const availableStatuses = TASK_STATUSES_BY_PROJECT_STATUS[this.projectStatus];

        if (availableStatuses) {
            this.taskStatuses = availableStatuses[status];
        }
    }

    private _canActivateComponent() {
        this._permissionsGuard.canActivateByPermissionsData(PermissionAction.ViewTaskById, {
            membersIds: this.membersIds,
            creatorId: this.creatorId,
        });
    }

    private setTaskStatus(status: TaskStatus, updateTaskModel = true) {
        const statusControl = this.controls.status;
        const statusDisabled = statusControl.disabled;

        if (statusDisabled) {
            statusControl.enable({emitEvent: false});
        }

        statusControl.setValue(status, {emitEvent: false});

        if (statusDisabled) {
            statusControl.disable({emitEvent: false});
        }

        if (updateTaskModel)
            this.item = {...this.item, status};

        this.updateAvailableStatuses();
    }

    protected _handleFormInvalidError(errors: any) {
        const startDateError = this.errors.currentStartDate;

        if (startDateError) {
            this.notifier.showError(startDateError);
        }
    }

    protected _handleUpdateItem(item: ITaskWithCreator): boolean {
        const result = super._handleUpdateItem(item);
        if (!result)
            return false;

        this.updateAvailableStatuses();
        this.handleTypeChange(item);
        return result;
    }

    protected createForm(): FormGroup {
        return this._fb.group({
            name: new FormControl('', {
                updateOn: 'blur',
                validators: [Validators.required],
            }),
            status: [null, Validators.required],
            description: new FormControl('', {
                updateOn: 'blur',
            }),
            [TaskFields.StartDate]: getDateControlData(),
            [TaskFields.EndDate]: getDateControlData(),
            priorityId: [null],
            activityTypeId: [null],
        }, {
            validators: FORM_VALIDATORS,
        });
    }

    _handleDeleteItem(item) {
        this.navigateOnTaskClosed();
    }

    protected _getItem(): Observable<ITaskWithCreator> {
        return this.getProject().pipe(
            switchMap((project) => super._getItem(this.taskId)
                .pipe(
                    catchError(err => redirectTo404(err, this.router)),
                    catchError(err => {
                        this._canActivateComponent();
                        return catchError(err);
                    }),
                    flatMap(task => {
                        const memberIds = task.assignments.map(i => i.resourceId);
                        memberIds.push(task.creatorId);

                        return this._usersProvider.getBaseItemsByIds(memberIds).pipe(
                            tap((resources: IResource[]) => this.resources = resources),
                            map((resources) => resources.find(i => i.id === task.creatorId)),
                            map((creator) => {
                                return {
                                    ...task,
                                    creator,
                                    project,
                                };
                            }),
                        );
                    }),
                ),
            ));
    }

    protected getProject(): Observable<IProject> {
        if (this.parent && this.parent.item) {
            return of(this.parent.item);
        }

        return this._projectProvider.getItemById(this.projectId);
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return {
            projectId: +this.projectId,
        };
    }

    protected handleItem(item: ITaskWithCreator): void {
        super.handleItem(item);

        this._canActivateComponent();

        this.setTaskStatus(item.status, false);
        this.handleTypeChange(item);
    }

    // handle Task/Deliverable controls

    private handleTypeChange(item: TaskOrDeliverable): void {
        if (item === this.item || isTypeChanged(this.item, item)) {
            const dateControl = this.form.get(TaskFields.StartDate);
            const isTypeTask = this.item && this.isTypeTask;

            if (isTypeTask) {
                this.form.setValidators(FORM_VALIDATORS);
                dateControl.enable({emitEvent: false});
            } else if (!isTypeTask) {
                this.form.clearValidators();
                dateControl.disable({emitEvent: false});
            }
        }
    }

    private _initResourcesSubscription(): void {
        merge(
            this._assignmentsProvider.create$,
            this._assignmentsProvider.delete$,
        ).pipe(
            map(data => data.payload),
            filter(payload => {
                if (Array.isArray(payload)) {
                    return payload.some(p => p.taskId === this.item.id);
                } else {
                    return payload.taskId === this.item.id;
                }
            }),
            switchMap(() => this._usersProvider.getBaseItemsByIds(this.membersIds)),
            untilDestroyed(this),
        ).subscribe((resources: IResource[]) => this.resources = resources);
    }

    private _handleUpdateAssignmentsStatus(assignment: IUpdateAssignmentStatusMessage) {
        const updatedAssignment = this.item.assignments.find(i => i.resourceId === assignment.resourceId);
        updatedAssignment.status = assignment.status;

        const assignmentsCompleted = this.item.assignments.every(i => i.status === AssignmentStatus.Completed);
        // update task status if all assignments completed
        this.setTaskStatus(assignmentsCompleted ? TaskStatus.Completed : TaskStatus.InProgress, true);
    }

    navigateOnTaskClosed(): void {
        if (this.navigateBack.observers.length)
            this.navigateBack.emit(null);
        else
            this.router.navigate(['../'], {
                relativeTo: this._route,
            });

    }

    priorityClass(item: string): string {
        return item.toLowerCase();
    }

    ngDoCheck() {
        if (!this.itemChecked && this.isProjectActive && this.cloud) {
            this.itemChecked = true;
            this._cloudConfigure.setCustomFunctionToCloud(this.cloud);
        }
    }

    deletePriority($event) {
        $event.stopPropagation();
        this.controls.priorityId.patchValue(null);
    }

    deleteTaskType($event) {
        $event.stopPropagation();
        this.controls.activityTypeId.patchValue(null);
    }
}

function getDateControlData() {
    return [null, Validators.required];
}

function isTypeChanged(item: TaskOrDeliverable, newItem: TaskOrDeliverable): boolean {
    const type = item && item.type;
    const newType = newItem && newItem.type;

    return newType && type !== newType;
}
