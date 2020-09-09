import { Provider } from './provider';
import { IBasicProject, IProject, ProjectType } from '../../models/projects/project';
import { Observable } from 'rxjs';
import { ProjectStatus } from '../../models';
import { IRole } from '../../models/permissions/role.interface';

export interface IMembersAdded {
    id: number;
    members: IProjectMember[];
}
export interface IProjectMember {
    id: number;
    roleId: number;
    removed?: boolean;
}
export interface IMemberRemoved {
    id: number;
    resourceId: number;
}

export interface IStatusProvider {
    status: number;
}

export interface IProjectsRequestParams {
    type?: ProjectType;
    status?: ProjectStatus;
    search?: string;
    descending?: boolean;
    skip?: number;
    take?: number;
}

export abstract class ProjectsProvider extends Provider<IProject> {
    static PROJECT_STATUSES_MAP: Partial<{ [key in keyof typeof ProjectStatus]: ProjectStatus[] }> = {
        [ProjectStatus.Draft]: [ProjectStatus.InProgress],
        [ProjectStatus.InProgress]: [ProjectStatus.Completed, ProjectStatus.Canceled],
        [ProjectStatus.Completed]: [ProjectStatus.InProgress, ProjectStatus.Archived],
        [ProjectStatus.Canceled]: [ProjectStatus.Completed, ProjectStatus.Archived, ProjectStatus.InProgress],
        [ProjectStatus.Archived]: [],
    };

    memberAdded: Observable<IMembersAdded>;
    memberRemoved: Observable<IMemberRemoved>;
    memberUpdated: Observable<IMemberRemoved>;
    memberRemovedDisabled: Observable<IMemberRemoved>;

    static isProjectActive(projectOrStatus: IProject | ProjectStatus | IStatusProvider): boolean {
        if (projectOrStatus) {
            const status = typeof projectOrStatus === 'number' ? projectOrStatus : projectOrStatus.status;
            return [ProjectStatus.Draft, ProjectStatus.InProgress].includes(status);
        }

        return false;
    }

    abstract getItems(params?: IProjectsRequestParams): Observable<IProject[]>;

    abstract getMembers(projectId: number): Observable<IProjectMember[]>;

    abstract addMember(projectId: number, resourceId: IProjectMember): Observable<any>;

    abstract addMembers(projectId: number, resourceIds: IProjectMember[]): Observable<any>;

    abstract removeMember(projectId: number, resourceId: IProjectMember): Observable<any>;

    abstract updateMember(projectId: number, resourceId: number, role: IRole): Observable<any>;

    abstract getMembersByIds(projectsIds: number[]): Observable<any>;

    abstract getBaseItemsByIds(ids: number[]): Observable<IBasicProject[]>;
}

