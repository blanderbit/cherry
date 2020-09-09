import { InjectionToken } from '@angular/core';
import { IPermissionsDirectiveData } from 'permissions';
import { GridContainerComponent } from 'grid';
import { ColDef } from 'ag-grid-community';

export interface IGridContainerOptions<T extends object = any> {
    translateColumns?: boolean;
    translatePrefix?: string;
    hiddenColumns?: (keyof T)[];
}

export const GRID_CONTAINER_OPTIONS = new InjectionToken<IGridContainerOptions>('Grid container options');

export const GRID_COLUMN_DEFS_MAP = new InjectionToken<(ColDef | string)[]>('Grid container options');

export const GRID_CONTAINER_COMPONENT = new InjectionToken<GridContainerComponent>('Grid container');

export const GRID_COLUMN_DEFS = new InjectionToken<(ColDef | string)[]>('Grid table columns definition');
