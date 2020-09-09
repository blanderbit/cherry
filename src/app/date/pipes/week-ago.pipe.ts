import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { IWeekRangePipeParams, WeekRangePipe } from './week-range.pipe';

export const WeekAgoPipeConfig = new InjectionToken<IWeekAgoPipeParams>('week ago pipe config');

export interface IWeekAgoPipeParams extends IWeekRangePipeParams {
    defaultText: string;
}

@Pipe({
    name: 'weekAgo'
})
export class WeekAgoPipe extends WeekRangePipe<IWeekAgoPipeParams> implements PipeTransform {
    constructor(@Optional() @Inject(WeekAgoPipeConfig) private _config) {
        super();
    }

    protected getConfig(
        startDateFormatOrConfig: string | IWeekAgoPipeParams = 'MMMM DD -',
        endDateFormat: string = 'DD, YYYY'
    ): IWeekAgoPipeParams {
        return {
            ...super.getConfig(startDateFormatOrConfig, endDateFormat),
            ...this._config,
        };
    }

    protected getWeekDescription(): string {
        const weeksDiff = moment().startOf('week').diff(moment(this.weekDate), 'week');
        const {defaultText} = this.config;

        console.log('DIFF', weeksDiff);

        switch (weeksDiff) {
            case 0:
                return 'This week';
            case 1:
                return 'Last week';
            default:
                return defaultText || super.getWeekDescription();
        }
    }
}
