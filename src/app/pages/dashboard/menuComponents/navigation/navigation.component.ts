import { Component, EventEmitter, Output } from '@angular/core';
import { PermissionActionType, PermissionsSystemLevelAction } from 'communication';
import { ProfileService } from '../../../../identify/profile.service';

interface INavigationMenuItem {
    hidden?: boolean;
    icon: string;
    title: string;
    link: string;
    queryParams?: object;
    onClick?: (e) => any;
    permissionAction: PermissionActionType;
}

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['../menuComponents.scss', './navigation.component.scss'],
})
export class NavigationComponent {
    @Output()
    hide: EventEmitter<string> = new EventEmitter<string>();
    menu: INavigationMenuItem[] = [];

    constructor(public profile: ProfileService) {

        this.menu = [
            {
                icon: 'tasks',
                title: 'navigation.tasks',
                link: `/tasks`,
                permissionAction: PermissionsSystemLevelAction.ViewTaskApp
            },
            {
                icon: 'projects',
                title: 'navigation.projects',
                link: '/projects',
                permissionAction: PermissionsSystemLevelAction.ViewProjectApp
            },
            {
                icon: 'timesheet',
                title: 'navigation.timesheet',
                link: '/timeapp',
                permissionAction: PermissionsSystemLevelAction.ViewTimeApp
            },
            {
                icon: 'resources',
                title: 'navigation.resources',
                link: '/resources',
                permissionAction: PermissionsSystemLevelAction.ViewResourceApp
            },
            {
                icon: 'kanban',
                title: 'navigation.kanban',
                link: '/kanban',
                // TODO: Change
                permissionAction: PermissionsSystemLevelAction.ViewResourceApp
            },
        ];
    }

    onHide() {
        this.hide.emit();
    }

}
