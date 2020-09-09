import { IIdObject } from './id.object';
import { AssignmentStatus } from './assignments/assignment-status';

export interface IActualTime extends IIdObject {
    time: number;
    date: string;
    taskId: number;
    comment?: string;
    status?: AssignmentStatus;
    // for TimeProvider realtime
    resourceId?: number;
}

export interface IUserActualTime {
    resourceId: number;
    plannedTime: number;
    actualTime: number;
    remainingTime: number;
}
