import { Component, Inject, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import {IActualTime, ITaskWithProgressDetails, TasksProvider, TimeProvider} from 'communication';
import { TaskId } from '../add-assignee/add-assignee.component';
import { ItemsComponent } from 'components';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotifierService } from 'notifier';
import { WeekdayComponent } from '../weekday/weekday.component';
import { DatepickerComponent } from 'date';
import { ResourceId } from '../assignee';

interface IEditTimeDialogParams {
    from?: string;
    to?: string;
    taskId?: number;
    resourceId?: number;
}

@Component({
    selector: 'app-edit-time-dialog',
    templateUrl: './edit-time-dialog.component.html',
    styleUrls: ['./edit-time-dialog.component.scss'],
})
export class EditTimeDialogComponent extends ItemsComponent<IActualTime, IEditTimeDialogParams> implements OnInit {

    @ViewChildren(WeekdayComponent)
    private week: WeekdayComponent[];

    @ViewChild(DatepickerComponent, {static: false}) datepickerRef: DatepickerComponent;

    weekDates: IActualTime[] = [];
    loadDataOnInit = true;
    loadDataOnParamsChange = false;
    private _task: ITaskWithProgressDetails = null;

    @Input()
    public set task(value: ITaskWithProgressDetails) {
        this._task = value;
    }

    public get task() {
        return this._task;
    }

    get  getTaskMinDate() {
        return this._tasksProvider.getTaskMinDate(this.task);
    }

    get params() {
        return this._params;
    }

    get submitDisabled() {
        return this.week ? !this.week.some(w => !w.form.disabled && w.form.dirty) : true;
    }

    constructor(
        protected _provider: TimeProvider,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected _notifier: NotifierService,
        public ngbModal: NgbModal,
        @Inject(TaskId) private taskId: number,
        @Inject(ResourceId) private resourceId: number,
        protected _tasksProvider: TasksProvider,
    ) {
        super();
    }

    loadData(params: IEditTimeDialogParams = {}) {
        super.loadData({
            ...getWeekRange(),
            ...params,
            taskId: this.taskId,
            resourceId: this.resourceId,
        });
    }

    onDateSelect(date) {
        this.loadData(getWeekRange(date));
    }

    isAddTimeDisabled(actualTime: IActualTime) {
        const date = moment(actualTime.date);

        return !date.isBetween(this.getTaskMinDate, moment(), 'days', '[]');
    }

    protected _handleResponse(response: IActualTime[]) {
        super._handleResponse(response);
        this.setDates(response);
    }

    submit(e) {
        const hide = this.showLoading();

        forkJoin(this.week.map(w => w.submit(e)).filter(w => !!w)).pipe(
            finalize(() => {
                hide();
                this.ngbModal.dismissAll();
            }),
        ).subscribe(
            () => this.showSuccess('action.edit-time-success'),
            error => this.showError(error, 'action.edit-time-error'),
        );
    }

    setDates(actualTimes: IActualTime[]) {
        const {from} = this._params;

        const firstWeekDay = moment(from).locale('en');
        this.weekDates = this.getDates(firstWeekDay).map((date) => {
            return {
                taskId: this.taskId,
                time: 0,
                date: Date.toServerDate(date),
                ...actualTimes.find(at => Date.toServerDate(at.date) === Date.toServerDate(date)),
            } as IActualTime;
        });
    }

    getDates(startOfWeek: Moment): any[] {
        return new Array(7).fill('')
            .map((v, index) => moment(startOfWeek).add(index, 'day'));
    }

    triggerClick() {
        setTimeout(() => {
            this.datepickerRef.open();
        });
    }
}

function getWeekRange(date?: any) {
    return {
        from: Date.toServerDate(Date.weekFirstDay(date)),
        to: Date.toServerDate(Date.weekLastDay(date)),
    };
}
