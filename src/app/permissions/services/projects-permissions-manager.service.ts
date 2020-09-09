import { Injectable } from '@angular/core';
import { PermissionsManager } from './permissions-manager.service';
import { IIdObject, IPermission, IProject, ProjectsPermissionsProvider, ProjectsProvider, Provider } from 'communication';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { flatMap, map, switchMap, tap } from 'rxjs/operators';

export interface IProjectPermissionsManagerParams {
    projectId: IProject | number;
    setProjectContext?: boolean;
    loadPermissions?: boolean;
}

export interface IProjectIdProvider {
    projectId: number;
}

@Injectable()
export class ProjectsPermissionsManager extends PermissionsManager<IPermission, IProjectPermissionsManagerParams> {
    private _projectId$ = new BehaviorSubject<number>(null);
    public projectId$ = this._projectId$.asObservable();
    public project: IProject;

    get projectId() {
        return this._projectId$.value;
    }

    constructor(
        protected provider: ProjectsPermissionsProvider,
        protected projectsProvider: ProjectsProvider,
    ) {
        super(provider);
    }

    loadPermissions(params: IProjectPermissionsManagerParams): Observable<IPermission[]> {
        const {projectId} = params;
        const project$ = getLoadPermissionsObs(this.projectsProvider, projectId);

        return project$.pipe(
            switchMap((project) => super.loadPermissions({
                projectId: project.id,
            })),
        );
    }

    getProjectPermissions(projectOrId: IProject | number): Observable<IPermission[]> {
        const projectId = getId(projectOrId);

        return super.loadPermissions({projectId});
    }

    public handlePermissionsResponse(permissions: IPermission[]) {
        const {projectId} = this.params;

        if (projectId) {
            this.setProjectContext(projectId);
            super.handlePermissionsResponse(permissions);
        }

    }

    public clearProjectContext() {
        this.setProjectContext(this.project = null);
        this.handlePermissionsResponse([]);
    }

    public setProjectContext(projectOrId: IProject | number): Observable<number> {
        this._projectId$.next(getId(projectOrId));
        return of(getId(projectOrId));
    }
}

function getLoadPermissionsObs(provider: Provider, itemOrId: IIdObject | number) {
    return isIdObject(itemOrId) ? of(itemOrId) : provider.getItemById(itemOrId);
}

function isObject(value: any) {
    return value && typeof value === 'object';
}

function isIdObject(obj: any): obj is IIdObject {
    return isObject(obj) && obj.id;
}

export function getId(obj: IIdObject | number): number {
    if (isIdObject(obj)) {
        return obj.id as number;
    }

    return obj;
}
