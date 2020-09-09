import {Component, OnDestroy} from '@angular/core';
import {getTasksListProviders, TasksListComponent} from '../tasks-list.component';
import {of} from 'rxjs';
import {IProject, IRealtimeMessage, ITask, TaskOrDeliverable} from 'communication';
import {catchError, finalize} from 'rxjs/operators';
import {ColDef} from 'ag-grid-community';
import {getTaskAssignmentsCol, TaskField} from '../../../common-tasks/grid/task-columns';

@Component({
    selector: 'app-tasks-by-project',
    templateUrl: 'tasks-by-project.component.html',
    styleUrls: ['./tasks-by-project.component.scss'],
    providers: getTasksListProviders(TasksByProjectComponent),
})
export class TasksByProjectComponent extends TasksListComponent implements OnDestroy {
    project: IProject = null;
    loadDataOnQueryParamsChange = true;
    items = [];

    public columnDefs: (ColDef | TaskField)[] = [
       this.nameColumnDef,
        'currentEndDate',
        'currentStartDate',
        'creator',
        getTaskAssignmentsCol(),
        'status',
    ];

    get header() {
        return this.project ? this.project.name : 'side.by-project';
    }

    get membersIds() {
        return this.project ? this.project.members.map(member => member.id) : [];
    }

    get creatorId() {
        return this.project ? this.project.creatorId : null;
    }

    // protected _getItemsRequest(params?): Observable<any> {
    //     return super._getItemsRequest(params);
    // }

    protected shouldHandleRealtimeCreate(message: IRealtimeMessage<ITask>): boolean {
        return super.shouldHandleRealtimeCreate(message) &&
            this._queryParams.projectId == message.payload.projectId;
    }

    loadData(params?: any) {
        const projectId = params.projectId;

        if (!projectId || (this.project && this.project.id === projectId)) return;

        this.permissionsManager.setProjectContext(projectId);
        const hide = this.showLoading();

        this._projectsProvider.getItemById(projectId)
            .pipe(
                finalize(() => hide()),
                catchError((error) => of(null)),
            )
            .subscribe((project) => {
                this.project = project;
                super.loadData(params);
            });

    }

    protected _handleResponse(response: TaskOrDeliverable[]) {
        super._handleResponse(response);
        super._canActivateComponent();
    }

    protected _handleLoadingError(error: any): null {
        super._canActivateComponent();
        return super._handleLoadingError(error);
    }

    // overwritten from ProjectTasksComponent
    protected _canActivateComponent() {
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.permissionsManager.clearProjectContext();
    }
}
