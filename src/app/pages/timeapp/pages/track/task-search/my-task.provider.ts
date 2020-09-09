import { ITask, TasksProvider } from 'communication';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class MyTaskProvider {
    constructor(protected _taskProvider: TasksProvider) {
    }

    getItems(params?): Observable<ITask[]> {
        return this._taskProvider.getAssignedTasks(params);
    }
}
