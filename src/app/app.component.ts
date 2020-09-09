import { Component } from '@angular/core';
import * as moment from 'moment';
import { Moment, MomentInput } from 'moment';
import { LocalizationService } from './localization.service';

const DEFAULT_SERVER_DATE_FORMAT = 'YYYY-MM-DD';

function getMomentObj(date?: MomentInput): Moment {
    return moment(date || undefined);
}

function throwInvalidDateError(message?: string) {
    console.error(message || 'You provided an invalid date');
}

Date.toServerDate = function (date: MomentInput, includeTimezone = false): string {
    date = getMomentObj(date);

    const timezoneOffset = getMomentObj(date).utcOffset();

    return getMomentObj(date).format(
        `${includeTimezone ? getTimeZoneOffsetFormat(timezoneOffset) : DEFAULT_SERVER_DATE_FORMAT}`
    );

};

function getTimeZoneOffsetFormat(timeZoneOffsetMinutes: number): string {
    try {
        const offsetHours = timeZoneOffsetMinutes / 60;
        const sign = offsetHours >= 0 ? '+' : '-';

        return `${DEFAULT_SERVER_DATE_FORMAT}T00:00:00${sign}${timeZoneOffsetToString(offsetHours)}`;

    } catch (e) {
        throwInvalidDateError('You provided an invalid date for time zone');
    }
}

function timeZoneOffsetToString(offsetHours: number): string {
    offsetHours = Math.abs(offsetHours);
    return `${offsetHours < 10 ? '0' + offsetHours : offsetHours}:00`;
}

Date.fromServerDate = function (date: string): Moment {
    return getMomentObj(date);
};

Date.weekFirstDay = function (date: string): Moment {
    return getMomentObj(date).startOf('isoWeek');
};

Date.weekLastDay = function (date: string): Moment {
    return getMomentObj(date).endOf('isoWeek');
};

Date.getWeekRange = function (dateInWeek?: MomentInput): IWeekRange {
    return {
        startDate: getMomentObj(dateInWeek).startOf('isoWeek'),
        endDate: getMomentObj(dateInWeek).endOf('isoWeek'),
    };
};

Date.isFutureDay = function (date: MomentInput): boolean {
    return !getMomentObj(date).startOf('day').isSameOrBefore(moment().startOf('day'));
};

Date.isTodayOrAfter = function (date: MomentInput): boolean {
    return getMomentObj(date).isSameOrAfter(new Date(), 'day');
};

/**
 * Date is editable in range from the first day of previous week until today
 * **/
Date.inEditableRange = function (date: MomentInput): boolean {
    date = getMomentObj(date);

    const prevWeekStart = moment().startOf('week').subtract(1, 'week');

    return date.isSameOrAfter(prevWeekStart, 'day') && date.isSameOrBefore(moment(), 'day');
};

Date.isBetweenDays = function (date: MomentInput, from: MomentInput, to: MomentInput) {
    return getMomentObj(date).isBetween(from, to, 'days', '[]');
};


// TODO: Implement locale service
moment.updateLocale('en', {
    week: {
        dow: 1,
        doy: 7,
    }
});

moment.updateLocale('uk', {
    week: {
        dow: 1,
        doy: 7,
    }
});

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {
    constructor(private localizationService: LocalizationService) {
    }
}
