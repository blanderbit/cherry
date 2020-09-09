import { FakeProvider } from './fake.provider';
import { NotificationSettingsProvider } from 'communication';
import { INotificationSetting, NotificationSettingType } from '../../../../../../src/app/pages/profile/modules/notification-settings/models';
import { Observable } from 'rxjs';


export class FakeNotificationSettingsProvider extends FakeProvider<INotificationSetting> implements NotificationSettingsProvider {
    protected _getItems() {
        return [
            {id: 1, value: NotificationSettingType.All},
            {id: 2, value: NotificationSettingType.All},
            {id: 3, value: NotificationSettingType.Email},
            {id: 4, value: NotificationSettingType.All},
            {id: 5, value: NotificationSettingType.All},
            {id: 6, value: NotificationSettingType.Web},
            {id: 7, value: NotificationSettingType.All},
            {id: 8, value: NotificationSettingType.All},
            {id: 9, value: NotificationSettingType.NotSet},
            {id: 10, value: NotificationSettingType.All},
            {id: 11, value: NotificationSettingType.All},
            {id: 12, value: NotificationSettingType.All},
            {id: 13, value: NotificationSettingType.NotSet},
            {id: 14, value: NotificationSettingType.All},
            {id: 15, value: NotificationSettingType.All},
            {id: 16, value: NotificationSettingType.All},
            {id: 17, value: NotificationSettingType.All},
            {id: 18, value: NotificationSettingType.All},
        ];
    }

    updateItems(items: INotificationSetting[]): Observable<any> {
        return this._wrapDataInObservable(null);
    }
}
