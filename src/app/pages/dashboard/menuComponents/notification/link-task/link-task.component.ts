import { Component, Input } from '@angular/core';
import { INotification } from '../../../../../../../projects/communication/src/lib/services/common/notification.provider';
import { DashboardRoutes } from '../../../dashboard.routes';
import { Translate } from 'translate';



export interface INotificationPayload {
    initiatorId?: number;
    initiatorFullName?: string;
    resourceId?: number;
    fullName?: string;
    taskId?: number;
    taskName?: string;
    projectId?: number;
    projectName?: string;

}

export enum NotificationAction {
    TaskCompleted = 4,
    DeliverableCompleted = 6,
    AssignmentDeletedOnTask = 10,
    AssignmentDeletedOnDeliverable = 11,
    TaskDeleted = 12,
    DeliverableDeleted = 13,
    ProjectInvitation = 18
}

@Component({
    selector: 'app-link-task',
    templateUrl: './link-task.component.html',
    styleUrls: ['./link-task.component.scss'],
    providers: [
        ...Translate.localizeComponent('dashboard'),
        ]
})
export class LinkTaskComponent {

    routes = DashboardRoutes;

    @Input() item: INotification;

    get actionId(): number {
        return this.item.actionId;
    }

    get payload (): INotificationPayload {
        return this.item && this.item.payload;
    }

    get initiatorId(): number {
        return this.payload.initiatorId || this.payload.resourceId;
    }

    get inActiveLinks() {
        return [
            NotificationAction.AssignmentDeletedOnTask,
            NotificationAction.AssignmentDeletedOnDeliverable,
            NotificationAction.TaskDeleted,
            NotificationAction.DeliverableDeleted
        ].includes(this.actionId);
    }

    get ifProjectInvitation() {
        return this.actionId === NotificationAction.ProjectInvitation;
    }

    get name() {
        return this.payload['initiatorFullName'] || this.payload['fullName'];
    }

    get message () {
        return `notificationMessage.${this.actionId}`;
    }

    get taskName () {
        return this.payload['taskName'] || this.payload['deliverableName'];
    }

    get projectId () {
        return this.payload['projectId'] || '';
    }
}
