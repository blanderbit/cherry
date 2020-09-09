import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import {
    AssignmentsProvider,
    AssignmentStatus,
    IAssignment, IBasicTask,
    IDeliverable,
    IResource,
    ITask,
    PermissionAction,
    ProjectsProvider, ResourceKind, ResourcesProvider,
    TasksProvider,
    TaskStatus,
    TaskType,
} from 'communication';
import { NotifierService } from 'notifier';
import { ItemsComponent } from 'components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAssigneeComponent, TaskId } from '../add-assignee/add-assignee.component';
import { ActivatedRoute } from '@angular/router';
import { Translate } from 'translate';
import { AddTimeComponent, IAddTimeComponentParams } from 'src/app/common-tasks/add-time/add-time.component';
import { AddEffortComponent, IAddEffortDialogParams } from 'src/app/common-tasks/plan-effort/add-effort.component';
import { ProfileService } from 'src/app/identify/profile.service';
import { Helpers } from '../../helpers';
import { EditTimeDialogComponent } from '../edit-time-dialog/edit-time-dialog.component';
import { ITaskWithCreator } from '../task-details/task-details.component';
import { IPermissionsDirectiveData, PERMISSIONS_DIRECTIVE_DATA, PermissionsService } from 'permissions';
import { ResourceId } from './index';
import { AssignmentsStatusService } from '../assignments-status.service';
import { ProjectId } from '../token/token';

const DELIVERABLE_MAX_ASSIGNEE = 1;

@Component({
    selector: 'app-task-assignments',
    templateUrl: './assignee.component.html',
    styleUrls: ['./assignee.component.scss'],
    providers: [
        Translate.localizeComponent('common-tasks'),
        {
            provide: PERMISSIONS_DIRECTIVE_DATA,
            useExisting: forwardRef(() => AssigneeComponent),
        },
    ],
})
export class AssigneeComponent extends ItemsComponent<IAssignment, any> implements OnInit, IPermissionsDirectiveData {
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = false;

    private _task: ITaskWithCreator;
    private _projectId: number;
    public assignmentStatus = AssignmentStatus;
    public taskStatus = TaskStatus;
    public helpers = Helpers;
    public hideTimeReport = false;
    public membersIds: number[];
    action = PermissionAction;
    resourceItems: IResource[] = [];

    @Input() set task(value: ITaskWithCreator) {
        if (value) {
            this._task = value;
            this.items = value.assignments.map(assignment => AssignmentsProvider.getAssignment({
                ...assignment,
                taskId: value.id,
            }));


            this.handleTaskType(value);
        }
    }

    get task(): ITaskWithCreator {
        return this._task;
    }

    get items(): IAssignment[] {
        return this.task ? this.task.assignments : [];
    }

    set items(value: IAssignment[]) {

        if (this.task) {
            this.task.assignments = value;

            this.membersIds = this.task.assignments.map(assignment => assignment.resourceId);
            this._resourcesProvider.getAssignedItemsById({ids: this.membersIds})
                .subscribe((items: IResource[]) => {
                    this.resourceItems = items;
                });

        }
    }

    @Input() disableAdd = false;

    @Input() materialResources: boolean = false;
    @Input() title: string;
    get taskId(): number {
        return this.task && this.task.id;
    }

    @Input()
    set projectId(value: number) {
        this._projectId = value;
    }

    get projectId() {
        return this._projectId;
    }

    get cancelled() {
        return this.task && this.task.status === TaskStatus.Canceled;
    }

    get draft() {
        return this.task && this.task.status === TaskStatus.Draft;
    }

    get active() {
        return this.isTaskActive && this.isCurrentProjectActive;
    }

    get isCurrentProjectActive() {
        return ProjectsProvider.isProjectActive(this.task.project);
    }

    get isTaskActive() {
        return TasksProvider.isTaskActive(this.task);
    }

    get assignment() {
        return this.items.find(a => a.resourceId === this.profile.resourceId);
    }

    get assignmentCompleted(): boolean {
        return this.assignment && this.assignment.status === AssignmentStatus.Completed;
    }

    get allAssignmentsCompleted(): boolean {
        return this.items.every(i => i.status === AssignmentStatus.Completed);
    }

    get isTypeTask() {
        return this.task && this.task.type === TaskType.Task;
    }

    get isAddAssigneeDisabled() {
        // deliverable can have only 1 assignee
        return !this.isTypeTask && this.items.length >= DELIVERABLE_MAX_ASSIGNEE;
    }

    get creatorId() {
        return this._task.creatorId;
    }

    get resourceId() {
        return this.profile.resourceId;
    }

