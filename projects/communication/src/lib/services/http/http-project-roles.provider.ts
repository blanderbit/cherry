import { CommunicationConfig, Provider } from 'communication';
import { HttpRoleProvider } from './http-role.provider';

export class HttpProjectRolesProvider extends HttpRoleProvider {

    protected _getURL(config: CommunicationConfig): string {
        return  `${config.http.permissions}/roles/projects`;
    }

}
