import { AppPermissionsProvider } from '../common/app-permissions.provider';
import { HttpProvider } from './http.provider';
import { AppPermissionsAction, CommunicationConfig, IIdObject } from 'communication';

export interface IAppPermission extends IIdObject {
    name: AppPermissionsAction;
    isDefault: boolean;
}

export abstract class HttpAppPermissionsProvider extends HttpProvider<IAppPermission> implements AppPermissionsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.settings}/apps`;
    }
}
