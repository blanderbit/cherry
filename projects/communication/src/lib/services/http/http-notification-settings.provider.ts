import { HttpProvider } from './http.provider';
import { INotificationSetting } from '../../../../../../src/app/pages/profile/modules/notification-settings/models';
import { CommunicationConfig, NotificationSettingsProvider } from 'communication';
import { Observable } from 'rxjs';

const Suffix = 'notifications/settings';

export class HttpNotificationSettingsProvider extends HttpProvider<INotificationSetting> implements NotificationSettingsProvider {
    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.notifications}`;
    }

    protected _getRESTURL(array = []): string {
        return this._concatUrl(Suffix, ...array);
    }

    updateItems(items: INotificationSetting[]): Observable<any> {
        return this._http.put<INotificationSetting>(this._getRESTURL(), items);
    }
}
