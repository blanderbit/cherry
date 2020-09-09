import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AssignmentStatus, IActualTime, IAssignment, IBasicTask, TaskOrDeliverable, TaskStatus} from 'communication';
import {TimeAppViewComponent} from 'src/app/pages/timeapp/pages/track/time-app-view.component';
import {IWeekItem, ViewMode} from '../../../models';
import {forkJoin, of} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {DashboardRoutes} from '../../../../dashboard/dashboard.routes';

enum Columns {
    Name = 'name',
    Mon = '0',
    Tue = '1',
    Wed = '2',
    Thu = '3',
    Fri = '4',
    Sat = '5',
    Sun = '6',
    Total = 'total',
    Comment = 'comment',
    Delete = 'delete',
    SecondHeader = 'secondHeader',
    ThirdHeader = 'thirdHeader',
    NoData = 'noData',
}

@Component({
    selector: 'app-track-week-list',
    templateUrl: './week-view.component.html',
    styleUrls: ['./week-view.component.scss'],
})

export class WeekViewComponent extends TimeAppViewComponent implements OnInit {
    public columns = Columns;
    public daysColumns = [Columns.Mon, Columns.Tue, Columns.Wed, Columns.Thu, Columns.Fri, Columns.Sat, Columns.Sun];
    public displayedColumns = [Columns.Name, ...this.daysColumns, Columns.Total, Columns.Comment, Columns.Delete];
    selectedDate;
    mode = ViewMode.Week;
    routes = DashboardRoutes;

    protected handleAssignmentCreate(assignments) {
        this._loadTasks(assignments.map(a => a.taskId));
        if (this.shouldAddAssignments(assignments, this.weekItems)) {
            this.weekItems = [
                ...assignments.map(assignment => ({
                    taskId: assignment.taskId,
                    dayTotal: 0,
                    times: this.weekDates.map(getWeekItems(assignment.taskId, [])),
                })),
                ...this.weekItems,
            ];
        }
    }

    protected handleAssignmentUpdate(assignment: IAssignment) {
        const item = this.weekItems.find(i => i.taskId === assignment.taskId);

        if (item) {
            item.times = item.times.map(i => ({...i, status: assignment.status}));
        }
    }

    protected handleAssignmentDelete(assignment: IAssignment) {
        this.weekItems = this.weekItems.filter(wi => wi.taskId !== assignment.taskId);
    }

    protected handleTaskDelete(task: IBasicTask): void {
        this.weekItems = this.weekItems.filter(wi => wi.taskId !== task.id);
    }

    getParams(params?: any): any {
        return this.viewModeHandler.params;
    }

    handleCreatedTasks(tasks: TaskOrDeliverable[]): TaskOrDeliverable[] {
        tasks = super.handleCreatedTasks(tasks);

        this.weekItems = [
            ...this.getUniqueTasks(tasks, this.weekItems).map(({id: taskId}) => ({
                taskId,
                dayTotal: 0,
                times: this.weekDates.map(getWeekItems(taskId, [])),
            })),
            ...this.weekItems,
        ];
        return tasks;
    }

    public isActiveDate(day) {
        return this._trackService.isActiveDay({date: new Date(day)}, moment());
    }

    protected _handleResponse(response: IActualTime[]) {
        super._handleResponse(response);
        this._setWeekItems(response);
    }

    updateTaskTime(item: IActualTime, inputTime: number): void {
        super.updateTaskTime(item, inputTime);
        this.calculateTotals();
    }

    isTaskCompleted(weekItem: IWeekItem): boolean {
        const {taskId} = weekItem;
        return this.tasks[taskId] && this.tasks[taskId].status === TaskStatus.Completed;
    }

    handleHoverWeekItem(item) {
        if (!this.isTaskCompleted(item)) {
            this.hoveredId = item.taskId;
        }
    }

    hasComment(item: IWeekItem) {
        return item.times.some(({comment}) =>
            comment && comment.length > 0,
        );
    }

    changeStatus(checked: boolean, weekItem: IWeekItem): void {
        const {taskId} = weekItem;
        const task = this.tasks[taskId];
        const resourceId = this._profile.resourceId;

        this.setProjectContext(task && task.projectId);

        const status = checked ? AssignmentStatus.Completed : AssignmentStatus.InProgress;

        const hide = this.showLoading();
        this._assignmentsProvider.updateStatus({taskId, status, resourceId})
            .pipe(finalize(hide))
            .subscribe(
                v => {
                    for (const item of this.items) {
                        if (item.taskId === weekItem.taskId) {
                            item.status = status;
                        }
                    }

                    this.handleAssignmentStatusSuccess();
                },
                err => {
                    this.weekItems = this.weekItems.map(v => v === weekItem ? ({...v}) : v);
                    this.handleAssignmentStatusError(err);
                },
            );

    }

    deleteTimes(item: IWeekItem) {
        const hide = this.showLoading();
        const task = this.tasks[item.taskId];

        this.setProjectContext(task && task.projectId);

        if (item.times.every(val => !val.id)) {
            this.handleDeleteResponse(item);
            hide();
        }
        else {
            forkJoin(item.times.map(({id}) => this.hasID(id)))
                .pipe(finalize(hide)).subscribe(() => {
                },
                () => super.showError('Can not delete'),
                () => this.handleDeleteResponse(item),
            );
        }
    }

    handleDeleteResponse(item) {
        super._showSuccessDelete();
        console.log('delete', item);
        this.weekItems = this.weekItems.removeItemByReference(item);
        this.calculateTotals();
    }

    public hasID(id) {
        if (!id) {
            return of(null);
        }
        else {
            return super._deleteItem({id: id} as IActualTime);
        }
    }

    public isAfterTodayMoment(date) {
        if (date) {
            return date.isAfter();
        }
    }

    public isLastElementHovered() {
        if (this.weekItems && this.weekItems.length) {
            return this.hoveredId === this.weekItems[this.weekItems.length - 1].taskId;
        }
    }

    protected _handleDeleteItem(items: IActualTime) {
        console.log('HANDLE DELETE', items);
        const item = this.weekItems.find(weekItem => weekItem.taskId === items.taskId);

        if (item) {
            const time = item.times.find(t => t.id === items.id);

            if (time) {
                time.time = 0;
                this.calculateTotals();
            }

            const totalTime = item.times.reduce((acc, i) => acc + i.time, 0);

            if (!totalTime) {
                this.weekItems = this.weekItems.filter(wi => wi.taskId !== items.taskId);
            }
        }
    }

    protected _handleUpdateItem(items: IActualTime) {
        const item = this.weekItems.find(weekItem => weekItem.taskId === items.taskId);
        const time = item.times.find(t => t.id === items.id);
        Object.assign(time, items);
        this.calculateTotals();
    }

    protected _handleCreateItem(item: IActualTime): void {
        if (!this.shouldHandleRealtime(item)) {
            return;
        }

        const value = this.weekItems.find(weekItem => weekItem.taskId === item.taskId);

        if (value) {
            const time = value.times.find(v => Date.toServerDate(v.date) === Date.toServerDate(item.date));

            if (time) {
                Object.assign(time, item);
                this.calculateTotals();
            }

        }
        else if (item.id) {
            this._handleResponse([item, ...this.items]);
        }
    }

    public isAssignmentCompleted(weekItem: IWeekItem) {
        const item = weekItem.times.find(i => !!i.status);

        if (item) {
            return item.status === AssignmentStatus.Completed;
        }

        return false;
    }
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

function initTotalWeekArray() {
    return new Array(7).fill(0);
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


