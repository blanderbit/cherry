import { HttpProvider } from './http.provider';
import {
    CommunicationConfig,
    ExcludeId,
    IActionConfig,
    IBasicTask,
    IDeliverable,
    IRealtimeMessage,
    ITaskWithProgressDetails, IUpdateTaskStatusMessage,
    TaskStatus,
} from 'communication';
import { Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { RealtimeAction, RealtimeSuffix } from '../common/realtime.provider';
import { TasksProvider } from '../common/tasks.provider';
import { HttpDeliverableProvider } from 'projects/communication/src/lib/services/http/http-deliverable.provider';
import { ITask, TaskFields, TaskOrDeliverable, TaskType } from '../../models/tasks/taskOrDeliverable';
import * as _ from 'underscore';
import { HttpParams } from '@angular/common/http';
import { ITaskPriority } from '../../models/tasks/task-priority.interface';
import { ITaskActivityType } from '../../models/tasks/activity-type.interface';
import * as moment from 'moment';
import { Moment } from 'moment';

const Suffix = 'tasks';

export enum TasksRealtimeMessageType {
    EffortUpdated = 'EffortUpdated',
    StatusUpdated = 'StatusUpdated',
    WorkCompletedUpdated = 'WorkCompletedUpdated',
    AssignmentsCreated = 'AssignmentsCreated',
    DatesUpdated = 'DatesUpdated',
    DeliverableUpdated = 'DeliverableUpdated',
    DeliverableCreated = 'DeliverableCreated',
    TaskDatesUpdatedMessage = 'TaskDatesUpdatedMessage',
}

const {
    AssignmentsCreated,
    DatesUpdated,
    EffortUpdated,
    StatusUpdated,
    WorkCompletedUpdated,
    DeliverableUpdated,
    DeliverableCreated,
    TaskDatesUpdatedMessage,
} = TasksRealtimeMessageType;

export class HttpTasksProvider extends HttpProvider<TaskOrDeliverable> implements TasksProvider {
    public updateTaskStatus$ = this._getObservable(StatusUpdated).pipe(
        map(data => data.payload as IUpdateTaskStatusMessage)
    );

    private _deliverableProvider: HttpDeliverableProvider;

    private _patchMap = {
        [TaskFields.StartDate]: getStartDatePatchDto,
        [TaskFields.EndDate]: getEndDatePatchDto,
    };

    protected _getURL(config: CommunicationConfig): string {
        return config.http.tasks;
    }

    protected _getType(): string {
        return RealtimeSuffix.Tasks;
    }

    getUpdatesActions(): (string | IActionConfig)[] {
        return [
            ...super.getUpdatesActions(),
            EffortUpdated,
            StatusUpdated,
            WorkCompletedUpdated,
            AssignmentsCreated,
            DatesUpdated,
            TaskDatesUpdatedMessage,
            {
                type: DeliverableUpdated,
                transform: transformDeliverable,
            }
        ];
    }

    getCreateActions(): (string | IActionConfig)[] {
        return [
            ...super.getCreateActions(),
            {
                type: DeliverableCreated,
                transform: transformDeliverable,
            }
        ];
    }

    protected _getDeliverableProvider() {
        if (!this._deliverableProvider)
            this._deliverableProvider = new HttpDeliverableProvider(this._http, this._communicationConfig);

        return this._deliverableProvider;
    }

    getItemById(id: number | string): Observable<ITaskWithProgressDetails> {
        return <Observable<ITaskWithProgressDetails>>super.getItemById(id)
            .pipe(
                map(TasksProvider.mapTaskAssignments)
            );
    }

    updateItem(item: TaskOrDeliverable): Observable<any> {
        if (item && item.type === TaskType.Deliverable)
            return this._getDeliverableProvider().updateItem(item);

        return super.updateItem(item);
    }

    createItem(item: ExcludeId<TaskOrDeliverable>, options?: any): Observable<any> {
        if (item && item.type === TaskType.Deliverable)
            return this._getDeliverableProvider().createItem(item as IDeliverable);

        return super.createItem(item, options);
    }

    patchItem(item: Partial<TaskOrDeliverable>, field: string): Observable<Partial<TaskOrDeliverable>> {
        if (item && item.type === TaskType.Deliverable)
            return this._getDeliverableProvider().patchItem(item as IDeliverable, field);

        return this._patchItem(item, field);
    }

    getCurrentUserTasks(params: any): Observable<TaskOrDeliverable[]> {
        return this._http.get<TaskOrDeliverable[]>(this._concatUrl('mytasks'), {params});
    }

    getActiveTasks(params: any): Observable<TaskOrDeliverable[]> {
        return this._http.get<TaskOrDeliverable[]>(this._concatUrl('tasks/active'), {params});
    }

    updateStatus(taskId: number, data: TaskStatus): Observable<TaskStatus> {
        return this._http.put<TaskStatus>(this._concatUrl(Suffix, taskId, 'status'), data).pipe(
            mapTo(data),
            tap(status => {
                this.onUpdate(status);
            }),
        );
    }

    updateWorkCompleted(projectId: number, taskId: number, value: number): Observable<null> {
        return this._http.put<null>(this._getRESTURL(`${taskId}/work`), {
            projectId, value,
        });
    }

    _patchItem(item: Partial<TaskOrDeliverable>, field: string) {
        const fn = this._patchMap[field] || ((_item) => _.pick(_item, field));
        const dto = fn(item);

        if (field === TaskFields.StartDate || field === TaskFields.EndDate)
            field = 'dates';

        return this._http.put(this._concatUrl(Suffix, item.id, field), dto)
            .pipe(map(this.combineResponse(item)), tap(this._bindRealtime(RealtimeAction.Update)));
    }

    updateDates(item): Observable<ITask> {
        const {startDate, endDate} = item;
        return this._http.put<ITask>(this._getRESTURL(`${item.id}/dates`), {startDate, endDate})
            .pipe(
                map(this.combineResponse(item)),
                // tap(this.onUpdate),
            );
    }

    getAssignedTasks(obj: any): Observable<ITask[]> {
        let params = {};
        if (obj) {
            params = new HttpParams({fromObject: obj});
        }

        return this._http.get<any>(this._concatUrl('mytasks', 'search'), {params});
    }

    protected _getRESTURL(id?): string {
        return this._concatUrl(Suffix, id);
    }

    getBaseItemsByIds(ids: number[]): Observable<IBasicTask[]> {
        const params = new HttpParams({fromObject: {ids: ids.map(String)}});

        return this._http.get<IBasicTask[]>(this._getRESTURL('all'), {params});
    }

    getTaskPriorities(): Observable<ITaskPriority[]> {
        return this._http.get<ITaskPriority[]>(this._concatUrl('priorities'));
    }

    getTaskTypes(): Observable<ITaskActivityType[]> {
        return this._http.get<ITaskActivityType[]>(this._concatUrl('activityTypes'));
    }

    getTaskMinDate (task: ITask): Moment {
        if (task) {
            const {currentStartDate} = task;
            const prevWeekStart = moment().startOf('week').subtract(1, 'week');
            return prevWeekStart.isBefore(currentStartDate) ? moment(currentStartDate) : prevWeekStart;
        }
    }

}

function getStartDatePatchDto(item) {
    return _.pick(item, TaskFields.StartDate);
}

function getEndDatePatchDto(item) {
    return _.pick(item, TaskFields.EndDate);
}

function transformDeliverable(message: IRealtimeMessage<any>) {
    return {
        ...message,
        payload: {
            ...message.payload,
            type: TaskType.Deliverable,
        },
    };
}
