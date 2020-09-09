import { Provider } from './provider';
import { IBasicTask, ITask, ITaskWithProgressDetails, TaskOrDeliverable } from '../../models';
import { Observable, throwError } from 'rxjs';
import { ProjectStatus, TaskStatus } from '../../models';
import { AssignmentsProvider } from './assignments.provider';
import { IProjectIdProvider } from 'permissions';
import { Params } from '@angular/router';
import { DashboardRoutes } from '../../../../../../src/app/pages/dashboard/dashboard.routes';
import { ITaskActivityType } from '../../models/tasks/activity-type.interface';
import { ITaskPriority } from '../../models/tasks/task-priority.interface';
import { Moment } from 'moment';


export interface ITaskDetailsNavigationData {
    segments: string[];
    queryParams: Params | null;
}

export interface IUpdateTaskStatusMessage {
    id: number;
    status: TaskStatus;
}

export abstract class TasksProvider extends Provider<TaskOrDeliverable> {
    abstract updateTaskStatus$: Observable<IUpdateTaskStatusMessage>;

    static shouldBeHighlighted(status) {
        return [TaskStatus.InProgress, TaskStatus.Requested]
            .includes(status);
    }

    static getTaskDetailsNavigationData(taskId: number | string, projectId: number | string): ITaskDetailsNavigationData {
        return {
            segments: [DashboardRoutes.Tasks, taskId.toString()],
            queryParams: {
                projectId
            } as IProjectIdProvider,
        };
    }

    static isTaskActive(taskOrStatus: IBasicTask | TaskStatus): boolean {
        if (taskOrStatus) {
            const status = typeof taskOrStatus === 'number' ? taskOrStatus : taskOrStatus.status;

            return [TaskStatus.Draft, TaskStatus.Requested, TaskStatus.InProgress].includes(status);
        }

        return false;
    }


    static mapTaskAssignments(task: ITaskWithProgressDetails): TaskOrDeliverable {
        return {
            ...task,
            assignments: task.assignments.map(a => ({
                ...a,
                id: AssignmentsProvider.createAssignmentId(a.resourceId, task.id),
            })),
        };
    }

    abstract getTaskMinDate (task: ITask): Moment;

    abstract getItemById(id): Observable<ITaskWithProgressDetails>;

    abstract getCurrentUserTasks(params: any): Observable<TaskOrDeliverable[]>;

    abstract getActiveTasks(params: any): Observable<TaskOrDeliverable[]>;

    abstract updateStatus(taskId: number, data: TaskStatus): Observable<TaskStatus>;

    abstract updateWorkCompleted(projectId: number, taskId: number, value: number): Observable<any>;

    abstract updateDates(item: ITask): Observable<ITask>;

    abstract getAssignedTasks(params?: any): Observable<ITask[]>;

    abstract getBaseItemsByIds(ids: number[]): Observable<IBasicTask[]>;

    abstract getTaskPriorities(): Observable<ITaskPriority[]>;

    abstract getTaskTypes(): Observable<ITaskActivityType[]>;
}

type TaskStatusMap = {
    [key in ProjectStatus]: Partial<{ [k in keyof typeof TaskStatus]: TaskStatus[] }>;
};

export const TASK_STATUSES_BY_PROJECT_STATUS: TaskStatusMap = {
    [ProjectStatus.Draft]: {
        [TaskStatus.Draft]: [],
        [TaskStatus.Requested]: [],
        [TaskStatus.InProgress]: [],
        [TaskStatus.Completed]: [],
        [TaskStatus.Archived]: [],
        [TaskStatus.Canceled]: [],
    },
    [ProjectStatus.InProgress]: {
        [TaskStatus.Draft]: [TaskStatus.Requested],
        [TaskStatus.Requested]: [TaskStatus.InProgress, TaskStatus.Completed, TaskStatus.Canceled],
        [TaskStatus.InProgress]: [TaskStatus.Requested, TaskStatus.Completed, TaskStatus.Canceled],
        [TaskStatus.Completed]: [TaskStatus.Requested, TaskStatus.InProgress, TaskStatus.Canceled],
        [TaskStatus.Archived]: [],
        [TaskStatus.Canceled]: [TaskStatus.Requested, TaskStatus.InProgress, TaskStatus.Completed],
    },
    [ProjectStatus.Completed]: {
        [TaskStatus.Draft]: [],
        [TaskStatus.Requested]: [TaskStatus.Completed],
        [TaskStatus.InProgress]: [TaskStatus.Completed],
        [TaskStatus.Completed]: [],
        [TaskStatus.Archived]: [],
        [TaskStatus.Canceled]: [TaskStatus.Completed],
    },
    [ProjectStatus.Archived]: {
        [TaskStatus.Draft]: [],
        [TaskStatus.Requested]: [],
        [TaskStatus.InProgress]: [],
        [TaskStatus.Completed]: [TaskStatus.Archived],
        [TaskStatus.Archived]: [],
        [TaskStatus.Canceled]: [TaskStatus.Archived],
    },
    [ProjectStatus.Canceled]: {
        [TaskStatus.Draft]: [],
        [TaskStatus.Requested]: [TaskStatus.Canceled],
        [TaskStatus.InProgress]: [TaskStatus.Canceled],
        [TaskStatus.Completed]: [TaskStatus.Canceled],
        [TaskStatus.Archived]: [],
        [TaskStatus.Canceled]: [TaskStatus.Requested, TaskStatus.InProgress, TaskStatus.Completed],
    },
};
