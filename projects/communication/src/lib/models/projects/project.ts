import { ProjectGroup } from './projects-group';
import { ProjectStatus } from './project.status';
import { IProjectMember } from '../../services/common';

export enum ProjectFields {
    StartDate = 'startDate',
    EndDate = 'endDate',
    Status = 'status',
    Name = 'name',
}

export enum ProjectType {
    Waterfall,
    Agile,
}

export interface IBasicProject {
    id: number;
    name: string;
    status: ProjectStatus;
    type: ProjectType;
}

export interface IProject extends IBasicProject {
    description?: string;
    createdAt?: number;
    lastModified?: number | Date;
    creatorId: number;
    modifiedInGantt?: boolean;
    parentId?: number;
    // TODO: Remove number type
    startDate?: string;
    endDate?: string;
    projectGroup?: ProjectGroup;
    members: IProjectMember[];
}

