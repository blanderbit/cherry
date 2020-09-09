import { Component } from '@angular/core';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { IProject, PermissionAction, ProjectsProvider } from 'communication';
import { Router } from '@angular/router';
import { ProjectsCreateService } from 'create';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
    permissionAction = PermissionAction;
    getRouterLink = (item: IProject) => `/projects/${item.id}`;

    constructor(protected _provider: ProjectsProvider,
                protected _notifier: NotifierService,
                protected _createService: ProjectsCreateService,
                protected _router: Router) {
    }

    createProject() {
        this._createService.create();
    }
}
