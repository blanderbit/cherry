import {Component, Inject, OnInit, ViewChildren} from '@angular/core';
import {AssignmentStatus, IActualTime, IIdObject, ITask, TimeProvider} from 'communication';
import {ItemsComponent} from 'components';
import {TaskCommentsParams} from '../../../../common-tasks/task-comments';
import {DialogConfig} from '../../../../ui/dialogs/dialogs';
import {ActivatedRoute, Router} from '@angular/router';
import {CommentDialogControlComponent} from '../comment-dialog-control/comment-dialog-control.component';
import {forkJoin, Observable, of} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'notifier';
import * as moment from 'moment';
import {IProjectIdProvider, ProjectsPermissionsManager} from 'permissions';

export interface ICommentsDialogConfig extends IProjectIdProvider {
    task: ITask;
    items: IActualTime[];
}

@Component({
    selector: 'app-comments-dialog',
    templateUrl: './comments-dialog.component.html',
    styleUrls: ['./comments-dialog.component.scss'],
})
export class CommentsDialogComponent extends ItemsComponent<IActualTime, Partial<TaskCommentsParams>> implements OnInit {
    public loadDataOnParamsChange = false;
    public prevWeekStart = moment().subtract(1, 'week').startOf('week');

    @ViewChildren(CommentDialogControlComponent)
    private week: CommentDialogControlComponent[];

    isFutureDay = Date.isFutureDay;

    get showDayName() {
        return Array.isArray(this.dialogConfig && this.dialogConfig.items);
    }

    get submitDisabled() {
        return this.week ? !this.week.some(w => !w.form.disabled && w.form.dirty) : true;
    }

    get commentsLoading() {
        return this.week.some(w => w.loading);
    }

    get task() {
        return this.dialogConfig.task;
    }

    get disabledByStatus() {
        const statusItem = this.items.find(itemWithStatus);
        return statusItem ? statusItem.status === AssignmentStatus.Completed : false;
    }

    constructor(
        protected _provider: TimeProvider,
        protected _router: Router,
        protected _route: ActivatedRoute,
        protected _dialog: NgbActiveModal,
        protected _notifier: NotifierService,
        protected _permissionsManager: ProjectsPermissionsManager,
        @Inject(DialogConfig) public dialogConfig: ICommentsDialogConfig,
    ) {
        super();
    }

    protected _getItems(params?): Observable<IActualTime[]> {
        const items = this.dialogConfig && this.dialogConfig.items;
        return of(Array.isArray(items) ? items : [items]);
    }

    public editDisabled(item: IActualTime) {
        const isFutureDate = Date.isFutureDay(item.date);
        const beforePrevWeek = moment(item.date).isBefore(this.prevWeekStart);

        return this.disabledByStatus || isFutureDate || beforePrevWeek
            || TimeProvider.isBeforeStartDate(item.date, this.task);
    }



    getParams(params): any {
        const {task: {id: taskId}} = this.dialogConfig;
        return {taskId, ...params};
    }

    submit(e) {
        const hide = this.showLoading();
        this.setProjectContext(this.dialogConfig && this.dialogConfig.projectId);

        forkJoin(
            this.week.map(w => w.apply(e)).filter(Boolean),
        ).pipe(
            finalize(() => {
                hide();
                this.close();
            }),
        ).subscribe(
            () => this.showSuccess('action.comments-success'),
            error => this.showError(error, 'action.comments-error'),
        );
    }

    protected _handleDeleteItem(items: IIdObject | IIdObject[]) {
        return;
    }

    protected _handleUpdateItem(items: IActualTime[] | IActualTime) {
        return;
    }

    protected _handleCreateItem(item: IActualTime[] | IActualTime, responseHandling: 'append' | 'prepend' | null = 'prepend') {
        return;
    }

    close() {
        this._dialog.close();
    }
}

function itemWithStatus(item: IActualTime) {
    return !!item.status;
}
