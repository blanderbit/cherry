import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsComponent } from 'components';
import { IActualTime, IIdObject, TimeProvider } from 'communication';
import { NotifierService } from 'notifier';
import { IViewModeHandler, ViewModeHandler } from '../track.component';
import { DayModeParams, IViewModeParams, WeekModeParams } from '../../../models';

@Component({
    selector: 'app-track-current-days-list',
    templateUrl: './track-current-days-list.component.html',
    styleUrls: ['./track-current-days-list.component.scss']
})

export class TrackCurrentDaysListComponent extends ItemsComponent<IActualTime, IViewModeParams> implements OnInit, OnDestroy {
    listData: { date: Date, totalTime: number | string, queryParams: any }[] = [];
    loadDataOnQueryParamsChange: boolean = true;
    loadDataOnInit: boolean = false;
    loadDataOnParamsChange: boolean = false;
    setPaginationQueryParams = false;

    weekParams = <IViewModeParams>{};

    get viewModeParamsHandler() {
        return this.viewModeHandler.viewModeParams;
    }

    get selectedDate() {
        if (this._weekViewHandler) {
            const {from, to} = this._weekViewHandler.params;
            return from || to;
        }
    }

    get date() {
        const {from, to} = this._dayViewHandler.params;
        return from || to;
    }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _provider: TimeProvider,
        protected _notifier: NotifierService,
        protected _weekViewHandler: WeekModeParams,
        protected _dayViewHandler: DayModeParams,
        @Inject(ViewModeHandler) public viewModeHandler: IViewModeHandler,
    ) {
        super();
    }

    protected _handleResponse(response: IActualTime[]) {
        super._handleResponse(response);
        this.weekParams = this._weekViewHandler.getParamsFromDate(this.date);
        this.createList(response);
    }

    protected _handleCreateItem(item: IActualTime[] | IActualTime) {
        super._handleCreateItem(item);
        this.createList(this.items);
    }

    protected _handleUpdateItem(items: IActualTime) {
        super._handleUpdateItem(items);
        this.createList(this.items);
    }

    protected _handleDeleteItem(items: IIdObject) {
        super._handleDeleteItem(items);
        this.createList(this.items);
    }

    getParams(params?: any): IViewModeParams {
        return this._weekViewHandler.params;
    }

    createList(listItems?: IActualTime[]) {
        this.listData = new Array(7).fill('')
            .map((_, index) => moment(this.date).startOf('week').add(index, 'days'))
            .map((date) => {
                return {
                    date: date.toDate(),
                    queryParams: this.viewModeParamsHandler.getParamsFromDate(date),
                    totalTime: (listItems || []).filter(item => datesEqual(item.date, date))
                        .reduce(calculateTime, 0)
                };
            });
    }

    protected isQueryParamsChanged(oldParams: IViewModeParams, params: IViewModeParams): boolean {
        if (oldParams) {
            const {startDate, endDate} = Date.getWeekRange(this.date);
            const {from, to} = this.weekParams;
            const date = moment(startDate || endDate);

            return date.isAfter(to) || date.isBefore(from);
        }

        return true;
    }

    ifAfterToday(date: any) {
        if (date) {
            return moment(date.date).isAfter();
        }
    }
}

function datesEqual(date1: any, date2: any): boolean {
    return Date.toServerDate(date1) == Date.toServerDate(date2);
}

function calculateTime(accum: number, item: IActualTime) {
    return accum + item.time;
}
