import {IAssignment} from '../assignments/assignment';
import {TaskStatus} from './task-status';
import {IAttachment} from '../../services/common/attachments.provider';
import {ITaskPriority} from './task-priority.interface';

export enum TaskType {
    Task,
    Deliverable,
}

export enum TaskFields {
    Wbs = 'wbs',
    StartDate = 'currentStartDate',
    EndDate = 'currentEndDate',
    Status = 'status',
}

export interface IBasicTask {
    id: number;
    name: string;
    status: TaskStatus;
    projectId: number;

    currentStartDate?: string;
}

export interface IBaseTask extends IBasicTask {
    type: TaskType;
    description?: string;
    wbs?: string;
    phaseId?: string;
    phaseName?: string;
    creatorId: number;
    assignments?: IAssignment[];
    assignment?: boolean;
    plannedTime: number;
    actualTime: number;
    currentEndDate: string;
    dependsOn: IDependency[];
    dependentOn: IDependency[];
}

export interface ITask extends IBaseTask {
    progress: number;
    type: TaskType.Task;
    workCompleted: number;
    priorityId?: ITaskPriority[];
    activityTypeId?: TaskActivity;
    modifieldInGantt?: boolean;
    createdAt?: number;
    lastModified?: number;
}

// TODO: Think about naming
export interface IAttachmentWithCustomProperties extends IAttachment {
    link?: string;
    uri?: string;
    load?: boolean;
    nameOriginal?: string;
    active?: boolean;
    isFile?: boolean;
    selected?: boolean;
    svgVideo?: boolean;
}

export interface ITaskWithProgressDetails extends ITask {
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: number;
    actualEndDate: number;
    initialStartDate: number;
    initialEndDate: number;
    currentTime: number;
    remainingTime: number;
}

export enum TaskActivity {
    Userstory = 1,
    Bug,
    Task,
    Issue,
}

export interface IDependency {
    id: number;
    type: DependencyType;
}

export enum DependencyType {
    StartToStart,
    StartToFinish,
    FinishToFinish,
    FinishToStart
}

export interface IDeliverable extends IBaseTask {
    type: TaskType.Deliverable;
}

export type TaskOrDeliverable = ITask | IDeliverable;
