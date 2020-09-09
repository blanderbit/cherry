import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

export interface IWeekRangePipeConfig extends IWeekRangePipeParams, IWeekRange {
}

export interface IWeekRangePipeParams {
    startDateFormat: string;
    endDateFormat: string;
}

@Pipe({
    name: 'weekRange'
})
export class WeekRangePipe<Params extends IWeekRangePipeParams = IWeekRangePipeParams,
    Config extends Params & IWeekRangePipeConfig = Params & IWeekRangePipeConfig>
    implements PipeTransform {

    protected weekDate: any;
    protected config: Config;

    transform(weekDate: any, startDateFormatOrConfig?: string | Params, endDateFormat?: string): string {
        this.weekDate = weekDate;
        this.config = <Config>this.getConfig(startDateFormatOrConfig, endDateFormat);

        return this.getWeekDescription();
    }

    protected getConfig(
        startDateFormatOrConfig: string | Params = 'MMMM DD - ',
        endDateFormat: string = 'DD, YYYY'
    ): Params {
        let config: Config;

        if (typeof startDateFormatOrConfig === 'object') {
            config = <Config>startDateFormatOrConfig;
        } else {
            config = <Config>{startDateFormat: startDateFormatOrConfig, endDateFormat};
        }

        console.log('WEEK RANGE', this.weekDate, Date.getWeekRange(this.weekDate));
        return {
            ...config,
            ...Date.getWeekRange(this.weekDate),
        };
    }

    protected getWeekDescription() {
        const {startDate, endDate, startDateFormat, endDateFormat} = this.config;
        const weekStartDescription = getWeekDateDescription(startDate, startDateFormat);
        const weekEndDescription = getWeekDateDescription(endDate, endDateFormat);

        return `${weekStartDescription}${weekEndDescription}`;
    }
}

function getWeekDateDescription(weekStartOrEnd, format = null) {
    return format ? moment(weekStartOrEnd).format(format) : '';
}
