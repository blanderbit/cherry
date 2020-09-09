import { Provider } from '../common/provider';
import { IPermission } from '../../models/permissions/permission.interface';
import { PermissionAction } from '../../models/permissions/permission-action';
import { IIdObject } from '../../models';


export abstract class PermissionsProvider<T extends IIdObject = IPermission> extends Provider<T> {

    // Transform different permission action types into one common interface, excluding a unique word from the key
    // Example:
    // generalizePermissionsAction({UpdateUniqueKeyResource: SomePermissionAction}, 'UniqueKey')
    // Result: { updateResource: SomePermissionAction }
    public static generalizePermissionsAction<T>(permissionsAction: Partial<typeof PermissionAction>, extractFromKey: string): T {
        const regex = new RegExp('(' + extractFromKey + ')', 'gi');

        return Object.keys(permissionsAction).reduce((obj, key) => {
            const generalizeKey = (key.charAt(0).toLowerCase() + key.slice(1)) // first letter to lower case
                .replace(regex, '');

            return {
                ...obj,
                [generalizeKey]: permissionsAction[key],
            };
        }, {}) as T;
    }
}

