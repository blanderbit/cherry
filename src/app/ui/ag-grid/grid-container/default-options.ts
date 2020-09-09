import { GridOptions } from 'ag-grid-community';
import { CustomNoRowsOverlayComponent } from '../components/no-rows-overlay.component';
import { GRID_FRAMEWORKS } from './grid-framework-components';
import { IGridContainerOptions } from './token';

export const GRID_DEFAULT_OPTIONS: GridOptions = {
    animateRows: false,
    suppressColumnVirtualisation: true,
    pagination: true,
    suppressHorizontalScroll: true,
    noRowsOverlayComponentFramework: CustomNoRowsOverlayComponent,
    suppressCellSelection: true,
    suppressLoadingOverlay: true,
    suppressPaginationPanel: true,
    suppressRowClickSelection: true,
    suppressDragLeaveHidesColumns: true,
    rowSelection: 'multiple',
    // rowBuffer: 9999,
    // paginationAutoPageSize: true,
    // suppressNoRowsOverlay: true,
    frameworkComponents: GRID_FRAMEWORKS,
    getRowNodeId: (data) => data.id,
    getRowClass: (params) => {
        return params.data.__class;
    },
    stopEditingWhenGridLosesFocus: true,
};

export const GRID_DEFAULT_CUSTOM_OPTIONS: Partial<IGridContainerOptions> = {
    translatePrefix: 'table',
    translateColumns: true,
};
