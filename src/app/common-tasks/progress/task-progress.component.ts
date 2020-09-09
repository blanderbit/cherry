import { Component, Input } from '@angular/core';
import { ITaskWithProgressDetails, PermissionAction, TasksProvider, TaskStatus } from 'communication';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { finalize } from 'rxjs/operators';
import { NotifierService } from 'notifier';
import { PermissionsService } from 'permissions';

@Component({
    selector: 'app-task-progress',
    templateUrl: './task-progress.component.html',
    styleUrls: ['./task-progress.component.scss'],
})
export class TaskProgressComponent {
    private _item: ITaskWithProgressDetails;
    private _lastValidWorkCompleted: number;

    @Input()
    disabled = false;

    get isDisabled() {
        return this.disabled ||
            !this.permissionsService.hasPermissions(PermissionAction.SetTaskWorkCompleted, {creatorId: this._item.creatorId});
    }

    @Input()
    public set item(value: ITaskWithProgressDetails) {
        if (value) {
            this._item = {...value};
            this._lastValidWorkCompleted = value.workCompleted;
        }
    }

    get progress() {
        return this._item.status === TaskStatus.Completed ? 100 : Math.round(this._item.progress);
    }

    get workCompleted() {
        return Math.round(this._item.workCompleted);
    }

    public get item() {
        return this._item;
    }

    constructor(private parent: TaskDetailsComponent,
                private taskProvider: TasksProvider,
                private permissionsService: PermissionsService,
                private notifierService: NotifierService) {
    }

    public onWorkCompletedChange(value) {
        this.item.workCompleted = value;
    }

    public onWorkCompleteSlideStop(value) {
        const hide = this.parent.showLoading();
        const projectId = this.item.projectId;

        this.taskProvider.updateWorkCompleted(projectId, this.item.id, value)
            .pipe(
                finalize(hide),
            ).subscribe(v => {
            this.item = {...this.item, workCompleted: value};
        }, err => {
            // set previous value
            this.item = {...this.item, workCompleted: this._lastValidWorkCompleted};
            this.notifierService.showError(err);
        });
    }
}
