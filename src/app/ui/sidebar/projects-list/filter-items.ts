import { IItem } from 'menu';
import { IOptionalPermissionActionProvider, PermissionAction, ProjectStatus } from 'communication';
import { InjectionToken, Provider } from '@angular/core';
import { ListPermissionsFactory } from '../../../permissions/list-permissions-factory';
import { PermissionsService } from 'permissions';

export type IProjectsFilterItem = IItem & IOptionalPermissionActionProvider;

export const EMPTY_FILTER: IProjectsFilterItem = {
    title: 'filter.all',
    value: '',
};

export const ACTIVE_FILTER: IProjectsFilterItem = {
    title: 'filter.active',
    value: ProjectStatus.InProgress,
};

export const FILTER_ITEMS: IProjectsFilterItem[] = [
    EMPTY_FILTER,
    {
        title: 'filter.draft',
        value: ProjectStatus.Draft,
        permissionAction: PermissionAction.ViewDraftProjects,
    },
    ACTIVE_FILTER,
    {
        title: 'filter.archives',
        value: ProjectStatus.Archived,
        permissionAction: PermissionAction.ViewArchivedProjects,
    },
    {
        title: 'filter.completed',
        value: ProjectStatus.Completed,
        permissionAction: PermissionAction.ViewCompletedProjects,
    },
    {
        title: 'filter.canceled',
        value: ProjectStatus.Canceled,
        permissionAction: PermissionAction.ViewCancelledProjects,
    },
];

export const ProjectsFilterItems = new InjectionToken<IProjectsFilterItem[]>('Projects filter items');

export const PROJECTS_FILTER_PROVIDER: Provider = {
    provide: ProjectsFilterItems,
    useFactory: ListPermissionsFactory(FILTER_ITEMS),
    deps: [PermissionsService],
};


