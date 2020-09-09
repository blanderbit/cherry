import { Component, Inject, Injector, Input } from '@angular/core';
import { TaskOrDeliverable, TasksProvider } from 'communication';
import { ItemsComponent } from 'components';
import { ITaskDependency } from 'src/app/common-tasks/task-dependency/task-dependency.component';
import { Observable } from 'rxjs';
import { NotifierService } from 'notifier';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskDependenciesDialogComponent } from 'src/app/common-tasks/task-dependencies-dialog/task-dependencies-dialog.component';
import { DialogConfig } from 'src/app/ui/dialogs/dialogs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-task-dependencies',
    templateUrl: './task-dependencies.component.html',
    styleUrls: ['./task-dependencies.component.scss']
})
export class TaskDependenciesComponent extends ItemsComponent<ITaskDependency> {
    loadDataOnInit = false;
    loadDataOnQueryParamsChange = false;

    private _task: TaskOrDeliverable;

    get task(): TaskOrDeliverable {
        return this._task;
    }

    @Input()
    set task(value: TaskOrDeliverable) {
        this._task = value;
        this.loadData();
    }

    constructor(protected _notifier: NotifierService,
                @Inject(TasksProvider) protected _provider: any,
                protected _route: ActivatedRoute,
                protected _router: Router,
                private dialogService: NgbModal,
                private _injector: Injector) {
        super();
    }

    protected _getItems(params?): Observable<ITaskDependency[]> {
        const {dependentOn} = this._task;
        const dependedTasks = [...dependentOn];

        return this._provider.getItemsByIds(dependedTasks.map(i => i.id)).pipe(map((items: TaskOrDeliverable[]) => {
            return items.map(task => {
                const dependency = dependedTasks.find(({id}) => id === task.id);

                return {
                    task,
                    ...dependency,
                };
            });
        }));
    }

    openDependencies() {
        this.dialogService.open(TaskDependenciesDialogComponent, {
            injector: Injector.create({
                parent: this._injector,
                providers: [
                    {
                        provide: DialogConfig,
                        useValue: this.items
                    }
                ],
            }),
        });
    }
}
