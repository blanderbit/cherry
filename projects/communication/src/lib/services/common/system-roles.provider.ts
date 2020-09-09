import { RoleProvider } from './role.provider';
import { IRole } from '../../models/permissions';


export abstract class SystemRolesProvider extends RoleProvider {
    static DEFAULT_ROLE_NAME = 'user';

    static getDefaultRole(roles: IRole[]) {
        return roles.find(role => role.name.toLowerCase() === SystemRolesProvider.DEFAULT_ROLE_NAME);
    }

    static excludeDefaultRole(roles: IRole[]) {
        return roles.filter(role => role.name.toLowerCase() !== SystemRolesProvider.DEFAULT_ROLE_NAME);
    }
}
