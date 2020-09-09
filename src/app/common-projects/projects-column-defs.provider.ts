import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { IProject, IProjectMember, ProjectStatus } from 'communication';
import * as moment from 'moment';
import { UserNamePipe } from '../user/user-name.pipe';
import { IProjectWithCreator } from '../pages/projects/details-wrapper/project-details-container.component';
import { ILinkComponentParams, LinkComponent } from '../ui/ag-grid/components/link.component';
import { HighlightComponent } from '../ui/ag-grid/highlight/highlight.component';
import { ProjectStatusComponent } from '../ui/project-status/project-status.component';
import { GridService } from '../ui/ag-grid/grid.service';
import { AvatarsStackComponent, IAvatarStackComponentParams } from '../user/avatars-stack/avatars-stack.component';
import { IProjectWithOwnerAndMembers } from './base-projects.component';

type Project = IProject & IProjectWithOwnerAndMembers & IProjectWithCreator;
export type ProjectField = keyof Project;

export const PROJECTS_COL_DEFS_MAP: { [key in keyof Partial<Project>]: ColDef } = {
    name: {
        cellRendererFramework: LinkComponent,
        cellRendererParams: {
            navigate: (params, router: Router, route: ActivatedRoute) => {
                router.navigate([`${params.data.id}`], {
                    relativeTo: route,
                });
            },
        } as ILinkComponentParams,
    },
    status: {
        cellRendererFramework: ProjectStatusComponent,
    },
    // TODO: Uncomment after progress and sorting implemented
    // {
    //     headerName: 'progress',
    //     field: 'progress',
    //     cellRenderer: 'progressComponent',
    //     headerValueGetter: () => {
    //         return translateService.instant('table.progress');
    //     },
    // },
    creator: {
        sortable: false,
        valueFormatter: (params) => {
            return UserNamePipe.getName((params.value));
        }
    },
    members: {
        sortable: false,
        // width: 120,
        cellRendererFramework: AvatarsStackComponent,
        cellRendererParams: (params: ICellRendererParams) => {
            return {
                ids: (params.value as IProjectMember[] || []).map(member => member.id) ,
                shownCount: 3,
            } as IAvatarStackComponentParams;
        },
    },
    startDate: {
        valueFormatter: GridService.gridDateFormatter,
    },
    endDate: {
        minWidth: 100,
        cellRendererFramework: HighlightComponent,
        valueFormatter: GridService.gridDateFormatter,
        cellRendererParams: (params) => {
            const status = params.data.status;
            const isHighlighted = (status === ProjectStatus.InProgress && moment().isAfter(params.value));
            return {isHighlighted};
        },
    },
    lastModified: {
        valueFormatter: GridService.gridDateFormatter,
    },
};

export function getProjectColDefByField(field: ProjectField): ColDef {
    const colDef = PROJECTS_COL_DEFS_MAP[field];

    if (!colDef) {
        console.warn(`Can\'t find ColDef for field - ${field}`);
    }

    return colDef;
}
