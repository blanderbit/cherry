import { IActualTime, ITask } from 'communication';

export interface IWeekItem {
    taskId: number;
    dayTotal?: number;
    times: IActualTime[];
    task?: ITask;
}
