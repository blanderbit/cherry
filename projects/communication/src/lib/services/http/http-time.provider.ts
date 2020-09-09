import { HttpProvider } from './http.provider';
import { IAssignment } from '../../models/assignments/assignment';
import { CommunicationConfig, ExcludeId, IActionConfig, IIdObject } from 'communication';
import { AssignmentsProvider } from '../common/assignments.provider';
import { RealtimeAction } from '../common/realtime.provider';
import { Observable, Subject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IPlanEffortRequestData, TimeProvider } from '../common/time.provider';
import { ACTUAL_TIME_SUFFIX, AssignmentsRealtimeActions } from './http-assignments.provider';
import { HttpParams } from '@angular/common/http';
import { IActualTime, IUserActualTime } from '../../models/actual-time';

// implements TimeProvider
export class HttpTimeProvider extends HttpProvider<IActualTime> implements TimeProvider {
    private _plannedEffortUpdate$ = new Subject<IPlanEffortRequestData[]>();
    public plannedEffortUpdate$ = this._plannedEffortUpdate$.asObservable();

    protected _getURL(config: CommunicationConfig): string {
        return config.http.tasks;
    }

    // TODO: Remove if nothing break
    getUpdatesActions(): (string | IActionConfig)[] {
        return [
            ...super.getUpdatesActions(),
            {
                type: 'ActualTimeUpdated',
                transform: (message) => {
                    return message;
                },
            },
        ];
    }

    getCreateActions(): (string | IActionConfig)[] {
        return [
            {
                type: 'ActualTimeCreated',
                transform: (message) => {
                    return message;
                }
            },
        ];
    }

    // getDeleteActions(): (string | IActionConfig)[] {
    //     return [
    //         {
    //             type: 'ActualTimeDeleted',
    //             transform: (message) => {
    //                 return message;
    //             }
    //         },
    //     ];
    // }

    protected _getType(): string {
        return 'actualTime';
    }

    protected _getRESTURL(id?): string {
        return this._concatUrl('actualTimes', id);
    }

    createItem(item: ExcludeId<IActualTime>, options?: any): Observable<any> {
        return super.createItem(item, options)
            .pipe(
                tap((res) => {
                    this._emitRealtime(
                        assignmentTimeToRealtime(res),
                        AssignmentsRealtimeActions.AssignmentActualTimeUpdated, ''
                    );

                    this._emitRealtime(
                        assignmentTimeToRealtime(res),
                        'ActualTimeCreated', ''
                    );
                })
            );
    }

    updateItem(item: IActualTime): Observable<any> {
        return super.updateItem(item)
            .pipe(
                tap((res) => {
                    this._emitRealtime(
                        assignmentTimeToRealtime(res),
                        AssignmentsRealtimeActions.AssignmentActualTimeUpdated, ''
                    );

                    this._emitRealtime(
                        assignmentTimeToRealtime(res),
                        'ActualTimeUpdated', ''
                    );
                })
            );
    }

    deleteItem(id: number | string): Observable<any> {
        return super.deleteItem(id)
            .pipe(
                tap((res) => {
                    this._emitRealtime(
                        assignmentTimeToRealtime(res),
                        'ActualTimeDeleted', ''
                    );
                })
            );
    }

    getItems(obj?: any): Observable<IActualTime[]> {
        const params = new HttpParams({fromObject: obj});

        if (obj.resourceId) {
            return this._http.get<IActualTime[]>(this._concatUrl(ACTUAL_TIME_SUFFIX), {params});
        } else {
            return this._http.get<IActualTime[]>(this._concatUrl(`my-${ACTUAL_TIME_SUFFIX}`), {params});
        }
    }

    planEffort(assignments: IPlanEffortRequestData[], taskId: number, resourceId: number): Observable<IAssignment[]> {
        const userAssignment = assignments.find(a => a.resourceId === resourceId);
        return this._http.put(this._concatUrl('tasks', taskId, 'assignments'), {assignments}).pipe(
            map(this.combineResponse(assignments)),
            tap((v) => {
                this._emitRealtime(assignmentTimeToRealtime(<any>{
                    ...userAssignment,
                    taskId,
                    resourceId
                }), AssignmentsRealtimeActions.AssignmentPlannedTimeUpdated, '');
            }),
        );
    }
}

interface IParseActualTimeId {
    projectId: string;
    taskId: string;
    deleteItemsId?: string[];
}

export function createActualTimeId(projectId: number, taskId: number, deleteItemsId: number[] = []) {
    return createFakeId(projectId, taskId, ...deleteItemsId);
}

export function parseActualTimeId(id: string): IParseActualTimeId {
    const [projectId, taskId, ...deleteItemsId] = id.toString().split('.');

    return {projectId, taskId, deleteItemsId};
}

export function createFakeId(...params) {
    return params.join('.');
}

function assignmentTimeToRealtime(item: { taskId: number, resourceId: number, time?: number }): IIdObject & any {
    const {taskId, resourceId, time: actualTime} = item;

    if (resourceId) {
        const obj = {
            ...item,
            id: AssignmentsProvider.createAssignmentId(resourceId, taskId),
        };

        if (actualTime != null) {
            obj.time = actualTime;
        }

        return obj;
    }

    console.warn('Resource id required to emit realtime message');
}
