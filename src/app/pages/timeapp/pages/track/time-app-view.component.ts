import {Inject, Injectable, Injector, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {filter, finalize, map} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
    AssignmentsProvider,
    AssignmentStatus,
    IActualTime,
    IAssignment,
    IBasicProject,
    IBasicTask,
    IRealtimeMessage,
    ProjectsProvider,
    TaskOrDeliverable,
    TasksProvider,
    TaskStatus,
    TimeProvider,
} from 'communication';
import {ItemsComponent} from 'components';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'notifier';
import {MapHandler} from 'src/app/pages/timeapp/pages/track/realtime.handler';
import {ViewTimePipe} from 'src/app/pages/timeapp/pages/track/view-time.pipe';
import {TrackService} from './track.service';
import {IViewModeHandler, TrackComponent, ViewModeHandler} from './track.component';
import {CommentsDialogComponent, ICommentsDialogConfig} from '../../comments/comments-dialog/comments-dialog.component';
import {DialogConfig} from '../../../../ui/dialogs/dialogs';
import * as moment from 'moment';
import {Moment, MomentInput} from 'moment';
import {IViewModeParams, IWeekItem, ViewMode} from '../../models';
import {ProfileService} from '../../../../identify/profile.service';
import {ProjectsPermissionsManager} from 'permissions';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Injectable()
export abstract class TimeAppViewComponent extends ItemsComponent<IActualTime, IViewModeParams> implements OnInit, OnDestroy {
    private readonly _handlers: MapHandler[] = [];
    public readonly projectsHandler: MapHandler<IBasicProject>;
    public readonly tasksHandler: MapHandler<IBasicTask>;
    public loadDataOnQueryParamsChange = true;
    public loadDataOnInit = false;
    public loadDataOnParamsChange = false;
    public selectedId;
    public hoveredId: number;
    public createNewTask: boolean;
    public mode: ViewMode;
    public weekItems: IWeekItem[] = [];
    public setPaginationQueryParams = false;
    public items: IActualTime[] = null;
    weekTotalsList = initTotalWeekArray();
    weekDates: any[] = [];
    actionsShown: boolean;

    protected projects: {[id: number]: IBasicProject} = {};
    protected tasks: {[id: number]: IBasicTask} = {};

    @Input()
    public isCreateNewActive: boolean;

    get viewModeParamsHandler() {
        return this.viewModeHandler.viewModeParams;
    }

    get viewModeParams() {
        return this.viewModeHandler.params;
    }

    get totalWeekView() {
        return this.weekTotalsList.reduce((acc, item) => acc + item);
    }

    get dateInEditableRange(): boolean {
        const {from, to} = this.viewModeParams;
        return Date.inEditableRange(from || to);
    }

    constructor(
        protected _tasksProvider: TasksProvider,
        protected _trackService: TrackService,
        protected _projectsProvider: ProjectsProvider,
        protected _profile: ProfileService,
        protected _provider: TimeProvider,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _assignmentsProvider: AssignmentsProvider,
        protected _dialogService: NgbModal,
        public loadingHandler: TrackComponent,
        protected _notifier: NotifierService,
        public _permissionsManager: ProjectsPermissionsManager,
        @Inject(ViewModeHandler) protected viewModeHandler: IViewModeHandler,
        @Optional() protected _header: TrackComponent,
    ) {
        super();
        this.projectsHandler = new MapHandler(this._projectsProvider, this.projects);
        this.tasksHandler = new MapHandler(this._tasksProvider, this.tasks);
        this._handlers = [this.projectsHandler, this.tasksHandler];
    }

    ngOnInit(): void {
        this.setViewMode();
        super.ngOnInit();

        this._assignmentsProvider.create$
            .pipe(
                untilDestroyed(this),
                map((a: IRealtimeMessage<IAssignment[]>) => a.payload.filter(p => p.resourceId === this._profile.resourceId)),
            ).subscribe((assignments: IAssignment[]) => this.handleAssignmentCreate(assignments));

        this._assignmentsProvider.update$
            .pipe(
                untilDestroyed(this),
                filter((a: IRealtimeMessage<IAssignment>) => a.payload.resourceId === this._profile.resourceId),
            ).subscribe((a: IRealtimeMessage<IAssignment>) => this.handleAssignmentUpdate(a.payload));

        this._assignmentsProvider.delete$
            .pipe(
                untilDestroyed(this),
                filter((a: IRealtimeMessage<IAssignment>) => a.payload.resourceId === this._profile.resourceId),
            ).subscribe((a: IRealtimeMessage<IAssignment>) => this.handleAssignmentDelete(a.payload));

        this._tasksProvider.delete$
            .pipe(
                untilDestroyed(this),
            )
            .subscribe(({payload}) => this.handleTaskDelete(payload));
    }

