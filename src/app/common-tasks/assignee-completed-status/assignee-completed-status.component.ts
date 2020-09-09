import { ChangeDetectorRef, Component, Input, ViewChild, ViewChildren } from '@angular/core';
import { AssignmentsProvider, AssignmentStatus, IAssignment, ITask, ProjectStatus, TaskStatus } from 'communication';
import { finalize } from 'rxjs/operators';
import { NotifierService } from 'notifier';
import { CheckboxComponent } from '../../ui/checkbox/checkbox.component';

@Component({
    selector: 'app-assignee-completed-status',
    templateUrl: 'assignee-completed-status.component.html',
    styleUrls: ['assignee-completed-status.component.scss'],
})
export class AssigneeCompletedStatusComponent {
    @Input() assignment: IAssignment;
    @Input() task: ITask;
    @Input() projectStatus: ProjectStatus;
    @Input() size = 22;

    @ViewChild('checkboxRef', {static: false}) checkbox: CheckboxComponent;

    loading = false;

    get isAssignmentCompleted() {
        return this.assignment.status === AssignmentStatus.Completed;
    }

    get assignmentCompleteDisabled() {
        const taskStatus = this.task.status;

        if (this.projectStatus === ProjectStatus.InProgress) {

            return (taskStatus !== TaskStatus.InProgress &&
                taskStatus !== TaskStatus.Requested);
        }

        return true;
    }

    constructor(private _assignmentsProvider: AssignmentsProvider,
                private _cdr: ChangeDetectorRef,
                private _notifier: NotifierService) {
    }

    complete(value: boolean) {
        if (this.loading)
            return;

        this.loading = true;

        const prevStatus = this.assignment.status;
        const status = value ? AssignmentStatus.Completed
            : (this.assignment.actualTime > 0 ? AssignmentStatus.InProgress : AssignmentStatus.Requested);
        const {id: taskId} = this.task;
        const item = {...this.assignment, status, taskId};

        this._assignmentsProvider.updateStatus(item)
            .pipe(finalize(() => this.loading = false))
            .subscribe(
                () => {
                    this.assignment.status = status;
                },
                err => {
                    this.assignment.status = prevStatus;
                    this.checkbox.onCheck(this.isAssignmentCompleted);
                    this._notifier.showError(err);
                },
            );
    }
}
