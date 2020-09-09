import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ITask, TasksProvider } from 'communication';
import { catchError } from 'rxjs/operators';
import { NotifierService } from '../notifier/notifier.service';

@Injectable()
export class TasksResolver implements Resolve<ITask> {
    constructor(private _tasksProvider: TasksProvider,
                private _notifier: NotifierService,
                private _router: Router) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<ITask> | Promise<ITask> | any {
        const id = route.paramMap.get('id');
        return this._tasksProvider.getItemById(id).pipe(
            catchError((error) => {
                console.error('TasksResolver', error);
                return this._router.navigate(['error/404']);
            })
        );
    }
}
