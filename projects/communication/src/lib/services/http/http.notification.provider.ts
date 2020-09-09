import { CommunicationConfig } from '../../communication.config';
import { RealtimeSuffix } from '../common/realtime.provider';
import { HttpParams } from "@angular/common/http";
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { HttpProvider } from './http.provider';
import { INotification, INotificationParams, NotificationProvider } from '../common/notification.provider';
import { map, mergeAll, tap } from 'rxjs/operators';

const Suffix: string = 'notifications';

export interface IData {
    data: number;
}

const NotificationMessages = {
    AssignmentCompletedMessage: 'assignmentcompletednotification',
    DeliverableAssignmentDeletedMessage: 'deliverableassignmentseletednotification',
    TaskAssignmentDeletedMessage: 'taskassignmentdeletednotification',
    TaskCommentCreatedMessage: 'taskcommentcreatednotification',
    DeliverableCancelledMessage: 'deliverablecancellednotification',
    DeliverableCompletedByPMMessage: 'deliverablecompletedbypmnotification',
    DeliverableCompletedMessage: 'deliverablecompletednotification',
    DeliverableCreatedMessage: 'deliverablecreatednotification',
    DeliverableDeletedMessage: 'deliverabledeletednotification',
    TaskCancelledMessage: 'taskcancellednotification',
    TaskCompletedByPMMessage: 'taskcompletedbypmnotification',
    TaskCompletedMessage: 'taskcompletednotification',
    TaskCreatedMessage: 'TaskCreatednotification',
    TaskDeletedMessage: 'taskdeletednotification',
    AttachmentAddedMessage: 'attachmentaddednotification',
    ProjectInvitationMessage: 'projectinvitationnotification',
    TaskAssignmentsCreatedMessage: 'TaskAssignmentsCreatednotification'
}

const MarkAsRead = 'MarkAsRead';

export abstract class HttpNotificationProvider extends HttpProvider<INotification> implements NotificationProvider {


    private getNotificationObservables () {
        const observebles = Object.values(NotificationMessages)
            .map((marker: string) => this._getObservable(marker, ''));

        return merge(observebles).pipe(
            mergeAll(),
        );
    }

    public allNotificationMarkers = this.getNotificationObservables();

    public unreadMessage: BehaviorSubject<IData> = new BehaviorSubject({data: 0});

    public markAsReadMessage = this._getObservable( MarkAsRead, '')
        .pipe(map(this.getPayload()));


    protected _getType(): string {
        return RealtimeSuffix.Notifications;
    }

    protected _getURL(config: CommunicationConfig): string {
        return `${config.http.notifications}`;
    }

    protected _getRESTURL(array = []): string {
        return this._concatUrl(Suffix, ...array);
    }

    protected createParams(options = {}): HttpParams {
        return new HttpParams({fromObject: options});
    }

    getItems (obj?: INotificationParams): Observable<INotification[]> {
        return super.getItems(obj)
    }

    getUnreadItems() {
        const requestURL = ['unread/count'];
        this._http.get(`${this._getRESTURL(requestURL)}`)
            .pipe(
                map((item: IData | number) => typeof item === 'object' ? item : {data: item}),
                tap((i: IData) => {
                    this.onUpdate(i);
                    this.unreadMessage.next(i);
                }),
            ).subscribe();
    }

    markAsRead(item: INotification): Observable<object> {
        const requestURL = ['read'];
        return this._http.put(`${this._getRESTURL(requestURL)}`, {"Ids": [item.id]})
            .pipe(
                map(this.combineResponse),
                tap(() => this.onUpdate({
                    ...item,
                    isRead: true
                })),
            );
    }

    markAllAsRead(options?: INotificationParams): Observable<object>{
        const requestURL = ['read/all'];
        const params = this.createParams(options);
        return this._http.put(`${this._getRESTURL(requestURL)}`, {params})
    }
}
