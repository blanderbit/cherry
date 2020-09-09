import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AssignmentsProvider, defaultIfError, IActualTime, IBasicTask, TasksProvider } from 'communication';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IViewModeHandler, TrackComponent, ViewModeHandler } from '../track.component';
import { LoadingComponent } from 'components';
import { IWeekItem, ViewMode } from '../../../models';
import * as moment from 'moment';
import { IDateRangeParams, IRangeParams } from 'date';
import * as _ from 'underscore';

type AddTasksRowItem = IActualTime | IWeekItem;

@Component({
    selector: 'app-add-tasks-row',
    templateUrl: './add-tasks-row.component.html',
    styleUrls: ['./add-tasks-row.component.scss']
})
export class AddTasksRowComponent extends LoadingComponent<any> {
    private _items: AddTasksRowItem[];
    availableTasks: IBasicTask[];
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = false;
    loadDataOnInit = false;

    @Output()
    public createNewTask = new EventEmitter<boolean>();

    @Output()
    public tasksCreated = new EventEmitter<IBasicTask[]>();

    @Input()
    set items(value: AddTasksRowItem[]) {
        if (value) {
            this._items = value;
            this.loadData();
        }
    }

    get items() {
        return this._items || [];
    }

    get params() {
        const {params, mode} = this.viewModeHandler;
        const {from: startDate, to} = params;
        const endDateInFuture = moment().isSameOrBefore(moment(to));
        let endDate = to;

        if (endDateInFuture) {
            endDate = Date.toServerDate();
        }

        if (mode === ViewMode.Day) {
            return {
                endDate,
            };
        } else {
            return {
                startDate,
                endDate,
            };
        }
    }

    constructor(private assignmentsProvider: AssignmentsProvider,
                private _taskProvider: TasksProvider,
                private _tasksProvider: TasksProvider,
                public loadingHandler: TrackComponent,
                @Inject(ViewModeHandler) protected viewModeHandler: IViewModeHandler,
    ) {
        super();
    }

    loadData() {
        const hide = this.showLoading();
        this.assignmentsProvider.getAvailableAssignments(this.params)
            .pipe(
                finalize(hide),
                catchError(() => of([])),
                map((tasksIds: number[]) => tasksIds.filter(id => !this.items.some(item => getTaskId(item) === id))),
                switchMap((availableItems: number[]) => this.getAvailableItems(availableItems),
                )
            ).subscribe(availableTasks => {
            this.availableTasks = availableTasks;
        });
    }

    getAvailableItems(items: number[]) {
        if (items && items.length) {
            return this._tasksProvider.getBaseItemsByIds(items)
                .pipe(defaultIfError<IBasicTask[]>([]));
        }

        return of([]);
    }

    public addNew(): void {
        this.createNewTask.emit(true);
    }

    public addAllTasks() {
        this.tasksCreated.emit(this.availableTasks);
        this.availableTasks = [];
    }
}

function getTaskId(item: AddTasksRowItem): number {
    return <number>(item.taskId || (<IActualTime>item).id);
}
