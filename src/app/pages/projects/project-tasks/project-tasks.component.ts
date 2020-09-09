import {AfterContentInit, AfterViewInit, Component, forwardRef, Inject, OnInit, Optional} from '@angular/core';
import {ColDef, GridOptions, RowClickedEvent} from 'ag-grid-community';
import {
    AssignmentsProvider,
    HumanResourcesProvider,
    IAssignment,
    IBaseTask,
    IBasicProject,
    IHumanResource,
    IIdObject,
    IProject,
    IRealtimeMessage,
    ITask,
    nullIfError,
    PermissionAction,
    ProjectsProvider,
    ProjectStatus,
    TaskFields,
    TaskOrDeliverable,
    TasksProvider,
    TaskStatus,
} from 'communication';
import {NotifierService} from 'src/app/notifier/notifier.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, flatMap, map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {
    IProjectMenuItemsContainer,
    MenuItemsContainer,
    ProjectDetailsContainerComponent,
} from '../details-wrapper/project-details-container.component';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {GridItemsComponent} from 'grid';
import {TasksCreateService} from 'src/app/create/tasks-create.service';
import {ProfileService} from 'src/app/identify/profile.service';
import {GridService} from '../../../ui/ag-grid/grid.service';
import {IItem} from 'menu';
import {IPermissionsDirectiveData, IProjectIdProvider, PermissionsService, ProjectsPermissionsManager} from 'permissions';
import {GRID_COLUMN_DEFS_MAP, GRID_CONTAINER_OPTIONS, IGridContainerOptions} from '../../../ui/ag-grid/grid-container/token';
import {getTaskAssignmentsCol, getTaskColDefByField, TaskField, TASKS_COL_DEFS_MAP} from '../../../common-tasks/grid/task-columns';
import {PermissionsGuard} from '../../../identify/permissions.guard';
import {AttachmentsService} from '../../../common-tasks/service/attachment.service';
import {TasksList} from '../../tasks';
import { AssignmentsStatusService } from '../../../common-tasks/assignments-status.service';

export interface IDetailedTask extends ITask {
    assignee?: IAssignment[];
    assignedUsers?: IHumanResource[];
    project?: IBasicProject;
    creator?: Partial<IHumanResource>;
    members?: number[];
    effort?: number;
}

@Component({
    selector: 'app-project-tasks',
    templateUrl: './project-tasks.component.html',
    styleUrls: ['./project-tasks.component.scss'],
    providers: [
        {
            provide: TasksList,
            useExisting: forwardRef(() => ProjectTasksComponent),
        },
        {
            provide: GRID_COLUMN_DEFS_MAP,
            useValue: TASKS_COL_DEFS_MAP,
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: 'tasks-table',
                hiddenColumns: ['project'],
                translateColumns: true,
            } as IGridContainerOptions<TaskOrDeliverable & IDetailedTask>,
        },
    ],
})
export class ProjectTasksComponent extends GridItemsComponent<TaskOrDeliverable, any> implements OnInit, AfterContentInit, AfterViewInit {
    private _project: IProject;

    readonly hideCompletedTasksMenuItem = {
        title: 'details.hide',
        icon: 'hide',
        action: () => this.toggleFilterCompletedTasks(),
    };


    readonly showCompletedTasksMenuItem = {
        title: 'details.showAll',
        icon: 'show-completed-tasks',
        action: () => this.toggleFilterCompletedTasks(),
    };

    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = true;
    items: ITask[] = null;
    completedTasksHidden = false;
    TaskStatus = TaskStatus;
    gridOptions: GridOptions & any = {
        isExternalFilterPresent: () => true,
        doesExternalFilterPass: this.doesExternalFilterPass.bind(this),
        onRowClicked: this.onRowClicked.bind(this),
    };
    noRowsParams = {class: 'task-overlay', img: 'no-task-content.png'};

    columnDefs: (ColDef | TaskField)[] = [
        'wbs',
        'name',
        'currentStartDate',
        'currentEndDate',
        {
            ...getTaskAssignmentsCol(),
            minWidth: null,
        } as ColDef,
        'creator',
        'status',
        {
            ...getTaskColDefByField('plannedTime'),
            permissionAction: PermissionAction.ViewTaskGridPlannedTime,
        },
        {
            ...getTaskColDefByField('actualTime'),
            permissionAction: PermissionAction.ViewTaskGridActualTime,
        },
        'project',
    ];

    set menuItems(value: IItem[]) {
        if (this._menuItemsContainer) {
            this._menuItemsContainer.menuItems = value;
        }
    }

    get menuItems() {
        if (this._menuItemsContainer) {
            return this._menuItemsContainer.menuItems;
        }
    }

    get project(): IProject {
        if (this._parent) {
            return this._parent.item;
        }

        return this._project;
    }

    get shouldShowCreateTask() {

        return this.project &&
            ![ProjectStatus.Archived,
                ProjectStatus.Completed,
                ProjectStatus.Canceled].includes(this.project.status);
    }

    get membersIds() {
        return this.project.members.map(member => member.id);
    }

    get creatorId() {
        return this.project.creatorId;
    }

    set project(value: IProject) {
        this._project = value;
    }

    get isProjectActive() {
        return ProjectsProvider.isProjectActive(this.project);
    }

    get projectId() {
        if (this.project) {
            return this.project && this.project.id;
        }

        return +(<IIdObject>this._route.parent.snapshot.params).id;
    }

