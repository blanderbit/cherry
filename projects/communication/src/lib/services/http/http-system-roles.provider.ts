import { CommunicationConfig } from 'communication';
import { HttpRoleProvider } from './http-role.provider';
import { SystemRolesProvider } from '../common/system-roles.provider';

export class HttpSystemRolesProvider extends HttpRoleProvider {
    protected _getURL(config: CommunicationConfig): string {
        return  `${config.http.permissions}/roles/systems`;
    }
}