    protected handleAssignmentCreate(assignments) {
        this._loadTasks(assignments.map(a => a.taskId));

        if (this.shouldAddAssignments(assignments, this.items)) {
            this.items = [
                ...assignments
                    .map(a => ({
                        id: null,
                        taskId: a.taskId,
                        date: Date.toServerDate(),
                        time: 0,
                    })),
                ...this.items,
            ];

        }
    }

    protected shouldAddAssignments(assignments, items) {
        return assignments
            .filter(assignment => {
                return !items.map(item => item.taskId).includes(assignment.taskId);
            }).length > 0;
    }

    protected abstract handleAssignmentDelete(assignment: IAssignment): void;

    protected abstract handleAssignmentUpdate(assignment: IAssignment): void;

    protected abstract handleTaskDelete(task: IBasicTask): void;

    abstract isLastElementHovered();

    public setViewMode() {
        this.viewModeHandler.setMode(this.mode);

        const params = this.route.snapshot.queryParams;
        if (!Object.keys(params).length) {
            this.viewModeHandler.updateQueryParams();
        }
    }

    protected _handleResponse(response: IActualTime[]) {
        super._handleResponse(response);
        this._setWeekItems(response);
        this._loadTasks((response).map(({taskId}) => taskId).getUnique());
        this.setActionsVisibility();
    }

    setActionsVisibility() {
        const {from, to} = this.viewModeParams;
        const date = moment(from || to);
        const prevWeekStart = moment().startOf('isoWeek').subtract(1, 'week');
        this.actionsShown = date.isSameOrAfter(prevWeekStart);
    }

    isReadyForEdit(date?: Moment): boolean {
        return Date.inEditableRange(moment(this.viewModeHandler.params.from));
    }

    taskDisabled(taskId: number) {
        const task = this.tasks[taskId];
        if (task) {
            return ![TaskStatus.InProgress, TaskStatus.Requested].includes(task.status);
        }

        return false;
    }

    timeEditDisabled(taskId: number, date: MomentInput): boolean {
        const task = this.tasks[taskId];

        if (task) {
            date = moment(date);

            return this.taskDisabled(taskId) || TimeProvider.isBeforeStartDate(date, task) || date.isAfter();
        }

        return true;
    }

    toggleTaskSelectState(task?): void {
        const id = task && task.id;

        if (id === this.selectedId || this.createNewTask) {
            this.selectedId = null;

            return;
        }

        this.selectedId = id;
    }

    isTimeEqual(item: IActualTime, inputTime: string) {
        const time = ViewTimePipe.textToSeconds(inputTime);

        return item.time == time;
    }

    loadData(params: IViewModeParams) {
        const {from, to} = (params || <IViewModeParams>{});
        this.hoveredId = null;
        // const {from, to} = this.viewModeHandler.params;
        if (from && to) {
            this.weekDates = getWeekDates(from, to);
            super.loadData(params);
        } else {
            console.warn('MISSING QUERY PARAMS', params);
            this.viewModeHandler.updateQueryParams();
        }
    }

    getParams(params?: any): any {
        return {
            ...super.getParams(params),
            ...this.viewModeParamsHandler.params,
        };
    }

    handleAssignmentStatusError(error) {
        this.notifier.showError(error);
    }

    handleAssignmentStatusSuccess() {
        this.notifier.showSuccess('change-status.status-changed');
    }

