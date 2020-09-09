import { Provider } from '../common/provider';
import { IHoliday } from '../../models/holiday';
import { Observable } from 'rxjs';

export interface ICopyHolidaysParams {
    holidayPolicyId: number;
    sourceYear: number;
}

export abstract class HolidaysProvider extends Provider<IHoliday> {
    abstract copyHolidays(params: ICopyHolidaysParams): Observable<IHoliday[]>;
}
