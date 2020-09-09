import { Component } from '@angular/core';
import { getTasksListProviders, TasksListComponent } from '../tasks-list.component';
import { Observable } from 'rxjs';
import { IAssignment } from 'communication';
import { ColDef } from 'ag-grid-community';
import { TaskField } from '../../../common-tasks/grid/task-columns';
import { IUpdateAssignmentStatusMessage, MyTasksTask } from '../../../common-tasks/assignments-status.service';

@Component({
    selector: 'app-my-tasks',
    templateUrl: 'my-tasks.component.html',
    styleUrls: ['./my-tasks.component.scss'],
    providers: [
        ...getTasksListProviders(MyTasksComponent),
    ]
})
export class MyTasksComponent extends TasksListComponent {
    public columnDefs: (ColDef | TaskField)[] = [
        this.nameColumnDef,
        'currentEndDate',
        'plannedTime',
        'actualTime',
        'creator',
        'project',
        'status'
    ];

    protected _getItemsRequest(params?): Observable<any> {
        return this._provider.getCurrentUserTasks(params);
    }

    protected _showCheckbox(assignments: IAssignment[]): boolean {
        return true;
    }

    protected _handleUpdateAssignmentStatus(data: IUpdateAssignmentStatusMessage) {
        const task = this.items.find(i => i.id === data.taskId) as MyTasksTask;

        if (task) {
           task.assignmentStatus = data.status;
        }
    }

    // overwritten from ProjectTasksComponent
    protected _canActivateComponent() {}
}