    updateTaskTime(item: IActualTime, inputTime: number): void {

        if (item == null || inputTime == null)
            return;


        const hide = this.showLoading();
        const provider = this._provider;
        const task = this.tasks[item.taskId];
        const data = {
            ...item,
            time: inputTime,
            date: Date.toServerDate(item.date, true),
            resourceId: this._profile.resourceId,
        } as IActualTime;

        if (task && task.projectId) {
            this.setProjectContext(task.projectId);

            (data.id ? provider.updateItem(data) : provider.createItem(data))
                .pipe(finalize(hide))
                .subscribe(
                    (response) => {
                        this._notifier.showSuccess('Time successfully updated');
                        Object.assign(item, <IAssignment>{status: AssignmentStatus.InProgress}, response);
                    },
                    (err) => this._notifier.showError(err, 'Can\'t update time'),
                );
        }
    }

    protected _loadTasks(tasksIds: number[]) {
        const hide = this.showLoading();
        this.tasksHandler.loadItems(tasksIds)
            .pipe(finalize(hide))
            .subscribe(
                (tasks) => this._loadProjects((tasks || []).map(({projectId}) => projectId).getUnique()),
                error => this.showError(error, 'Can\'t load tasks'),
            );
    }

    private _loadProjects(projectsIds: number[]) {
        const hide = this.showLoading();

        this.projectsHandler.loadItems(projectsIds)
            .pipe(finalize(hide))
            .subscribe(() => null, error => this.showError(error, 'Can\'t load projects'));
    }

    onTasksCreate(task: TaskOrDeliverable) {
        if (!task)
            return;

        this.handleCreatedTasks(task);
        this.createNewTask = false;
    }

    handleCreatedTasks(tasks: TaskOrDeliverable | TaskOrDeliverable[]): TaskOrDeliverable[] {
        if (!tasks)
            return;

        if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }

        this.tasksHandler.setItems(tasks);
        this._loadProjects(tasks.map(t => t.projectId));
        return tasks;
    }

    openCommentPopup(items: IActualTime | IActualTime[], task: IBasicTask) {
        return this._dialogService.open(CommentsDialogComponent, {
            injector: Injector.create({
                providers: [
                    {
                        provide: DialogConfig,
                        useValue: {items, task, projectId: task.projectId} as ICommentsDialogConfig,
                    },
                ],
            }),
        });
    }

    protected getUniqueTasks(tasks, items): IBasicTask[] {
       return tasks.filter(task => {
            return  !items.find(item => item.taskId == task.id);
        });
    }

    protected _setWeekItems(times: IActualTime[]) {
        const tasksIds = times.map(({taskId}) => taskId).getUnique();

        this.weekItems = tasksIds.map(taskId => {
            const _times = times.filter((i) => getTaskId(i, taskId));

            return {
                taskId,
                times: this.weekDates.map(getWeekItems(taskId, _times)),
            };
        });

        this.calculateTotals();
    }

    calculateTotals() {
        this.weekTotalsList = initTotalWeekArray();

        for (const row of this.weekItems) {
            row.dayTotal = 0;
            const items = row.times;

            for (let i = 0; i < items.length; i++) {
                const time = items[i].time || 0;
                row.dayTotal += time;
                this.weekTotalsList[i] += time;
            }
        }
    }

    protected _handleCreateItem(item: IActualTime[] | IActualTime) {
        if (Array.isArray(item))
            return item.forEach(i => this._handleCreateItem(i));

        if (this.items.some(({taskId}) => item.taskId === taskId))
            return this._handleUpdateItem(item);

        super._handleCreateItem(item);
    }

    protected shouldHandleRealtime(item: IActualTime) {
        const {from, to} = this.viewModeParams;
        console.log('SHOULD HANDLE REALTIME', item.date, from, to, Date.isBetweenDays(item.date, from, to));
        return Date.isBetweenDays(item.date, from, to);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();

        for (const handler of this._handlers)
            handler.dispose();
    }
}

function initTotalWeekArray() {
    return new Array(7).fill(0);
}

function getWeekDates(from, to) {
    const date = moment(from);
    const toDate = moment(to);
    const result = [];

    while (!date.isAfter(toDate)) {
        result.push(date.clone());

        date.add(1, 'day');
    }

    return result;
}

function getWeekItems(taskId: number, times: IActualTime[]) {
    return (date) => {
        date = date.format('YYYY-MM-DD');
        // dont use isSame form moment because it has some undefined behaviour
        const time = times.find(item => moment(item.date).format('YYYY-MM-DD') === date);

        return time || {
            date,
            taskId,
        } as any;
    };
}

function getTaskId(id: {taskId: number}, taskId: number) {
    return id.taskId === taskId;
}
