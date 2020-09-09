import { PermissionActionType } from 'communication';
import { PermissionsService } from './services/permissions.service';

interface IItem {
    permissionAction?: PermissionActionType;
}

export function ListPermissionsFactory(items: IItem[]) {
    return function (manager: PermissionsService) {
        return items.filter(item => item.permissionAction ? manager.isNotForbidden(item.permissionAction) : true);
    };
}
