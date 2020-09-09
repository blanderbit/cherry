import {
    AssignmentsProvider,
    AssignmentStatus,
    IAssignment,
    IBaseTask,
    ITask,
    ITaskWithProgressDetails,
    PermissionAction,
    TaskOrDeliverable,
    TasksProvider,
    TaskType,
} from 'communication';
import { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { GridService } from '../../ui/ag-grid/grid.service';
import { StatusComponent } from '../status.component';
import { AvatarsStackComponent, IAvatarStackComponentParams } from '../../user/avatars-stack/avatars-stack.component';
import { IDetailedTask } from '../../pages/projects/project-tasks/project-tasks.component';
import { GridCellComponent, IGridCellComponentParams } from '../../ui/ag-grid/gird-cell/grid-cell.component';
import { ITaskWithCreator } from '../task-details/task-details.component';
import { EffortComponent } from '../../ui/ag-grid/effort/effort.component';
import { HighlightComponent } from '../../ui/ag-grid/highlight/highlight.component';
import * as moment from 'moment';
import { MomentInput } from 'moment';
import { TimeToStringPipe } from 'date';

type Task = ITask & ITaskWithProgressDetails & ITaskWithCreator;
export type TaskField = keyof Task;

export const TASKS_COL_DEFS_MAP: { [key in keyof Partial<Task>]: ColDef } = {
    currentStartDate: {
        minWidth: 100,
        valueFormatter: (params: ValueFormatterParams) => {
            const type = (params.data as TaskOrDeliverable).type;

            if (type === TaskType.Task) {
                return GridService.gridDateFormatter(params);
            }

            return '';
        },
    },
    currentEndDate: getDueDateCol(),
    wbs: {
        minWidth: 75,
        maxWidth: 75,
        cellClass: 'text-overflow-ellipsis',
        valueFormatter: wbsValueFormatter,
        permissionAction: PermissionAction.ViewTaskWBS,
    },
    status: {
        minWidth: 120,
        cellRendererFramework: StatusComponent,
    },
    name: {
        maxWidth: 300,
        minWidth: 100,
        cellRendererFramework: GridCellComponent,
        cellRendererParams: (params: ICellRendererParams) => {
            const task = <IDetailedTask>params.data;

            return {
                value: task.name,
                showDeliverableIcon: (<IBaseTask>task).type === TaskType.Deliverable,
            } as IGridCellComponentParams;
        },
    },
    project: {
        sortable: false,
        valueGetter: (params) => {
            const task = params.data as IDetailedTask;
            return task.project && task.project.name;
        },
    },
    creator: {
        sortable: false,
        valueGetter: (params) => {
            const task = params.data as IDetailedTask;
            return task.creator && task.creator.name;
        },
    },
    assignments: getTaskAssignmentsCol(),
    plannedTime: {
        cellRendererFramework: EffortComponent,
        sortable: false,
        minWidth: 60,
        valueFormatter: timeToStringFormatter,
    },
    actualTime: {
        minWidth: 60,
        sortable: false,
        cellRendererFramework: HighlightComponent,
        cellRendererParams: (params: ICellRendererParams) => {
            return {
                isHighlighted: AssignmentsProvider.assignmentOverdue(params.data.actualTime, params.data.plannedTime),
            };
        },
        valueFormatter: timeToStringFormatter,
    },
};

export function getTaskColDefByField(field: TaskField): ColDef {
    const colDef = TASKS_COL_DEFS_MAP[field];

    if (!colDef) {
        console.warn(`Can\'t find ColDef for field - ${field}`);
    }

    return {
        field,
        ...colDef,
    };
}

export function getTaskAssignmentsCol(): ColDef {
    return {
        field: 'assignments',
        cellRendererFramework: AvatarsStackComponent,
        sortable: false,
        cellRendererParams: (params: ICellRendererParams) => {
            const assignments = (params.value as IAssignment[]) || [];
            const membersIds = assignments.map(a => a.resourceId);
            const completedAssignmentsIds = assignments.filter(a => a.status === AssignmentStatus.Completed).map(a => a.resourceId);

            return {
                ids: membersIds || [],
                shownCount: 3,
                successIds: completedAssignmentsIds,
            } as IAvatarStackComponentParams;
        },
    };
}

function wbsValueFormatter(params: ValueFormatterParams): string {
    const wbsMaxLength = 3;
    const value: string = params.value || '';

    return value.split('.').splice(0, wbsMaxLength).join('.');
}

function timeToStringFormatter(params: ValueFormatterParams): string {
    return TimeToStringPipe.timeToString(params.value);
}

function getDueDateCol(): ColDef {
    return {
        minWidth: 100,
        valueFormatter: GridService.gridDateFormatter,
        cellRendererFramework: HighlightComponent,
        cellRendererParams: (params: ICellRendererParams) => {
            const status = params.data.status;
            const isHighlighted = TasksProvider.shouldBeHighlighted(status) && isAfterToday(params.value);
            return {isHighlighted};
        },
    };
}


const isAfterToday = (value: MomentInput) => {
    return moment().isAfter(value);
};
