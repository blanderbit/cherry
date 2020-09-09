import { PermissionActionType } from './permission-action';

export interface IPermissionActionProvider {
    permissionAction: PermissionActionType;
    showIfNotForbidden: boolean;
}

export type IOptionalPermissionActionProvider = Partial<IPermissionActionProvider>;