    constructor(protected _provider: TasksProvider,
                protected _notifier: NotifierService,
                protected _route: ActivatedRoute,
                protected _profileService: ProfileService,
                protected _router: Router,
                protected _assignmentsProvider: AssignmentsProvider,
                protected _assignmentStatusService: AssignmentsStatusService,
                protected _usersProvider: HumanResourcesProvider,
                protected _projectsProvider: ProjectsProvider,
                protected _permissionsManager: ProjectsPermissionsManager,
                protected _permissionsService: PermissionsService,
                protected _createService: TasksCreateService,
                protected _gridService: GridService,
                private _permissionsGuard: PermissionsGuard,
                @Optional() @Inject(ProjectDetailsContainerComponent) private _parent: ProjectDetailsContainerComponent,
                @Optional() @Inject(MenuItemsContainer) private _menuItemsContainer: IProjectMenuItemsContainer,
                private attachmentsService: AttachmentsService,
    ) {
        super();
        this.loadingHandler = _parent;
    }

    onRowClicked(event: RowClickedEvent): void {
        const permissionsData: IPermissionsDirectiveData = {
            creatorId: event.data.creatorId,
            membersIds: (event.data.assignments || []).map(i => i.resourceId),
        };

        if (!this._canNavigateToTask(permissionsData)) return;

        const item = event.data as IBaseTask;
        this._navigateToTask(item.id, item.projectId);
    }

    protected shouldHandleRealtimeCreate(message: IRealtimeMessage<TaskOrDeliverable>): boolean {
        return message.payload.projectId === (this.project && this.project.id);
    }

    getFilteredColumns(excludeColumns: (TaskFields | keyof IDetailedTask)[], container = this.columnDefs) {
        return (container).filter(col => !excludeColumns.includes(typeof col === 'object' ? <TaskFields>col.field : <TaskFields>col));
    }

    ngOnInit(): void {
        super.ngOnInit();
        this._canActivateComponent();

        this._projectsProvider.update$
            .pipe(untilDestroyed(this), filter(({id}) => this.project && this.project.id === id))
            .subscribe((project) => {
                const isSomeTaskUncompleted = this.items.some(task => task.status !== TaskStatus.Completed);
                const status = project.status;

                if ((status === ProjectStatus.Completed && isSomeTaskUncompleted) || status === ProjectStatus.InProgress)
                    this.loadData();
            });
    }

    ngAfterViewInit() {
        if (this._menuItemsContainer) {
            this._menuItemsContainer.setItems([this.hideCompletedTasksMenuItem, this._parent.getDeleteMenuItem()]);
        }
    }

    toggleFilterCompletedTasks() {
        const api = this.grid.gridApi;
        this.completedTasksHidden = !this.completedTasksHidden;

        setTimeout(() => {
            this.menuItems[0] = this.completedTasksHidden ?
                this.showCompletedTasksMenuItem : this.hideCompletedTasksMenuItem;
        });
        if (api) {

            api.onFilterChanged();
        }
    }

    doesExternalFilterPass(node) {
        if (this.completedTasksHidden) {
            return node.data.status !== TaskStatus.Completed;
        }

        return true;
    }

    protected _canActivateComponent() {
        this._permissionsGuard.canActivateByPermissionsData(PermissionAction.ViewTasksByProject, {
            membersIds: this.membersIds,
            creatorId: this.creatorId,
        });
    }

    protected _canNavigateToTask(permissionsData: IPermissionsDirectiveData): boolean {
        return this._permissionsService.hasPermissions(this.permissionAction.ViewTaskById, permissionsData);
    }

    protected _navigateToTask(relativePath: string | number, projectId: string | number): void {
        this._router.navigate([relativePath], {
            queryParams: {
                projectId: projectId,
            } as IProjectIdProvider,
            relativeTo: this._route,
        });
    }

    protected _handleCreateItem(item: IDetailedTask) {
        if (this._profileService.profile.resourceId === item.creatorId) {
            forkJoin(this._usersProvider.getBaseItemById(item.creatorId),
                this._projectsProvider.getBaseItemsByIds([item.projectId]))
                .subscribe(([user, projects]) => {
                    item.creator = user;
                    item.project = projects[0];
                    super._handleCreateItem(item);
                });
        }
    }

    protected _handleRealtimeCreateItem(message: IRealtimeMessage<TaskOrDeliverable>) {
        if (message && message.payload && this.shouldHandleRealtimeCreate(message))
            super._handleRealtimeCreateItem(message);
    }

    createTask() {
        const { projectId } = this;

        if ( projectId ) {
            this._createService.create({ projectId });
        }
        else {
            this._notifier.showWarning('list.selectProject');
        }
    }


    protected _handleLoadingError(error: any) {
        console.log('error in tasks component');
        super._handleLoadingError(error);
        return null;
    }

    ngAfterContentInit(): void {
    }

    protected _getItems(params?: any): Observable<TaskOrDeliverable[]> {
        return this._getItemsRequest(params)
            .pipe(
                flatMap(tasks => forkJoin([
                    this._usersProvider.getBaseItemsByIds(tasks.map(task => task.creatorId).getUnique()).pipe(nullIfError),
                    this._projectsProvider.getBaseItemsByIds(tasks.map(task => task.projectId).getUnique()),
                ]).pipe(
                    map(([creators, projects]) => tasks.map((task) => {

                        task.creator = findById<IHumanResource>(creators, task.creatorId);
                        task.project = findById<IBasicProject>(projects, task.projectId);
                        return task;
                    })),
                )),
            );
    }

    protected _getItemsRequest(params?): Observable<any> {
        const projectId = this.projectId;
        return this._provider.getItems({...params, projectId});
    }
}

function findById<T extends IIdObject>(items: T[], id: any): T {
    return (items || []).find(item => item.id === id);
}
