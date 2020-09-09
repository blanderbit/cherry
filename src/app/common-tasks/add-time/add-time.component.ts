import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from 'components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'notifier';
import { ActivatedRoute } from '@angular/router';
import {
    AssignmentStatus,
    IActualTime,
    IAssignment,
    IIdObject,
    ITask,
    ITaskWithProgressDetails, TasksProvider,
    TimeProvider,
} from 'communication';
import { merge, Observable } from 'rxjs';
import { ProfileService } from '../../identify/profile.service';
import { map, startWith } from 'rxjs/operators';
import { IRangeParams } from 'date';
import * as moment from 'moment';
import { QueryKeys } from '../../pages/timeapp/models';
import { Moment } from 'moment';

interface IAddTimeFormValue {
    date: number;
    time: number;
    comment: string;
}

type IAddTimeFormControls = { [key in keyof IAddTimeFormValue]: FormControl };

export interface IAddTimeComponentParams {
    userAssignment: IAssignment;
    task: ITask;
}

@Component({
    selector: 'app-add-time',
    templateUrl: './add-time.component.html',
    styleUrls: ['../plan-effort/add-effort.component.scss', './add-time.component.scss'],
})
export class AddTimeComponent extends FormComponent<IActualTime> implements OnInit, IAddTimeComponentParams, AfterViewInit {
    readonly currentDate = Date.toServerDate(new Date());
    private _userAssignment: IAssignment = null;
    private _task: ITaskWithProgressDetails = null;

    searchParams: {};
    item: IActualTime;
    loadDataOnInit = false;
    loadDataOnParamsChange = false;
    previousWeekStart = moment().startOf('week')
        .subtract(1, 'week');


   get taskMinDate() {
       return this._tasksProvider.getTaskMinDate(this.task)
   }

    @Input()
    public set task(value: ITaskWithProgressDetails) {
        this._task = value;
    }

    public get task() {
        return this._task;
    }

    @Input()
    public set userAssignment(value: IAssignment) {
        this._userAssignment = value;
    }

    public get userAssignment() {
        return this._userAssignment;
    }

    get remainingTime() {
        if (this.userAssignment) {
            const {actualTime = 0, plannedTime = 0, status} = this.userAssignment;
            if (!plannedTime || actualTime > plannedTime || status === AssignmentStatus.Completed) return 0;

            return (plannedTime - actualTime) || 0;
        }

        return 0;
    }

    get creatorId() {
        return this.task.creatorId;
    }

    get membersIds() {
        return [this.userAssignment.resourceId];
    }

    get resourceId() {
        return this._profile.resourceId;
    }

    constructor(protected _ngbModal: NgbModal,
                protected _provider: TimeProvider,
                protected _notifier: NotifierService,
                protected _route: ActivatedRoute,
                protected _profile: ProfileService,
                protected _tasksProvider: TasksProvider,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

        this.controls.date.valueChanges
            .pipe(startWith(null))
            .subscribe(v => this.loadData(v));
        merge(
            this.controls.time.valueChanges,
            this.controls.comment.valueChanges,
        ).subscribe(() => this.valueChanged = true);
    }

    ngAfterViewInit() {
        this.searchParams = {
            [QueryKeys.From]: Date.toServerDate(this.task.actualStartDate),
            [QueryKeys.To]: Date.toServerDate(this.task.actualStartDate),
            id: this.task.id,
        };
    }

    update(obj: IActualTime, field?: string) {
        super.update(obj, field);
        // TODO: Think about behavior
        // if (obj.time) {
        //     super.update(obj, field);
        // } else {
        //     super.deleteItem(obj);
        // }
    }

    getDto(): IActualTime {
        const {date, ...rest} = super.getDto();
        return {
            ...rest,
            taskId: this.task.id,
            date: Date.toServerDate(date, true),
            resourceId: this.userAssignment.resourceId
        };
    }

    public loadData(date: any) {
        date = Date.toServerDate(date || new Date());
        super.loadData({from: date, to: date});
    }

    public createForm(): FormGroup {
        return new FormGroup({
            date: new FormControl(this.currentDate, Validators.required),
            time: new FormControl(null, Validators.required),
            comment: new FormControl(null),
        } as IAddTimeFormControls);
    }

    public cancel() {
        this._ngbModal.dismissAll();
    }

    protected _getItem(params?: IRangeParams): Observable<any> {
        const {projectId, id: taskId} = this.task;
        return this._provider.getItems({projectId, taskId, ...params,  resourceId: this.userAssignment.resourceId})
            .pipe(
                map(v => (v && v.length) ? v[0] : getDefaultItem(taskId)),
            );
    }

    protected handleItem(item: IActualTime) {
        super.handleItem(item);
        this.valueChanged = false;
    }

    protected _handleDeleteItem(item: IIdObject) {
        // super._handleDeleteItem(item);
        this.cancel();
    }

    protected _handleSuccessUpdate() {
        super._handleSuccessUpdate();
        this.cancel();
    }

    protected _showSuccessDelete() {
        this._handleSuccessUpdate();
    }

    protected _handleSuccessCreate(response?) {
        this._notifier.showSuccess('Actual time successfully updated');
        this.cancel();
    }

    protected _handleErrorCreate(error: any) {
        console.warn(error);
        this._notifier.showError(
            error);
    }
}

function getDefaultItem(taskId?: number): Partial<IActualTime> {
    return {
        taskId,
        comment: null,
        time: 0,
    };
}
