import { CommunicationConfig, HolidaysProvider, ICopyHolidaysParams, IHoliday } from 'communication';
import { HttpProvider } from './http.provider';
import { Observable } from 'rxjs';
import { RealtimeAction, RealtimeSuffix } from '../common/realtime.provider';
import { map } from 'rxjs/operators';

export abstract class HttpHolidaysProvider extends HttpProvider<IHoliday> implements HolidaysProvider {
    create$ = this._getObservable(RealtimeAction.Create, RealtimeSuffix.Holidays)
        .pipe(map((message) => {
            if (message.internal)
                return message;

            return {
                ...message,
                payload: message.payload.holidays
            };
        }));
    update$ = this._getObservable(RealtimeAction.Update, RealtimeSuffix.Holiday);
    delete$ = this._getObservable(RealtimeAction.Delete, RealtimeSuffix.Holidays)
        .pipe(map((message) => {
            if (message.internal)
                return message;

            return {
                ...message,
                payload: message.payload.ids.map(id => ({id}))
            };
        }));

    protected _getURL(config: CommunicationConfig): string {
        return `${ config.http.settings }/holidays`;
    }

    copyHolidays(params: ICopyHolidaysParams): Observable<IHoliday[]> {
        const destinationYear = new Date().getUTCFullYear();
        return this._http.post<any>(this._getRESTURL('copy'), {...params, destinationYear});
    }
}
