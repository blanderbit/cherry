import { Component } from '@angular/core';
import { IProjectsRequestParams, ProjectType } from 'communication';
import {
    GRID_COLUMN_DEFS,
    GRID_COLUMN_DEFS_MAP,
    GRID_CONTAINER_OPTIONS,
    IGridContainerOptions,
} from '../../../ui/ag-grid/grid-container/token';
import { Observable } from 'rxjs';
import { EnterAnimation } from '../../../common-projects/animations';
import { PROJECTS_COL_DEFS_MAP } from '../../../common-projects/projects-column-defs.provider';
import { BaseProjectsComponent } from '../../../common-projects/base-projects.component';

@Component({
    selector: 'app-kanban-projects',
    templateUrl: './kanban-projects.component.html',
    styleUrls: ['./kanban-projects.component.scss'],
    providers: [
        {
            provide: GRID_COLUMN_DEFS_MAP,
            useValue: PROJECTS_COL_DEFS_MAP,
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: [
                'name',
                'status',
                'creator',
                'members',
                'startDate',
                'endDate',
                'lastModified',
            ],
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: 'table',
                translateColumns: true,
            } as IGridContainerOptions,
        },
    ],
    animations: [EnterAnimation],
})
export class KanbanProjectsComponent extends BaseProjectsComponent {

    protected _getItems(params?: IProjectsRequestParams): Observable<any> {
        params = {...params, type: ProjectType.Agile};
        return super._getItems(params);
    }
}
