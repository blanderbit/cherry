import { PermissionsSystemLevelAction, SystemPermissionsAction } from './system-permissions-actions';
import { PermissionsProjectLevelAction, ProjectPermissionsAction } from './project-permissions-actions';
import { ClientPermissionAction, PermissionsClientAction } from './client-permissions-actions';

export const PermissionAction = {
    ...PermissionsSystemLevelAction,
    ...PermissionsProjectLevelAction,
    ...PermissionsClientAction,
};
export type PermissionActionType = ClientPermissionAction | SystemPermissionsAction | ProjectPermissionsAction;
