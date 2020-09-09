import { Inject, Injectable } from '@angular/core';
import {
    AssignmentsProvider,
    AssignmentStatus,
    CommunicationConfig,
    IAssignment,
    IBaseTask,
    IHumanResource,
    IProject,
    RealtimeProvider,
    TaskStatus,
} from 'communication';
import { filter, flatMap, map } from 'rxjs/operators';
import { AssignmentsRealtimeActions } from '../../../projects/communication/src/lib/services/http/http-assignments.provider';
import { Observable } from 'rxjs';
import { ProfileService } from '../identify/profile.service';
import { ProjectsPermissionsManager } from 'permissions';

export interface MyTasksTask extends IBaseTask {
    assignmentStatus: AssignmentStatus;
    project?: IProject;
    creator?: IHumanResource;
}

export interface IUpdateAssignmentStatusMessage {
    taskId: number;
    resourceId: number;
    status: AssignmentStatus;
}

@Injectable()
export class AssignmentsStatusService {
    updateCompletedStatus$: Observable<IUpdateAssignmentStatusMessage>;

    constructor(private _assignmentsProvider: AssignmentsProvider,
                private profile: ProfileService,
                private permissionsService: ProjectsPermissionsManager,
                @Inject(CommunicationConfig) private config: CommunicationConfig) {
        this.updateCompletedStatus$ = this._assignmentsProvider.update$.pipe(
            filter(data => data.type === RealtimeProvider.getType(AssignmentsRealtimeActions.AssignmentStatusChanged, '')),
            map(data => data.payload as IUpdateAssignmentStatusMessage),
        );
    }

    static changeAssignmentStatusAvailable(task: IBaseTask) {
        return task.status === TaskStatus.InProgress || task.status === TaskStatus.Requested;
    }

    updateAssignmentStatus(task: MyTasksTask | IBaseTask, status: AssignmentStatus, resourceId: number = this.profile.resourceId) {
        const {id: taskId, projectId} = task;

        return this.permissionsService.setProjectContext(projectId)
            .pipe(
                flatMap(() => this._assignmentsProvider.updateStatus({taskId, status, resourceId})),
            );
    }

    getAssignmentStatus(obj: MyTasksTask | IBaseTask): AssignmentStatus {
        if (isMyTasksTask(obj)) {
            return obj.assignmentStatus;
        } else {
            const userAssignment = (obj.assignments || []).find((a) => a.resourceId === this.profile.resourceId);

            if (userAssignment) {
                return userAssignment.status;
            }
        }
    }
}

export function isMyTasksTask(obj: unknown): obj is MyTasksTask {
    return !!(obj && typeof obj === 'object' && (obj as MyTasksTask).assignmentStatus);
}
