import { Inject, InjectionToken, Optional, Pipe, PipeTransform } from '@angular/core';
import { LocalDatePipe } from './local-date.pipe';
import * as moment from 'moment';

export const DaysAgoPipeConfig = new InjectionToken<IDaysAgoPipeConfig>('days ago pipe directive');

export interface IDaysAgoPipeConfig {
    defaultText: string;
}

@Pipe({
    name: 'daysAgo',
})
export class DaysAgoPipe extends LocalDatePipe implements PipeTransform {
    constructor(@Optional() @Inject(DaysAgoPipeConfig) protected config: IDaysAgoPipeConfig) {
        super();
    }

    transform(value: any, args?: any): any {
        const today = moment().startOf('day');
        const date = (value ? moment(value) : moment()).startOf('day');
        const daysDiff = today.diff(date, 'days');

        switch (daysDiff) {
            case 0:
                return 'Today';
            case 1:
                return 'Yesterday';
            default:
                const {defaultText} = this.config || <IDaysAgoPipeConfig>{};
                return (defaultText && !args) ? defaultText : super.transform(value, args);
        }
    }
}
