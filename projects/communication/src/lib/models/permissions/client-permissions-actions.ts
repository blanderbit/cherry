export const ProjectsPermissionsActions = {
    ViewArchivedProjects: 'ViewArchivedProjects',
    ViewDraftProjects: 'ViewDraftProjects',
    ViewCancelledProjects: 'ViewCancelledProjects',
    ViewCompletedProjects: 'ViewCompletedProjects',
};

export const PermissionsClientAction = {
    ...ProjectsPermissionsActions,
};

export type ClientPermissionAction = (typeof PermissionsClientAction)[keyof typeof PermissionsClientAction];

