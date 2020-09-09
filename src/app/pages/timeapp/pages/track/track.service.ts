import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { QueryKeys, DayMap } from '../../models';
import { Moment } from 'moment';

@Injectable()
export class TrackService {
    constructor(private _router: Router) {
    }

    public isActiveDay({ date }: DayMap, selectedDate: Moment) {
        return selectedDate && date ? selectedDate.isSame(date, 'day') : false;
    }

    public setSelectedDate(_date, isWeekMode: boolean = false) {
        const date = moment(_date);
        const queryParams = {};

        if (isWeekMode) {
            queryParams[QueryKeys.From] = Date.toServerDate(date.startOf('isoWeek'));
            queryParams[QueryKeys.To] = Date.toServerDate(date.endOf('isoWeek'));
        } else {
            queryParams[QueryKeys.From] = Date.toServerDate(date);
            queryParams[QueryKeys.To] = Date.toServerDate(date);
        }

        this.handleNavigateByParams(queryParams);
    }

    public handleNavigateByParams(queryParams) {
        this._router.navigate([], {
            replaceUrl: true,
            queryParams,
            queryParamsHandling: 'merge',
        });
    }
}
