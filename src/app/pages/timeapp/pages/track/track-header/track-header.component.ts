import { Component, Inject } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { IWeekAgoPipeParams, WeekAgoPipeConfig } from '../../../../../date/pipes/week-ago.pipe';
import { DaysAgoPipeConfig, IDaysAgoPipeConfig } from 'date';
import { IViewModeHandler, ViewModeHandler } from '../track.component';
import { DayModeParams, WeekModeParams } from '../../../models';

@Component({
    selector: 'app-track-header',
    templateUrl: './track-header.component.html',
    styleUrls: ['./track-header.component.scss'],
    providers: [
        {
            provide: WeekAgoPipeConfig,
            useValue: {
                // TODO: Add translate
                defaultText: 'Selected week',
            } as IWeekAgoPipeParams,
        },
        {
            provide: DaysAgoPipeConfig,
            useValue: {
                defaultText: 'Selected day',
            } as IDaysAgoPipeConfig,
        },
    ],
})
export class TrackHeaderComponent {
    get isWeekMode() {
        return this.viewModeHandler.isWeekMode;
    }

    get params() {
        return this.viewModeHandler.params;
    }

    get date() {
        const { from, to } = this.params;
        return from || to;
    }

    get datepickerDate() {

        return moment(this.params.from).toDate();
    }

    get viewModeParamsHandler() {
        return this.viewModeHandler.viewModeParams;
    }

    get mode() {
        return this.viewModeHandler.mode;
    }

    constructor(private _router: Router,
                @Inject(ViewModeHandler) public viewModeHandler: IViewModeHandler,
                public dayViewParams: DayModeParams,
                public weekViewParams: WeekModeParams,
                private _route: ActivatedRoute,
    ) {
    }

    dateChange(value): void {
        this.viewModeHandler.updateQueryParams(this.viewModeParamsHandler.getParamsFromDate(value));
    }

    toPrev() {
        this.viewModeHandler.updateQueryParams(this.viewModeParamsHandler.getPrevParams());
    }

    toNext() {
        this.viewModeHandler.updateQueryParams(this.viewModeParamsHandler.getNextParams());
    }

    getToday() {
        return new Date();
    }

    canNavigateMonth(navDate, num) {
        const clonedDate = moment(navDate);
        clonedDate.add(num, 'month');
        return moment().isAfter(clonedDate);
    }

    isTodayOrAfter() {

        return Date.isTodayOrAfter(this.params.to);
    }

}
