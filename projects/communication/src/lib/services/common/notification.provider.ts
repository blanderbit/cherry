import { Provider } from './provider';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMarkAsReadMessage } from '../../../../../../src/app/pages/dashboard/navigation-bar/navigation-bar.component';
import {IData} from "../http/http.notification.provider";

export interface INotification {
    id: number | string;
    actionId?: number;
    payload?: {
        initiatorFullName: string
        initiatorId: number
        projectId: number
        projectName: string
        taskId: number
        taskName: string
    };
    timestamp?: string;
    isRead: boolean;
    totalItems?: number;
}

export interface INotificationParams {
    skip?: number;
    take?: number;
    projectId?: number;

}

export abstract class NotificationProvider extends Provider<INotification> {

    markAsReadMessage: Observable<IMarkAsReadMessage>;

    allNotificationMarkers: Observable<Observable<object>>;

    unreadMessage: BehaviorSubject<IData>;

    abstract getItems(obj?: INotificationParams): Observable<INotification[]>;

    abstract getUnreadItems(): void;

    abstract markAsRead(item: INotification): Observable<any>;

    abstract markAllAsRead(options?: INotificationParams): Observable<object>;
}
