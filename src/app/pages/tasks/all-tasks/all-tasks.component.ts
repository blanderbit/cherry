import { Component } from '@angular/core';
import { TasksListComponent, getTasksListProviders } from '../tasks-list.component';
import { Observable } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { getTaskAssignmentsCol, TaskField } from '../../../common-tasks/grid/task-columns';

@Component({
    selector: 'app-all-tasks',
    templateUrl: 'all-tasks.component.html',
    styleUrls: ['./all-tasks.component.scss'],
    providers: getTasksListProviders(AllTasksComponent)
})
export class AllTasksComponent extends TasksListComponent {
    public columnDefs: (ColDef | TaskField)[] = [
        this.nameColumnDef,
        'currentEndDate',
        'creator',
        getTaskAssignmentsCol(),
        'project',
        'status'
    ];

    protected _getItemsRequest(params?): Observable<any> {
        return this._provider.getActiveTasks({...params, active: true});
    }

    // overwritten from ProjectTasksComponent
    protected _canActivateComponent() {}
}
