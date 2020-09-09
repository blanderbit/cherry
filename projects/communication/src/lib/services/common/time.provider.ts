import {Provider} from './provider';
import {IAssignment} from '../../models/assignments/assignment';
import {Observable} from 'rxjs';
import {IActualTime} from '../../models/actual-time';
import * as moment from 'moment';

export interface IPlanEffortRequestData {
    plannedTime: number;
    resourceId: number;
}

// extends Provider<IAssignment>
export abstract class TimeProvider extends Provider<IActualTime> {

    static isBeforeStartDate(date, task) {
        const {currentStartDate} = task;
        const prevWeekStart = moment().startOf('week').subtract(1, 'week');
        const from = prevWeekStart.isBefore(currentStartDate) ? moment(currentStartDate) : prevWeekStart;

        const momentDate = moment(date);
        return momentDate.isBefore(from);
    }

    abstract planEffort(assignments: IPlanEffortRequestData[], taskId: number, resourceId: number): Observable<IAssignment[]>;



}
