import { HttpProvider } from './http.provider';
import { AssignmentsProvider } from '../common/assignments.provider';
import { IAssignment } from '../../models/assignments/assignment';
import { CommunicationConfig, ExcludeId, IActionConfig, IRealtimeMessage } from 'communication';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import {
    IActualTimeParams,
    IActualTimeResponse,
    IActualTimesParams,
    ICreateActualTimeParams,
    IDeleteActualTimeParams,
} from '../../models/assignments';
import { IPaginationParams } from '../../models/pagination';
import { RealtimeAction } from '../common/realtime.provider';

export const ACTUAL_TIME_SUFFIX = 'actualtimes';

export interface IGeAssignmentsParams extends Partial<IPaginationParams> {
    resourceId?: number;
    taskId?: number;
}

export enum AssignmentsRealtimeActions {
    TaskAssignments = 'TaskAssignments',
    Assignment = 'Assignment',
    AssignmentDeleted = 'AssignmentDeleted',
    AssignmentStatusChanged = 'AssignmentStatusUpdated',
    // TODO: Change suffix to - Updated
    AssignmentActualTimeChanged = 'AssignmentActualTimeChanged',
    AssignmentPlannedTimeUpdated = 'AssignmentPlannedTimeUpdated',
    AssignmentActualTimeUpdated = 'AssignmentActualTimeUpdated',
}

export class HttpAssignmentsProvider extends HttpProvider<IAssignment> implements AssignmentsProvider {
    create$ = this._getObservable(RealtimeAction.Create, AssignmentsRealtimeActions.TaskAssignments).pipe(map(transformAssignmentsCreate));

    protected _getURL(config: CommunicationConfig): string {
        return config.http.tasks;
    }

    protected _getType(): string {
        return 'Assignment';
    }

    getDeleteActions(): (string | IActionConfig)[] {
        return [
            RealtimeAction.Delete,
            {
                type: AssignmentsRealtimeActions.AssignmentDeleted,
                transform: transformAssignmentsRemove
            }
        ];
    }

    getUpdatesActions(): (string | IActionConfig)[] {
        return [
            RealtimeAction.Update, // for internal message
            {
                type: AssignmentsRealtimeActions.AssignmentStatusChanged,
                transform: transformAssignmentsUpdate,
            },
            {
                type: AssignmentsRealtimeActions.AssignmentPlannedTimeUpdated,
                transform: transformAssignmentsUpdate,
            },
            {
                type: AssignmentsRealtimeActions.AssignmentActualTimeUpdated,
                transform: transformAssignmentsUpdate,
            }
        ];
    }

    getItems(obj?: IGeAssignmentsParams): Observable<IAssignment[]> {
        return super.getItems(obj).pipe(map(AssignmentsProvider.getAssignments));
    }

    createItem(item: ExcludeId<IAssignment>): Observable<any> {
        return throwError('Method does not exist');
    }

    createItems(taskId: number, resources: Pick<IAssignment, 'resourceId' | 'plannedTime'>[] = []): Observable<IAssignment[]> {
        return this._http.post<IAssignment[]>(this._concatUrl(`tasks/${taskId}/assignments`), {resources})
            .pipe(
                map(AssignmentsProvider.getAssignments),
                tap(data => this._emitRealtime(data, RealtimeAction.Create, AssignmentsRealtimeActions.TaskAssignments)),
            );
    }

    updateStatus(data): Observable<IAssignment> {
        const {taskId, status, resourceId} = data;

        return this._http.put(this._concatUrl('tasks', taskId, 'assignments', resourceId, 'status', status), {}).pipe(
            map(this.combineResponse(data)),
            tap(this.onUpdate)
        );
    }

    deleteItem(id: string): Observable<any> {
        const {resourceId, taskId} = AssignmentsProvider.parseAssignmentId(id);

        return this._http.delete(this._concatUrl('tasks', taskId, 'assignments', resourceId))
            .pipe(
                map(() => ({id, taskId})),
                tap(data => this._emitRealtime(data, RealtimeAction.Delete, AssignmentsRealtimeActions.Assignment))
            );
    }

    getItemsByTaskIds(ids?: number[]): Observable<IAssignment[][]> {
        if (!ids || !ids.length) {
            return of([[]]);
        }

        return forkJoin(ids.map(id => this.getItems({taskId: id})
            .pipe(
                catchError(() => [[]]),
            )));
    }

    planEffort(assignments, projectId: number, taskId: number): Observable<IAssignment[]> {
        return this._http.put(this._concatUrl('tasks', taskId),
            {assignments}).pipe(
            map(this.combineResponse(assignments)),
            tap((v) => this.onUpdate(v)),
        );
    }

    // TODO: Remove actual time requests
    getActualTimeCollection(obj?: IActualTimesParams): Observable<IAssignment[]> {
        return this._http.get<IAssignment[]>(this._concatUrl(ACTUAL_TIME_SUFFIX), {
            params: new HttpParams({fromObject: <any>obj}),
        });
    }

    getActualTime(params: IActualTimeParams): Observable<IActualTimeResponse> {
        return this._http.get<IActualTimeResponse>(this._concatUrl('tasks', params.taskId, ACTUAL_TIME_SUFFIX));
    }

    addActualTime(item: ExcludeId<ICreateActualTimeParams>, params?: IActualTimeParams):
        Observable<IActualTimeResponse> {
        return this._http.post<IActualTimeResponse>(this._concatUrl('tasks', params.taskId, ACTUAL_TIME_SUFFIX), item)
            .pipe(map(this.combineResponse(item)));
    }

    deleteActualTimeItems(params: IDeleteActualTimeParams) {
        const p = new HttpParams({
            fromObject: {
                ids: <any>params.ids,
            },
        });
        return this._http.delete(
            this._concatUrl('tasks', params.taskId),
        );
    }

    getAvailableAssignments(params?: any): Observable<number[]> {
        return this._http.get<number[]>(this._getRESTURL('count'), {params});
    }

    protected _getRESTURL(id?): string {
        return this._concatUrl('assignments', id);
    }
}

function transformAssignmentsCreate(message: IRealtimeMessage<any>) {
    if (message.internal)
        return message;

    const {resourceIdToPlannedTime, taskId} = message.payload;

    resourceIdToPlannedTime.map((m) => console.log('transformAssignmentsCreate', m));

    return {
        ...message,
        payload: resourceIdToPlannedTime.map(({Key: resourceId, Value: plannedTime}) => ({
            id: AssignmentsProvider.createAssignmentId(resourceId, taskId),
            plannedTime,
            resourceId,
            taskId,
            status: 1,
            progress: 0,
        })),
    };
}

function transformAssignmentsUpdate(message: IRealtimeMessage<any>) {
    if (message.internal)
        return message;

    const {taskId, resourceId} = message.payload;

    return {
        ...message,
        payload: {
            id: AssignmentsProvider.createAssignmentId(resourceId, taskId),
            ...message.payload,
        },
    };
}

function transformAssignmentsRemove(message: IRealtimeMessage<any>) {
    if (message.internal)
        return message;

    const {resourceId, taskId} = message.payload;

    return {
        ...message,
        payload: {
            id: AssignmentsProvider.createAssignmentId(resourceId, taskId)
        }
    };
}
