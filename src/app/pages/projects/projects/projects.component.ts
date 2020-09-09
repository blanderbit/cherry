import { Component } from '@angular/core';
import {
    GRID_COLUMN_DEFS,
    GRID_COLUMN_DEFS_MAP,
    GRID_CONTAINER_OPTIONS,
    IGridContainerOptions
} from '../../../ui/ag-grid/grid-container/token';
import { EnterAnimation } from '../../../common-projects/animations';
import { PROJECTS_COL_DEFS_MAP } from '../../../common-projects/projects-column-defs.provider';
import { BaseProjectsComponent } from '../../../common-projects/base-projects.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss'],
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
            ]
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: 'table',
                translateColumns: true,
            } as IGridContainerOptions,
        }
    ],
    animations: [EnterAnimation],
})
export class ProjectsComponent extends BaseProjectsComponent {

}

