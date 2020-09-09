import { Component } from '@angular/core';
import { NotifierService } from 'src/app/notifier/notifier.service';
import { IProject, IProjectsRequestParams, ProjectsProvider, ProjectType } from 'communication';
import { Router } from '@angular/router';
import { AgileProjectsCreateService } from 'create';

@Component({
    selector: 'app-side-menu',
    templateUrl: './kanban-side-menu.component.html',
    styleUrls: ['./kanban-side-menu.component.scss'],
})
export class KanbanSideMenuComponent {
    projectListParams: IProjectsRequestParams = {
        type: ProjectType.Agile,
    };

    getRouterLink = (item: IProject) => `/kanban/${item.id}`;

    constructor(protected _provider: ProjectsProvider,
                protected _notifier: NotifierService,
                protected _createService: AgileProjectsCreateService,
                protected _router: Router) {
    }

    createBoard() {
          this._createService.create();
    }
}
