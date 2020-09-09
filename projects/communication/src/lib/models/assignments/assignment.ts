import { IIdObject } from '../id.object';
import { AssignmentStatus } from './assignment-status';
import { IResource } from 'communication';

export interface IAssignment extends IIdObject {
    // taskId: number;
    plannedTime: number;
    status: AssignmentStatus;
    resourceId: number;

    projectId?: number;
    actualTime?: number;
    taskId?: number;
    progress?: number;
}

