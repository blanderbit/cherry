import { PermissionActionType } from 'communication';

export interface ICompanySettingsPermissions {
    update: PermissionActionType;
    delete: PermissionActionType;
    create: PermissionActionType;
}
