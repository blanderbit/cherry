import { AssignmentStatus } from 'communication';

export interface IActualTimeParams {
    taskId: number;
}

export interface IActualTimesParams {
    taskId?: string;
    resourceId?: number;
}

export interface IActualTimeResponse {
    resourceId: number;
    plannedTime: number;
    actualTime: number;
    remaningTime: number;
}

export interface ICreateActualTimeParams {
    time: number;
    date: number;
    comment: string;
}

export interface IDeleteActualTimeParams extends IActualTimeParams {
    ids: number[];
}

export interface IUpdateAssignmentData {
    resourceId: number;
    status: AssignmentStatus;
    taskId: number;
}
