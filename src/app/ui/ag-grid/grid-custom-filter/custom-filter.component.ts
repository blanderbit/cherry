import { Component, Inject } from '@angular/core';
import { ColDef, Column, ColumnApi, GridApi, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';
import { GRID_CONTAINER_COMPONENT } from '../grid-container/token';
import { GridService } from '../grid.service';


export interface IGridFilterComponent {
    columnDefs: any[];
}

@Component({
    templateUrl: './custom-filter.component.html',
    styleUrls: ['./custom-filter.component.scss'],
})
export class GridCustomFilterComponent implements IFilterAngularComp {
    private gridApi: GridApi = null;
    private columnApi: ColumnApi = null;
    public columnDefs: ColDef[] = [];
    isFilter = true;
    filter = '';
    params: IFilterParams;
    columns: Column[] = [];
    checkedColumns: Column[] = [];

    private valueGetter: (rowNode: RowNode) => any;

    get isAllColumnsVisible() {
        return this.checkedColumns.length === this.columns.length;
    }

    constructor(@Inject(GRID_CONTAINER_COMPONENT) public gridContainer) {
    }

    agInit(params: IFilterParams): void {
        this.params = params;
        this.gridApi = params.api;

        this.columnApi = this.gridContainer.gridColumnApi;

        this.valueGetter = params.valueGetter;

        if (this.columnApi) {
            this.columns = this.columnApi.getAllColumns()
                .filter(column => {
                    const colDef = column.getColDef();
                    const header = this.getColumnHeader(column);

                    return header && !colDef.suppressMenu;
                });

            this.checkedColumns = [...this.columns.filter(column => column.isVisible())];
        }
    }

    public getColumnHeader(column: Column | ColDef): string {
        const colDef = column instanceof Column ? column.getColDef() : column;
        return GridService.getColDefHeader(colDef) || colDef.field;
    }

    public toggleColumnVisibility(column: Column) {
        if (this.checkedColumns.includes(column)) {
            this.checkedColumns = this.checkedColumns.filter(c => c !== column);
        } else {
            this.checkedColumns = [...this.checkedColumns, column];
        }
    }

    isFilterActive(): boolean {
        return this.filter !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        return this.valueGetter(params.node).toString().toLowerCase().includes(this.filter.toLowerCase());
    }

    getModel(): any {
        return {filter: this.filter};
    }

    setModel(model: any): void {
        this.filter = model ? model.filter : '';
    }

    onSubmit(event) {
        const filter = event.target.value;

        if (this.filter !== filter) {
            this.filter = filter;
        }

        this.params.filterChangedCallback();
    }

    apply() {
        this.columns.forEach(column => {
            this.columnApi.setColumnVisible(column, this.checkedColumns.includes(column));
        });

        setTimeout(() => {
            this.gridContainer.updateGridSize();
            this.hideFilter();
        });
    }

    hideFilter() {
        return this.params && this.params.api.hidePopupMenu();
    }

    selectAll() {
        this.checkedColumns = this.isAllColumnsVisible ? [] : this.columns;
    }

    clear(): void {
        this.filter = '';
        this.params.filterChangedCallback();
        this.hideFilter();
    }
}
