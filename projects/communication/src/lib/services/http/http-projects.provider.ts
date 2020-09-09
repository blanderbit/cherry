import { HttpProvider } from './http.provider';
import { CommunicationConfig, IActionConfig, IBasicProject, IMembersAdded, IProjectMember, ProjectsProvider, ProjectStatus } from 'communication';
import { IProject, ProjectFields } from '../../models/projects/project';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RealtimeAction, RealtimeSuffix } from '../common/realtime.provider';
import { HttpParams } from '@angular/common/http';
import { IRole } from '../../models/permissions/role.interface';

const Suffix = 'projects';

enum Type {
    ProjectMembers = 'ProjectMembers',
    ProjectMember = 'ProjectMember',
}

export class HttpProjectsProvider extends HttpProvider<IProject> implements ProjectsProvider {
    public memberAdded = this._getObservable(RealtimeAction.Create, Type.ProjectMembers).pipe(map(this.getPayload()));
    public memberRemoved = this._getObservable(RealtimeAction.Delete, Type.ProjectMember).pipe(map(this.getPayload()));
    public memberUpdated = this._getObservable(RealtimeAction.Update, Type.ProjectMember).pipe(map(this.getPayload()));
    public memberRemovedDisabled = this._getObservable('ProjectMemberDisabled').pipe(map(this.getPayload()));
    protected _getType(): string {
        return RealtimeSuffix.Projects;
    }

    getUpdatesActions(): (string | IActionConfig)[] {
        return [
            ...super.getUpdatesActions(),
            'PlannedDateUpdated',
            'StatusUpdated',
        ];
    }

    getCreateActions(): (string | IActionConfig)[] {
        return [
            ...super.getCreateActions(),
        ];
    }

    protected _getURL(config: CommunicationConfig): string {
        return config.http.projects;
    }

    getMembers(projectId: number): Observable<IProjectMember[]> {
        return this._http.get<IProjectMember[]>(this._getMembersUrl(projectId));
    }

    addMember(projectId: number, member: IProjectMember): Observable<any> {
        return this._http.post(this._getMembersUrl(projectId),
            { members: [member] }).pipe(
                tap(() => this._emitRealtime({
                    id: projectId,
                    members: [member]
                } as IMembersAdded, RealtimeAction.Create, Type.ProjectMembers)),
            );
    }

    addMembers(projectId: number, members: IProjectMember[]): Observable<any> {
        return this._http.post(this._getMembersUrl(projectId), { members }).pipe(
            tap(() => this._emitRealtime({
                id: projectId,
                members: members
            } as IMembersAdded, RealtimeAction.Create, Type.ProjectMembers)),
        );
    }

    updateMember(projectId: number, resourceId: number, role: IRole): Observable<any> {
        return this._http.put(this._getMembersUrl(projectId, resourceId), { roleId: role.id }).pipe(
            tap(() => this._emitRealtime({
                id: resourceId,
                roleId: role.id
            } as IProjectMember, RealtimeAction.Update, Type.ProjectMember))
        );
    }

    removeMember(projectId: number, resourceId: IProjectMember): Observable<any> {
        return this._http.delete(this._getMembersUrl(projectId, resourceId.id)).pipe(
            tap(() => this._emitRealtime({
                id: projectId,
                members: [resourceId]
            } as IMembersAdded, RealtimeAction.Delete, Type.ProjectMember)),
        );
    }

    getMembersByIds(ids?: number[]): Observable<any> {
        if (!ids || !ids.length) {
            return of([]);
        }

        return forkJoin(ids.map(id => this.getMembers(id)));
    }

    protected _getRESTURL(id?): string {
        return this._concatUrl(Suffix, id);
    }

    patchItem(item: Partial<IProject>, field: ProjectFields): Observable<Partial<IProject>> {
        let obs: Observable<Partial<IProject>>;

        switch (field) {
            case ProjectFields.Status:
                obs = this._http.put(this._concatUrl(Suffix, item.id, field), { projectStatus: item.status });
                break;
            case ProjectFields.Name:
                obs = this._http.put(this._concatUrl(Suffix, item.id, 'names'), { name: item.name });
                break;
            default:
                return throwError(`Implement patch for ${field}`);
        }

        return obs.pipe(
            map(this.combineResponse(item)),
            tap(this._bindRealtime(RealtimeAction.Update))
        );
    }

    private _getMembersUrl(projectId: number, resourceId?: number) {
        return this._getRESTURL(this.arrayToUrl(projectId, 'members', resourceId));
    }

    getItems(obj?: any): Observable<IProject[]> {
        if (obj && obj.status === '')
            delete obj.status;

        return super.getItems(obj);
    }

    getBaseItemsByIds(ids: number[]): Observable<IBasicProject[]> {
        const params = new HttpParams({ fromObject: { ids: ids.map(String) } });

        return this._http.get<IBasicProject[]>(this._getRESTURL('basic'), { params });
    }
}
