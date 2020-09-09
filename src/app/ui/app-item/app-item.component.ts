import {Component, Input} from '@angular/core';
import {AppPermissionsActions} from 'communication';

export const APPLICATIONS = [
    { icon: 'tasks', name: AppPermissionsActions.task },
    { icon: 'timeapp', name: AppPermissionsActions.time },
    { icon: 'projects', name: AppPermissionsActions.project },
    { icon: 'gantt-icon', name: AppPermissionsActions.gantt },
    { icon: 'calendar-upcoming', name: AppPermissionsActions.calendar },
    { icon: 'kanban-icon', name: AppPermissionsActions.kanban },
    { icon: 'resources', name: AppPermissionsActions.resource },
];
const LINKS = [
    { link: 'tasks', name: AppPermissionsActions.task },
    { link: 'timeapp', name: AppPermissionsActions.time },
    { link: 'projects', name: AppPermissionsActions.project },
    { link: 'resources', name: AppPermissionsActions.resource },
    { link: 'kanban', name: AppPermissionsActions.kanban },
];

@Component({
    selector: 'app-item-component',
    templateUrl: './app-item.component.html',
    styleUrls: ['./app-item.component.scss'],

})
export class AppItemComponent {
    @Input() app: string;
    @Input() translatePrefix = 'apps';
    @Input() disabled = false;
    @Input() allowNavigation = false;

    public apps = APPLICATIONS;

    public getIcon(name: string) {
        const app = this.apps.find(item => item.name == name);

        if (app) {
            return this.apps.find(item => item.name == name).icon;
        }
    }

    getLink(name) {
        const app = LINKS.find(item => item.name === name);
        return app ?  ('/' + app.link) : null;
    }
}


