import { IDetailedTask, ProjectTasksComponent } from '../projects/project-tasks/project-tasks.component';
import { Component, forwardRef, OnInit, Provider } from '@angular/core';
import { IProjectMenuItemsContainer } from '../projects/details-wrapper/project-details-container.component';
import { IItem } from 'menu';
import {
    AssignmentStatus,
    IAssignment,
    IBaseTask,
    IDeliverable,
    IRealtimeMessage,
    ITask, IUpdateTaskStatusMessage, RealtimeProvider, TaskOrDeliverable, TasksRealtimeMessageType,
    TaskStatus,
    TaskType,
} from 'communication';
import { filter, finalize, map } from 'rxjs/operators';
import { AssignmentsStatusService, IUpdateAssignmentStatusMessage } from '../../common-tasks/assignments-status.service';
import { IProjectIdProvider, IProjectPermissionsManagerParams } from 'permissions';
import { ColDef } from 'ag-grid-community';
import { getTaskColDefByField, TASKS_COL_DEFS_MAP } from '../../common-tasks/grid/task-columns';
import { IGridCellComponentParams } from '../../ui/ag-grid/gird-cell/grid-cell.component';
import { GRID_COLUMN_DEFS_MAP } from '../../ui/ag-grid/grid-container/token';
import { TasksList } from './index';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AssignmentsRealtimeActions } from '../../../../projects/communication/src/lib/services/http/http-assignments.provider';

interface MyTasksTask extends IBaseTask {
    assignmentStatus: AssignmentStatus;
}

@Component({
    selector: 'app-tasks-list',
    template: ``,
})
export class TasksListComponent extends ProjectTasksComponent
    implements OnInit, Partial<IProjectMenuItemsContainer> {

    protected _menuItems: IItem[] = [this.hideCompletedTasksMenuItem];
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    loadDataOnQueryParamsChange = true;
    items = null;

    get menuItems() {
        return this._menuItems;
    }

    set menuItems(value: IItem[]) {
        this._menuItems = value;
    }

    get projectId() {
        return (this.route.snapshot.queryParams as IProjectIdProvider).projectId;
    }

    protected nameColumnDef: ColDef = {
        ...getTaskColDefByField('name'),
        cellRendererParams: (params) => {
            const api = this.grid.gridApi;
            const task = params.data as IBaseTask | MyTasksTask;
            const assignments = task.assignments || [];
            let status = this._assignmentStatusService.getAssignmentStatus(task);

            return {
                preserveCheckboxSpace: true,
                disableCheckbox: !AssignmentsStatusService.changeAssignmentStatusAvailable(task),
                checkboxValue: status === AssignmentStatus.Completed,
                showDeliverableIcon: task.type === TaskType.Deliverable,
                onCheckboxValueChange: (value: boolean, data: IDetailedTask) => {
                    const hide = this.showLoading();
                    status = value ? AssignmentStatus.Completed : AssignmentStatus.InProgress;

                    this._assignmentStatusService.updateAssignmentStatus(task, status)
                        .pipe(finalize(hide))
                        .subscribe({
                                next: null,
                                error: error => {
                                    api.refreshCells({force: true});
                                    this._notifier.showError(error, 'Can\'t update assigment status');
                                },
                            },
                        );
                },
                isCheckboxShown: () => {
                    return this._showCheckbox(assignments);
                },
            } as IGridCellComponentParams;
        },
    };

    ngOnInit() {
        super.ngOnInit();

        this._assignmentStatusService.updateCompletedStatus$.pipe(
            filter((payload) => payload.resourceId === this._profileService.resourceId),
            untilDestroyed(this),
        ).subscribe((payload) => {
            this._handleUpdateAssignmentStatus(payload);
            this._updateGrid();
        });

        this._provider.updateTaskStatus$.pipe(
            untilDestroyed(this),
        ).subscribe((data) => {
            this._handleUpdateTaskStatus(data);
            this._updateGrid();
        });
    }

    getNavigationQueryParams(item: ITask) {
        return {
            projectId: item.projectId,
        } as IProjectIdProvider;
    }

    protected _handleUpdateAssignmentStatus(data: IUpdateAssignmentStatusMessage) {
        const task = this.items.find(i => i.id === data.taskId);

        if (task) {
            task.assignments.find(i => i.resourceId === data.resourceId).status = data.status;
        }
    }

    protected _handleUpdateTaskStatus(data: IUpdateTaskStatusMessage) {
        const task = this.items.find(i => i.id === data.id);

        if (task) {
            task.status = data.status;
        }
    }

    protected _navigateToTask(relativePath: string | number, projectId: string | number) {
        super._navigateToTask(`../${relativePath}`, projectId);
    }

    protected _canNavigateToTask(): boolean {
        return this._permissionsService.isNotForbidden(this.permissionAction.ViewTaskById);
    }

    protected getPermissionsData(): IProjectPermissionsManagerParams {
        return {
            projectId: this.projectId,
        };
    }

    protected shouldHandleRealtimeCreate(message: IRealtimeMessage<ITask>) {
        return message && message.payload && this.shouldBeShown(message.payload);
    }

    protected shouldBeShown(task: ITask | IDeliverable) {
        return [TaskStatus.InProgress, TaskStatus.Requested, TaskStatus.Completed].includes(task.status)
            && task.creatorId === this._profileService.profile.resourceId;
    }

    protected _showCheckbox(assignments: IAssignment[]): boolean {
        return assignments.some(a => a.resourceId == this._profileService.resourceId);
    }

    protected _updateGrid() {
        this.grid.setItems([...this.items]);
    }
}

export function getTasksListProviders(component): Provider[] {
    return [
        {
            provide: TasksList,
            useExisting: forwardRef(() => component),
        },
        {
            provide: GRID_COLUMN_DEFS_MAP,
            useValue: TASKS_COL_DEFS_MAP,
        },
    ] as Provider[];
}
