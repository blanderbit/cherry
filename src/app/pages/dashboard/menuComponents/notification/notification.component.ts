import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

import {
    INotification,
    NotificationProvider
} from '../../../../../../projects/communication/src/lib/services/common/notification.provider';

import { NotifierService } from 'notifier';
import { DashboardRoutes } from '../../dashboard.routes';
import { Router } from '@angular/router';
import {Translate} from "translate";

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['../menuComponents.scss', './notification.component.scss'],
    providers: [
        ...Translate.localizeComponent('dashboard'),
    ]
})
export class NotificationComponent {
    routes = DashboardRoutes;

    @Input() items: INotification[];
    @Output() stateChange: EventEmitter<void> = new EventEmitter();
    @Output() scroll: EventEmitter<void> = new EventEmitter();

    constructor(
        protected _provider: NotificationProvider,
        protected _notifier: NotifierService,
        protected _router: Router,
    ) {
    }

    markItemAsRead(item: INotification) {
        if (item.isRead) {
            return;
        }

        return this._provider.markAsRead(item)
            .subscribe({
                next:  () =>  this._notifier.showSuccess('action.successfully-updated'),
                error: () => this._notifier.showError('action.error')
            });
    }

    onScrollToBottom() {
        this.scroll.emit();
    }

    markAllItemsAsRead() {
        return this._provider.markAllAsRead().subscribe();
    }
}
