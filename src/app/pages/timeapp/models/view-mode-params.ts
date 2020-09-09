import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryKeys } from './query-keys';
import { tap } from 'rxjs/operators';

export interface IViewModeParams {
    from: any;
    to: any;
}

@Injectable()
export abstract class ViewModeParams {
    protected _params: IViewModeParams;

    get params() {
        return this._params;
    }

    set params(value) {
        this._params = value;
    }

    constructor(protected router: Router, protected route: ActivatedRoute) {
        this.route.queryParams
            .subscribe((params) => this.params = this.getFromQueryParams(params));
    }

    getFromQueryParams(params?: Partial<IViewModeParams>): IViewModeParams {
        const {from, to} = params;

        return this.getParamsFromDate(from || to);
    }

    abstract getParamsFromDate(date?: any): IViewModeParams;

    abstract getNextParams(): IViewModeParams;

    abstract getPrevParams(): IViewModeParams;
}

export class WeekModeParams extends ViewModeParams {
    getPrevParams() {
        const {from, to} = this.params;

        return this.getParamsFromDate(moment(from || to).subtract(1, 'week').startOf('day'));
    }

    getNextParams() {
        const {from, to} = this.params;

        return this.getParamsFromDate(moment(from || to).add(1, 'week').startOf('day'));
    }

    getParamsFromDate(date?: any): IViewModeParams {
        const {startDate, endDate} = Date.getWeekRange(date);

        return {
            [QueryKeys.From]: Date.toServerDate(startDate),
            [QueryKeys.To]: Date.toServerDate(endDate),
        };
    }
}

export class DayModeParams extends ViewModeParams {
    getPrevParams() {
        const {from, to} = this.params;

        return this.getParamsFromDate(moment(from || to).subtract(1, 'day'));
    }

    getNextParams() {
        const {from, to} = this.params;

        return this.getParamsFromDate(moment(from || to).add(1, 'day'));
    }

    getParamsFromDate(date?: any): IViewModeParams {
        date = Date.toServerDate(moment(date || undefined));

        return {
            [QueryKeys.From]: date,
            [QueryKeys.To]: date,
        };
    }
}
