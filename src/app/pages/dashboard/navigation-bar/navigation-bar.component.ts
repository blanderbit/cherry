import {Component, OnInit} from '@angular/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {tap} from 'rxjs/operators';
import {ModulesContainer} from '../modules.container';
import {HumanResourcesProvider, PermissionsSystemLevelAction} from 'communication';
import {ProfileService} from '../../../identify/profile.service';
import {NotifierService} from 'notifier';
import {INotification, NotificationProvider} from '../../../../../projects/communication/src/lib/services/common/notification.provider';
import {ItemsComponent} from 'components';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {IData} from '../../../../../projects/communication/src/lib/services/http/http.notification.provider';

export interface IMarkAsReadMessage {
    ids: [];
    unreadCount: number;
}

const paginationPageSize = 50;

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
})

export class NavigationBarComponent extends ItemsComponent<INotification> implements OnInit {
    chosenBlock;
    avatar = this.profileService.avatar$;
    unreadMessage: Observable<IData>;
    openedNotifications = false;
    protected setPaginationQueryParams = false;


    get resourceId() {
        return this.profileService.resourceId;
    }

    iconName = 'icon-tasks';
    settingPath = 'assets/img/menu/grey-settings.png';

    topMenu = [
        {
            icon: 'icon-navigation',
            name: 'navigation',
        },
        // {
        //     icon: 'icon-search',
        //     name: 'search',
        // },
    ];

    downMenu = [
        // {
        //     icon: 'icon-question',
        //     name: 'help',
        //     link: '/help',
        // },
        {
            icon: null,
            name: 'settings',
            link: '/settings',
            image: 'assets/img/settings.png',
        },
        // {
        //     icon: 'icon-notification',
        //     name: 'notification',
        //     link: '/notification',
        // },
    ];

    profile = {
        icon: '../../../assets/img/menu/avatar.png',
        navIcon: 'icon-profile',
        name: 'profile',
        link: '/profile',
    };

    get getAcronym() {
        return ProfileService.getFullName(this.profileService.profile).acronym();
    }

    constructor(
        private _modulesContainer: ModulesContainer,
        protected _notifier: NotifierService,
        public profileService: ProfileService,
        private _userService: HumanResourcesProvider,
        protected _provider: NotificationProvider,
        protected _router: Router,
        protected _route: ActivatedRoute,
    ) {
        super();
    }

    setQueryParams(params: any): void {
    }

    get PermissionsSystemLevelAction() {
        return PermissionsSystemLevelAction;
    }

    ngOnInit(): void {
        super.ngOnInit();

        this._modulesContainer.moduleChange
            .pipe(
                untilDestroyed(this),
                tap((i) => this.changeIcon(i)),
                tap(() => this.close()),
            ).subscribe();

        this._provider.getUnreadItems();

        this.unreadMessage = this._provider.unreadMessage;

        this._provider.allNotificationMarkers.subscribe({
            next: () => {
                this.loadData();
                this._provider.getUnreadItems();
            },
        });

        this._provider.markAsReadMessage
            .subscribe((i: IMarkAsReadMessage) => {
                const message: INotification[] = i.ids.map((id) => ({
                    id,
                    isRead: true,
                }));
                this._handleUpdateItem(message);
                this._provider.unreadMessage.next({data: i.unreadCount});
            });
    }

    changeIcon(name: string) {
        if (name == 'settings') {
            this.iconName = null;
        } else
            this.iconName = `icon-${name}`;
    }

    open(option: string) {
        return this.chosenBlock = option;
    }

    close() {
        if (this.chosenBlock)
            this.chosenBlock = null;
    }

    logout() {
        this.profileService.logout()
            .subscribe({
                error: err => this._notifier.showError(err),
            });
    }

    loadPaginationData() {
        const take: number = this.items.length + paginationPageSize;
        super.loadData({take});
    }
}
