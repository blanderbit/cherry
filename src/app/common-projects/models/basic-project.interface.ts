import { IBasicProject, IProjectMember } from 'communication';

export interface BasicProject extends IBasicProject {
    creatorId: number;
    members: IProjectMember[];
}
