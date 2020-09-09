import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ProjectsProvider } from 'communication';
import { catchError } from 'rxjs/operators';
import { NotifierService } from '../notifier/notifier.service';
import { IProject } from '../../../projects/communication/src/lib/models/projects/project';

@Injectable()
export class ProjectsResolver implements Resolve<IProject> {
    constructor(private _projectsProvider: ProjectsProvider,
                private _notifier: NotifierService,
                private _router: Router) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<IProject> | Promise<IProject> | any {
        const id = route.paramMap.get('id');
        return this._projectsProvider.getItemById(id).pipe(
            catchError((error) => {
                console.error('ProjectsResolver', error);
                return this._router.navigate(['error/404']);
            })
        );
    }
}
