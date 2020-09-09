import {
    GenericResourceStatus,
    HumanResourceStatus,
    IHumanResource,
    IMaterialResource,
    IResource,
    MaterialResourceStatus, ResourceKind,
} from 'communication';
import { TranslateService } from '@ngx-translate/core';
import { ColDef } from 'ag-grid-community';
import { IUserSummaryComponentParams, UserSummaryComponent } from '../../user/user-summary/user-summary.component';
import { GridCellComponent, IGridCellComponentParams } from '../../ui/ag-grid/gird-cell/grid-cell.component';
import { StatusCellComponent } from '../../ui/ag-grid/status-cell/status-cell.component';
import { AvatarComponent, IAvatarComponentParams } from '../../user/avatar/avatar.component';

export type AnyResourceStatusEnum =
    typeof HumanResourceStatus | typeof MaterialResourceStatus | typeof GenericResourceStatus;

export const resourceIdColDef: ColDef = {
    field: 'code',
} as { field: keyof IResource };

export const nameColDef: ColDef = {
    field: 'name',
    cellRendererFramework: GridCellComponent,
    cellRendererParams: (params) => {
        const resource = (<IHumanResource>params.data);
        return {
            value: resource.name,
        } as IGridCellComponentParams;
    },
};

export const locationColDef: ColDef = {
    headerName: 'location',
    field: 'locationId',
    cellRendererFramework: GridCellComponent,
    suppressMenu: false,
};

export const statusColDef: ColDef = {
    field: 'status',
    cellRendererFramework: StatusCellComponent,
    cellRendererParams: (params) => {
        const resource = (<IMaterialResource>params.data);
        const className = `status_${ResourceKind[resource.kind]}`.toLowerCase();

        return {
            className: className,
        };
    },
    // cellRenderer: (params) => {
    //     const value = params.value;
    //
    //     // TODO: Remove 'OR' after implemented on backend
    //     return resourceEnum[value] || 'Active';
    // }
};

export const responsibleColDef: ColDef = {
    field: 'responsible',
    cellRendererFramework: UserSummaryComponent,
    cellRendererParams: (params) => {
        const resource = (<IMaterialResource>params.data);
        return {
            user: resource.responsible,
            showAvatar: false
        } as IUserSummaryComponentParams;
    },
};

export const idColDef: ColDef = {
    field: 'id',
    headerName: '',
    width: 50,
    cellRendererFramework: AvatarComponent,
    resizable: false,
    sortable: false,
    suppressMenu: true,
    cellRendererParams: (params) => {
        const resource = (<IHumanResource>params.data);
        return {
            resource,
            size: 30,
        } as IAvatarComponentParams;
    },
};
