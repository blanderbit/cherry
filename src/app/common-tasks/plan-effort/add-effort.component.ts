import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import {
    AssignmentsProvider,
    AssignmentStatus,
    IActualTime,
    IAssignment,
    ITask, ProjectStatus, RealtimeProvider, RealtimeSuffix, TasksProvider, TaskStatus,
} from 'communication';
import { NotifierService } from '../../notifier/notifier.service';
import { filter, finalize, map } from 'rxjs/operators';
import {
    IPlanEffortRequestData,
    TimeProvider,
} from '../../../../projects/communication/src/lib/services/common/time.provider';
import { Translate } from 'translate';
import { FormComponent } from 'components';
import { ProfileService } from '../../identify/profile.service';
import { AssignmentsStatusService, IUpdateAssignmentStatusMessage } from '../assignments-status.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TasksRealtimeMessageType } from '../../../../projects/communication/src/lib/services/http/http-tasks.provider';

// for dialog input typing
export interface IAddEffortDialogParams {
    task: ITask;
    assignments: IAssignment[];
    projectStatus: ProjectStatus;
}

@Component({
    selector: 'app-add-effort',
    templateUrl: './add-effort.component.html',
    styleUrls: ['./add-effort.component.scss'],
    providers: Translate.localizeComponent('common-tasks'),
})
export class AddEffortComponent extends FormComponent<IActualTime> implements OnInit, IAddEffortDialogParams {
    private _assignments: IAssignment[];
    public assignmentStatus = AssignmentStatus;
    public checkOverdue = AssignmentsProvider.assignmentOverdue;
    public effortMaxMinutes = 999 * 60;

    @Input() task: ITask;
    @Input() projectStatus: ProjectStatus;

    @Input() set assignments(value: IAssignment[]) {
        this._assignments = value;

        this.form = this.createForm();
    }

    get assignments(): IAssignment[] {
        return this._assignments || [];
    }

    get assignmentsControl() {
        return this.form.controls as {assignments: FormArray};
    }

    get time() {
        return this.form.value.assignments.reduce((a, b) => a + (b || 0), 0);
    }

    get totalReportedTime(): any {
        return this.assignments.reduce((a, b) => a + (b.actualTime || 0), 0);
    }

    get totalPlannedTime() {
        return this.formValue.reduce((a, b) => a + (b || 0), 0);
    }

    get formValue(): any {
        return <any>this.assignmentsControl.assignments.value;
    }

    get creatorId() {
        return this.task.creatorId;
    }

    get changeAssignmentStatusAvailable() {
        return AssignmentsStatusService.changeAssignmentStatusAvailable(this.task);
    }

    constructor(protected _ngbModal: NgbModal,
                protected _route: ActivatedRoute,
                protected _provider: AssignmentsProvider,
                protected _notifier: NotifierService,
                protected _timeProvider: TimeProvider,
                protected _profile: ProfileService,
                protected _assignmentsStatusService: AssignmentsStatusService,
                private _tasksProvider: TasksProvider,
    ) {
        super();
    }

    ngOnInit(): void {
        // ngOnInit is overwritten from FormComponent

        this._assignmentsStatusService.updateCompletedStatus$.pipe(
            filter(payload => payload.taskId === this.task.id),
            untilDestroyed(this),
        ).subscribe(assignment => {
            this._handleUpdateAssignmentsStatus(assignment);
        });

        this._tasksProvider.updateTaskStatus$.pipe(
            filter(payload => payload.id === this.task.id),
            untilDestroyed(this),
        ).subscribe((data) => {
            this._handleUpdateTaskStatus(data.status);
        });
    }

    public createForm() {
        return new FormGroup({
            assignments: new FormArray(
                this.assignments.map((el) => {
                    return new FormControl(el.plannedTime, Validators.required);
                }),
            ),
        });
    }

    public cancel() {
        this._ngbModal.dismissAll();
    }

    public apply($event) {
        // take assignments with changed planned time
        const changedEffortAssignments = this._getAssignmentsWithChangedEffort();

        if (!changedEffortAssignments.length) {
            return this._ngbModal.dismissAll();
        }

        const hide = this.showLoading();

        this._timeProvider.planEffort(changedEffortAssignments, this.task.id, this._profile.resourceId)
            .pipe(finalize(() => {
                hide();
                this._ngbModal.dismissAll();
            })).subscribe(
            (res) => {
                // TODO: Add translation
                this._notifier.showSuccess('Successfully saved');
            },
            (err) => {
                this._notifier.showError(err);
            },
        );
    }

    public trackByResource(index: number, item: IAssignment) {
        return item.resourceId;
    }

    private _getAssignmentsWithChangedEffort(): IPlanEffortRequestData[] {
        const assignmentsPlannedTime = this.formValue;

        // take assignments with changed planned time
        return this.assignments.map((assignment, index) => {
            const plannedTimeChanged = plannedTimeDiffers(assignment, assignmentsPlannedTime[index]);
            const resourceId = assignment.resourceId;
            const plannedTime = assignmentsPlannedTime[index];

            return plannedTimeChanged ? <IPlanEffortRequestData>{resourceId, plannedTime} : null;
        }).filter(v => !!v);
    }

    private _handleUpdateAssignmentsStatus(assignment: IUpdateAssignmentStatusMessage) {
        const updatedAssignment = this._assignments.find(i => i.resourceId === assignment.resourceId);
        updatedAssignment.status = assignment.status;
    }

    private _handleUpdateTaskStatus(status: TaskStatus) {
        this.task.status = status;
    }
}

function plannedTimeDiffers(assignment: IAssignment, planedTime: number): boolean {
    return assignment.plannedTime !== planedTime;
}
