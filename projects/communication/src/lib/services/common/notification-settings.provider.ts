import { Provider } from '../common/provider';
import { INotificationSetting } from '../../../../../../src/app/pages/profile/modules/notification-settings/models';
import { Observable } from 'rxjs';

export abstract class NotificationSettingsProvider extends Provider<INotificationSetting> {
    abstract updateItems(items: INotificationSetting[]): Observable<any>;
}

