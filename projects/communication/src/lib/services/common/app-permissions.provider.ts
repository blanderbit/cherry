import { Provider } from './provider';
import { IAppPermission } from '../http/http.app-permissions.provider';
import { AppPermissionsAction } from '../../models/permissions';

export interface ISystemAppsListContainer {
    apps: AppPermissionsAction[];
}

export abstract class AppPermissionsProvider extends Provider<IAppPermission> {

    static isAppEnabled(app: IAppPermission, allowedApps: AppPermissionsAction[]) {
        return app.isDefault || !allowedApps.length || allowedApps.includes(app.name);
    }
}
