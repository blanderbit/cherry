import { ExcludeId, Provider } from './provider';
import { IAssignment } from '../../models/assignments/assignment';
import { Observable } from 'rxjs';
import { AssignmentStatus } from '../../models';
import { IGeAssignmentsParams } from '../http/http-assignments.provider';
import {
    IActualTimeParams,
    IActualTimeResponse,
    IActualTimesParams,
    ICreateActualTimeParams,
    IDeleteActualTimeParams,
} from '../../models/assignments';

export type PlanEffortData = Pick<IAssignment, 'resourceId' | 'plannedTime'>;

function numberOrEmpty(value: string) {
    return parseInt(value, 10) || null;
}

export abstract class AssignmentsProvider extends Provider<IAssignment> {
    static assignmentCompleted(item: AssignmentStatus | {status: AssignmentStatus}) {
       if (item) {
           return getAssignmentStatus(item) === AssignmentStatus.Completed;
       }
    }

    static parseAssignmentId(assignmentId: string = ''): Partial<IAssignment> {
        const [resourceId, taskId, projectId] = String(assignmentId).split('.');

        return {
            resourceId: numberOrEmpty(resourceId),
            taskId: numberOrEmpty(taskId),
            projectId: numberOrEmpty(projectId),
        };
    }

    static createAssignmentId(resourceId: number, taskId: number): string {
        return `${resourceId}.${taskId}`;
    }

    static getAssignments(items: IAssignment[]): IAssignment[] {
        return items.map(AssignmentsProvider.getAssignment);
    }

    static getAssignment(item: IAssignment): IAssignment {
        return {
            id: AssignmentsProvider.createAssignmentId(item.resourceId, item.taskId),
            ...item,
        };
    }

    static assignmentOverdue(actualTimeOrAssignment: number | IAssignment, plannedTime?: number): boolean {
        if (actualTimeOrAssignment != null && typeof actualTimeOrAssignment === 'object') {
            plannedTime = actualTimeOrAssignment.plannedTime;
            actualTimeOrAssignment = actualTimeOrAssignment.actualTime;
        }

        return plannedTime > 0 && actualTimeOrAssignment > plannedTime;
    }

    abstract getItems(params?: IGeAssignmentsParams): Observable<IAssignment[]>;

    abstract getItemsByTaskIds(ids): Observable<IAssignment[][]>;

    abstract createItems(taskId: number, resources: Pick<IAssignment, 'resourceId'| 'plannedTime'>[]): Observable<any>;

    abstract updateStatus(data: Pick<IAssignment, 'taskId' | 'status' | 'resourceId'>);

    abstract planEffort(items: PlanEffortData[], projectId: number, taskId: number): Observable<IAssignment[]>;

    // abstract updatePlanEffort(item: IAssignment, data): Observable<any>;

    abstract getActualTimeCollection(obj?: IActualTimesParams): Observable<IAssignment[]>;

    abstract getActualTime(params: IActualTimeParams): Observable<IActualTimeResponse>;

    abstract addActualTime(item: ExcludeId<ICreateActualTimeParams>, params?: IActualTimeParams):
        Observable<IActualTimeResponse>;

    abstract deleteActualTimeItems(params: IDeleteActualTimeParams);

    abstract getAvailableAssignments(params?: any): Observable<number[]>;

    // abstract updateItems(items: IAssignment[]): Observable<IAssignment[]>;
}

function getAssignmentStatus(statusOrObj: AssignmentStatus | {status: AssignmentStatus}) {
    if (typeof statusOrObj === 'object') {
        return statusOrObj.status;
    }

    return statusOrObj;
}
