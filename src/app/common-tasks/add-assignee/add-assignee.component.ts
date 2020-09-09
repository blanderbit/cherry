import { Component, Inject, InjectionToken, Input, OnInit, Optional } from '@angular/core';
import {
    AssignmentsProvider,
    IAssignment,
    IBaseTask, IBasicProject,
    IProjectMember,
    IResource,
    ProjectsProvider,
    ResourceKind,
    ResourcesProvider,
    TasksProvider,
    TaskType,
} from 'communication';
import { NotifierService } from 'notifier';
import { ItemsComponent } from 'components';
import { forkJoin, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Translate } from 'translate';
import { ProjectId } from '../token/token';

export const TaskId = new InjectionToken('taskId');

interface IUserWithPlannedEffort extends IResource {
    plannedEffort?: number;
}

interface IAddAssigneeDialogParams {
    maxAssigneeCount?: number;
    task: IBaseTask;
}

@Component({
    selector: 'app-add-assignee',
    templateUrl: './add-assignee.component.html',
    styleUrls: ['./add-assignee.component.scss'],
    providers: Translate.localizeComponent('common-tasks'),
})
export class AddAssigneeComponent extends ItemsComponent<IResource, any> implements OnInit, IAddAssigneeDialogParams {
    private _task: IBaseTask;
    MAX_TIME_EFFORT = 999 * 60;
    items: IUserWithPlannedEffort[];
    searchControl = new FormControl();
    showSuggestions = false;
    submitLoading = false;
    projectMembers: IProjectMember[] = [];
    loadDataOnInit = false;
    loadDataOnParamsChange = false;

    @Input()
    public selectedResources: IResource[] = [];

    @Input()
    public materialResources: boolean = false;

    @Input()
    public onSubmit: (items: IResource[]) => any;

    @Input()
    set task(value: IBaseTask) {
        this._task = value;
    }

    get task() {
        return this._task;
    }

    get taskId() {
        return this.task && this.task.id;
    }

    get selectedUsersIds() {
        return this.selectedResources.map(user => user.id);
    }

    get isDeliverable() {
        return this.task && this.task.type === TaskType.Task;
    }

    get maxAssigneeCount() {
        // deliverable can have only one assignment
        if (this.task && this.task.type === TaskType.Deliverable) {
            return 1;
        }
    }

    get isButtonAddAssignee() {
        return !this.materialResources ? 'assignee.add-assignee' : 'assignee.add-resource-assignee';
    }

    get assignments(): IAssignment[] {
        return this.task ? this.task.assignments : [];
    }

    get projectId(): number {
        return this._projectId;
    }

    constructor(protected _assignmentsProvider: AssignmentsProvider,
                protected _notifier: NotifierService,
                protected _provider: ResourcesProvider,
                protected _projectsProvider: ProjectsProvider,
                protected _route: ActivatedRoute,
                protected _ngbModal: NgbModal,
                protected _router: Router,
                protected _tasksProvider: TasksProvider,
                @Optional() @Inject(ProjectId) protected _projectId: number,
    ) {
        super();
    }

    ngOnInit(): void {
        this.loadInitialData()
            .subscribe(() => this.loadData());

        super.ngOnInit();

        this.searchControl
            .valueChanges
            .pipe(
                debounceTime(400), distinctUntilChanged(),
            ).subscribe((search) => this.loadData({search}));
    }

    loadData(params?: any) {
        super.loadData(params);
    }

    loadInitialData() {
        const hide = this.showLoading();
        console.log('PROJECTID', this.projectId);
        return this._projectsProvider.getMembers(this.projectId).pipe(
            finalize(() => hide()),
            catchError(() => {
                this._notifier.showError('action.no-members');
                return of([]);
            }),
            tap((projectMembers) => {
                this.projectMembers = projectMembers;
                this.showSuggestions = true;
            })
        );
    }

    protected _getItems(params?: any): Observable<IResource[]> {
        if (!this.taskId && !this.projectId)
            return of([]);

        // for deliverable only human resource can be assigned
        if (!this.isDeliverable) {
            params = {...params, kind: ResourceKind.Human};
        } else if (this.materialResources) {
            params = {...params, kind: ResourceKind.Material};
        }

        return super._getItems(params)
            .pipe(
                map((users: IResource[]): IResource[] => this.getItemsByType(users)),
                map(users => filterUsers([this.assignments, users, this.projectMembers.map(item => item.id)])),
            );
    }

    getItemsByType(users: IResource[]): IResource[] {
        return !this.materialResources
            ? users.filter(({kind}: IResource): boolean => kind === ResourceKind.Human || kind === ResourceKind.Generic)
            : users;
    }

    onSearchFocus() {
        this.showSuggestions = true;
    }

    cancel() {
        this._ngbModal.dismissAll();
    }

    apply() {
        if (this.onSubmit) {
            this.onSubmit(this.selectedResources);
            this._ngbModal.dismissAll();
        } else {
            this.submitLoading = true;

            this._assignmentsProvider.createItems(this.taskId,
                this.selectedResources.map(user => ({resourceId: user.id, plannedTime: user['plannedEffort'] || 0})))
                .pipe(
                    finalize(() => {
                        this.submitLoading = false;
                        this._ngbModal.dismissAll();
                    }),
                ).subscribe(
                (res) => {
                    this._notifier.showSuccess('action.success-assignee');
                },
                (err) => this._notifier.showError(err, 'action.error-assignee'),
            );
        }
    }

    addAssignee(user: IResource) {
        this.selectedResources.push(user);
        this._handleDeleteItem(user);
    }

    removeAssignee(user: IResource) {
        const index = this.selectedResources.indexOf(user);

        if (index === -1)
            return;

        this.selectedResources.splice(index, 1);
        this._handleCreateItem(user);
    }

    onUserSelect(user: IResource) {
        const {selectedResources, maxAssigneeCount} = this;

        if (maxAssigneeCount && selectedResources.length >= maxAssigneeCount) {
            selectedResources.pop();
        }

        const itemAlreadySelected = selectedResources.find((u) => u.id === user.id);

        if (itemAlreadySelected) {
            this.selectedResources = selectedResources.filter((u) => u.id !== user.id);
        } else {
            this.selectedResources.push(user);
        }
    }
}

function filterUsers([assignments, users, projectMembersIds]: [IAssignment[], IResource[], number[]]) {
    return users.filter(({id}) =>
        projectMembersIds.map(Number).includes(+id) &&
        assignments.every(({resourceId}) => resourceId !== id)
    );
}
