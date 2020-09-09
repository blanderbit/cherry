import { IIdObject } from '../id.object';

export interface ITaskComment extends IIdObject {
    taskId: number;
    resourceId: number;
    createdAt: string | number;
    lastModified: string | number;
    text: string;
    fileInput?: any;
    mentions?: number[];
}
