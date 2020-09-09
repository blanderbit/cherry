import {Component, OnDestroy, OnInit} from '@angular/core';
import {AssignmentsProvider, AssignmentStatus, IActualTime, IAssignment, IBasicTask, TaskOrDeliverable, TaskStatus} from 'communication';
import {TimeAppViewComponent} from 'src/app/pages/timeapp/pages/track/time-app-view.component';
import {ViewMode} from '../../../models';
import {finalize} from 'rxjs/operators';
import {DashboardRoutes} from '../../../../dashboard/dashboard.routes';

@Component({
    selector: 'app-track-day-list',
    templateUrl: './day-view.component.html',
    styleUrls: ['./day-view.component.scss'],
})
export class DayViewComponent extends TimeAppViewComponent implements OnDestroy, OnInit {
    mode = ViewMode.Day;
    AssignmentStatus = AssignmentStatus;
    routes = DashboardRoutes;


    get dailyTotal() {
        return (this.items || []).reduce((acc, item) => acc + item.time, 0);
    }

    get date() {
        const {from, to} = this.viewModeParams;
        return from || to;
    }



    getTask(id) {
        return this.tasks && this.tasks[id];
    }

    protected handleAssignmentUpdate(assignment: IAssignment) {
        if (assignment.status) {
            const item = this.items.find(i => i.taskId === assignment.taskId);

            if (item) {
                item.status = assignment.status;
            }
        }
    }

    protected handleAssignmentDelete(assignment: IAssignment) {
        this.items = this.items.filter(item => item.taskId !== assignment.taskId);
    }

    protected handleTaskDelete(task: IBasicTask): void {
        this.items = this.items.filter(item => item.taskId !== task.id);
    }

    loadData(params?: any) {
        super.loadData(params);
        this.hoveredId = params && params.id ? params.id : null;
    }

    handleCreatedTasks(tasks: TaskOrDeliverable | TaskOrDeliverable[], time?: IActualTime): TaskOrDeliverable[] {
        tasks = super.handleCreatedTasks(tasks);

        this.items = [...this.getUniqueTasks(tasks, this.items).map((task) => ({
            // id: null,
            taskId: task.id,
            time: 0,
            date: this.date,
            task,
            ...time,
        })), ...this.items];

        return tasks;
    }

    handleHover(item) {
        if (!this.isCompleted(item)) {
            this.hoveredId = item.taskId;
        }
    }

    updateStatus(checked: boolean, item, checkboxComponent) {
        const hide = this.showLoading();
        const status = checked ? AssignmentStatus.Completed : AssignmentStatus.InProgress;
        const task = this.tasks[item.taskId];
        const resourceId = this._profile.resourceId;

        this.setProjectContext(task && task.projectId);

        this._assignmentsProvider.updateStatus({taskId: item.taskId, status, resourceId})
            .pipe(finalize(hide)).subscribe(() => {
                this.handleAssignmentStatusSuccess();
                item.status = status;
            },
            (error) => {
                checkboxComponent.writeValue(item.status === AssignmentStatus.Completed);
                this.handleAssignmentStatusError(error);
            });

    }

    isTaskCompleted(item: IActualTime): boolean {
        const taskId = item.taskId;
        const task = this.tasks[taskId];

        if (task) {
            return task.status === TaskStatus.Completed;
        }
    }

    isAssignmentCompleted(item: IActualTime) {
        return AssignmentsProvider.assignmentCompleted(item.status);
    }

    isCompleted(item: IActualTime) {
        return item.status === AssignmentStatus.Completed;
    }


    deleteItem(item: IActualTime, event?) {
        if (!item.id) {
            this.items = this.items.removeItemByReference(item);
            this._showSuccessDelete();
            return;
        }

        const task = this.tasks[item.taskId];

        this.setProjectContext(task && task.projectId);
        super.deleteItem(item, event);
    }

    isLastElementHovered() {
        if (this.items && this.items.length) {
            return this.hoveredId === this.items[this.items.length - 1].taskId;
        }
    }

    protected _handleCreateItem(item: IActualTime): void {
        if (this.shouldHandleRealtime(item)) {
            this._loadTasks([item.taskId]);

            const taskItem = this.items.find(i => i.taskId === item.taskId);
            if (taskItem) {
                Object.assign(taskItem, item);
            } else {
                super._handleCreateItem(item);
            }
        }
    }

    protected _handleDeleteItem(items: IActualTime) {
        super._handleDeleteItem(items);
        this.calculateTotals();
    }

    protected _handleUpdateItem(items: IActualTime) {
        super._handleUpdateItem(items);
        this.calculateTotals();
    }
}
