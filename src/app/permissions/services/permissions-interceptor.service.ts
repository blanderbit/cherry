import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ProjectsPermissionsManager } from './projects-permissions-manager.service';
import { catchError } from 'rxjs/operators';
import { ProfileService } from '../../identify/profile.service';

export const PERMISSIONS_HEADER_NAME = 'projectId';
export const SYSTEM_PERMISSIONS_MODIFIED_CODE = 1017;

@Injectable()
export class PermissionsInterceptorService implements HttpInterceptor {
    projectId: number;

    constructor(
        private projectPermissionsManager: ProjectsPermissionsManager,
        private profile: ProfileService,
    ) {
        // projectPermissionsManager.projectId$
        //     .subscribe(id => this.projectId = id);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(
            req.clone({
                setHeaders: {
                    [PERMISSIONS_HEADER_NAME]: String(this.projectPermissionsManager.projectId)
                }
            })
        ).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log('ERROR', err);

                if (err && err.error && err.error.code === SYSTEM_PERMISSIONS_MODIFIED_CODE) {
                    return this.profile.logout();
                } else {
                    return throwError(err);
                }
            }),
        );
    }
}