    get filteredItems(): IAssignment[] {
        return this.items.filter(({resourceId}: IAssignment): boolean =>
            this.resourceItems.some(({id, kind}: IResource): boolean => {
                if (id !== resourceId) {
                    return false;
                }

                if (!this.materialResources) {
                    return [ResourceKind.Human, ResourceKind.Generic].includes(kind);
                } else {
                    return kind === ResourceKind.Material;
                }
            })
        );
    }

    get addAssigneeButtonTitleName() {
        if (!this.materialResources) {
            return (!this.filteredItems.length) ? `assignee.empty` : `assignee.add`;
        } else {
            return `assignee.add-resources`;
        }
    }

    get changeAssignmentStatusAvailable() {
        return AssignmentsStatusService.changeAssignmentStatusAvailable(this.task);
    }

    get isHideResourcesComponent() {
        return !this.isTaskActive
            && this.filteredItems
            && !this.filteredItems.length;
    }

    constructor(private _assignmentsProvider: AssignmentsProvider,
                protected _provider: AssignmentsProvider,
                protected _projectsProvider: ProjectsProvider,
                protected _tasksProvider: TasksProvider,
                protected _notifier: NotifierService,
                protected _injector: Injector,
                protected _route: ActivatedRoute,
                protected _permissionsService: PermissionsService,
                public profile: ProfileService,
                protected _resourcesProvider: ResourcesProvider,
                protected _ngbModal: NgbModal) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getUserFromResources(resourceId: number): IResource | Object {
        if (!resourceId) {
            return {};
        }
        return this.resourceItems.find(({id}) => id === resourceId);
    }

    protected _handleCreateItem(item: IAssignment[] | IAssignment) {
        if (!Array.isArray(item) && item.taskId !== this.taskId)
            return;

        super._handleCreateItem(item);
    }

    public handleTaskType(task: ITask | IDeliverable) {
        if (task && task.type === TaskType.Deliverable) {
            this.hideTimeReport = true;
        }
    }

    public isAssigneeRemovable(assignment: IAssignment): boolean {
        const actualTimeAdded = !!assignment.actualTime;
        const accessByPermission = this._permissionsService.hasPermissions(this.permissionAction.DeleteAssignment, {
            creatorId: this.creatorId,
            membersIds: [assignment.resourceId],
        });

        return !actualTimeAdded && accessByPermission && this.isTaskActive;
    }

    public isAssigneeRemoveDisabled(assignment: IAssignment) {
        if (this.task && assignment) {
            return this.loading || !this.isCurrentProjectActive ||
                !this.isTaskActive || assignment.actualTime;
        }

        return false;
    }

    addAssignee() {
        if (this.disableAdd) {
            return;
        }

        const ref: AddAssigneeComponent = this._ngbModal.open(AddAssigneeComponent, {
            windowClass: 'add-assignee-dialog',
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: ProjectId,
                        useValue: this.projectId,
                    },
                ],
            }),
        }).componentInstance;

        ref.task = this.task;
        ref.materialResources = this.materialResources;
    }

    addEffort() {
        const ref = this._ngbModal.open(AddEffortComponent);

        const instance = <IAddEffortDialogParams>ref.componentInstance;

        instance.assignments = this.items as any;
        instance.task = this.task;
        instance.projectStatus = this.task.project.status;
    }

    addTime(assignment: IAssignment) {
        const ref = this._ngbModal.open(AddTimeComponent, {
            injector: Injector.create({
                parent: this._injector,
                providers: [],
            }),
        });

        const instance = <IAddTimeComponentParams>ref.componentInstance;
        instance.userAssignment = assignment;
        instance.task = this.task;
    }

    editTime(assignment: IAssignment) {
        const ref = this._ngbModal.open(EditTimeDialogComponent, {
            // size: 'lg',
            windowClass: 'edit-time-dialog',
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: TaskId,
                        useValue: this.task && this.task.id,
                    },
                    {
                        provide: ResourceId,
                        useValue: assignment.resourceId
                    }
                ],
            }),
        });

        const instance = <IAddTimeComponentParams>ref.componentInstance;
        instance.task = this.task;
    }


    public isAddTimeVisible(item: IAssignment): boolean {
        if (!item || !this.task) {
            return false;
        }

        const assignmentStatus = [AssignmentStatus.InProgress, AssignmentStatus.Requested].includes(item.status);
        const taskStatus = [TaskStatus.InProgress, TaskStatus.Requested].includes(this.task.status);

        return taskStatus && assignmentStatus;
    }

    protected _showSuccessDelete(): void {
        this.showSuccess('action.success-delete');
    }

    public trackById(index: number, item: IResource) {
        return item.id;
    }
}
