import {Component, Inject, Input, OnChanges, OnDestroy, Optional, SimpleChanges, ViewChild} from '@angular/core';
import {ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, SortController} from 'ag-grid-community';
import {ActivatedRoute, Router} from '@angular/router';
import {AgGridAngular} from 'ag-grid-angular';
import {BreakpointObserver} from '@angular/cdk/layout';
import {fromEvent, merge, Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {IIdObject} from 'communication';
import {GridService} from '../grid.service';
import {debounceTime} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {GRID_COLUMN_DEFS, GRID_COLUMN_DEFS_MAP, GRID_CONTAINER_COMPONENT, GRID_CONTAINER_OPTIONS, IGridContainerOptions} from './token';
import {PermissionsService} from 'permissions';
import {GRID_DEFAULT_CUSTOM_OPTIONS, GRID_DEFAULT_OPTIONS} from './default-options';
import {GRID_DEFAULT_COL_DEF} from './default-col-def';

const ICONS = {
    filter: '<i class="icon-arrow-right"/>',
};

@Component({
    selector: 'app-grid-container',
    templateUrl: './grid-container.component.html',
    styleUrls: ['./grid-container.component.scss'],
    providers: [{
        provide: GRID_CONTAINER_COMPONENT,
        useExisting: GridContainerComponent,
    }],
})
export class GridContainerComponent implements OnDestroy, OnChanges {
    private _gridReady$ = new Subject<GridReadyEvent>();
    private _rowData: any[];
    private _columnDefs: ColDef[];
    private _subscribers = [];

    public icons = ICONS;
    public gridReady = this._gridReady$.asObservable();
    public gridApi: GridApi;
    public gridColumnApi: ColumnApi;
    public gridOptions: GridOptions = GRID_DEFAULT_OPTIONS;
    public cellPermissionsMap: { [key in string | number]: boolean } = {};

    @ViewChild(AgGridAngular, {static: true})
    public grid: AgGridAngular;

    @Input()
    public loading = false;

    @Input()
    public editType: string;

    @Input() noRowsParams: any;

    @Input()
    public redirectToDetails: boolean | string[] = false;

    @Input()
    public defaultColDef: ColDef = GRID_DEFAULT_COL_DEF;

    @Input()
    public set options(value: GridOptions) {
        if (value) {
            this.gridOptions = {...GRID_DEFAULT_OPTIONS, ...value};
        }
    }

    @Input()
    public set colDefs(value: (ColDef | string)[]) {
        if (value && Array.isArray(value)) {
            const hiddenColumns = this.customOptions.hiddenColumns || [];
            let allowedColDefs = this.filterColDefsByPermissions(value.map(v => this.getColumn(v))).map(column => ({
                ...column,
                hide: hiddenColumns.includes(column.field),
            }) as ColDef);

            if (this.customOptions.translateColumns) {
                allowedColDefs = allowedColDefs.map(colDef => this.translateColumnHeader(colDef));
            }

            this._columnDefs = allowedColDefs;
        }
    }

    // getter for colDefs, name differs because of - 'get' and 'set' accessor must have the same type error

    public get columnDefs(): ColDef[] {
        return this._columnDefs;
    }

    @Input()
    public set rowData(value: IIdObject[]) {
        if (value) {
            this._rowData = value;
        }
    }

    public get rowData() {
        return this._rowData;
    }

    @Input() suppressOverlay = false;

    public get showNoRowsOverlay(): boolean {
        return !this.suppressOverlay && this.rowData && !this.rowData.length;
    }

    get customOptions(): IGridContainerOptions {
        return {
            ...GRID_DEFAULT_CUSTOM_OPTIONS,
            ...this._customOptions,
        };
    }

    get cursorEvent() {
        return this.redirectToDetails && (this.redirectToDetails as any).length
    }

    constructor(private router: Router,
                private route: ActivatedRoute,
                private translate: TranslateService,
                private gridService: GridService,
                private breakpointObserver: BreakpointObserver,
                private permissionsManager: PermissionsService,
                @Optional() @Inject(GRID_CONTAINER_OPTIONS) protected _customOptions: IGridContainerOptions,
                @Optional() @Inject(GRID_COLUMN_DEFS_MAP) protected colDefByFieldMap: IGridContainerOptions,
                @Optional() @Inject(GRID_COLUMN_DEFS) columns: (ColDef | string)[],
    ) {

        if (columns) {
            this.colDefs = columns;
        }

        merge(gridService.resize$, fromEvent(window, 'resize')).pipe(
            debounceTime(100),
            untilDestroyed(this),
        ).subscribe(() => this.updateGridSize());
    }

    @Input()
    public getNavigationQueryParams(obj: IIdObject): object {
        return () => ({});
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.rowData && this.rowData) {
            this.updateGridSize();
        }
    }

    getColumn(value: ColDef | string): ColDef {
        switch (typeof value) {
            case 'object':
                return value;
            case 'string':
                // if string value passed get colDef from map
                if (this.colDefByFieldMap && this.colDefByFieldMap[value]) {
                    return {
                        field: value,
                        ...this.colDefByFieldMap[value],
                    };
                } else {
                    console.error(`No colDef for field - ${value}`);
                }
                break;
            default:
                console.error(`Invalid ColDef`, value);
        }
    }

    public refreshHeader() {
        if (this.gridApi) {
            this.gridApi.refreshHeader();
        }
    }

    public updateGridSize() {
        setTimeout(() => {
            const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 991px)');
            // if (isSmallScreen && this.gridColumnApi) {
            //     this.gridColumnApi.autoSizeAllColumns();
            //     this.gridOptions.suppressHorizontalScroll = false;
            // } else if (this.gridApi) {
            //     this.gridApi.sizeColumnsToFit();
            // }

            if (this.gridApi) {
                this.gridApi.sizeColumnsToFit();
            }
        }, 0);
    }

    onGridReady(params: GridReadyEvent): void {
        if (params.api) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;

            // update translation
            setTimeout(() => params.api.refreshHeader());

            this.updateGridSize();

            // @ts-ignore
            window['gr'] = params;

            this.setSorting();

            if (this.redirectToDetails === true)
                this._subscribe('rowClicked', (e) => this._navigateToDetails(e.node.data));
            else if (Array.isArray(this.redirectToDetails))
                this._subscribe('cellClicked', (e) => {
                    if ((this.redirectToDetails as []).some(i => i == e.colDef.field))
                        this._navigateToDetails(e.node.data);
                });


            this._gridReady$.next(params);
        }
    }

    private _navigateToDetails(item) {
        return this.router.navigate([`./${item.id}`], {
            relativeTo: this.route,
            queryParams: this.getNavigationQueryParams(item),
        });
    }

    protected _subscribe(event, fn: (...e) => any) {
        this.gridApi.addEventListener(event, fn);

        this._subscribers.push(() => this.gridApi.removeEventListener(event, fn));
    }

    cellMouseOut($event) {
        // $event.api.startEditingCell({
        //     rowIndex: 1,
        //     colKey: 'type'
        // });
    }

    onCellClicked($event) {
        // check whether the current row is already opened in edit or not
        // if(this.editingRowIndex != $event.rowIndex) {
        //     console.log($event);
        //     $event.api.startEditingCell({
        //         rowIndex: $event.rowIndex,
        //         colKey: $event.column.colId
        //     });
        //     this.editingRowIndex = $event.rowIndex;
        // }
    }

    public setSorting() {
        const sortController = (<any>this.gridApi).sortController as SortController;

        (<any>sortController).dispatchSortChangedEvents = () => {
            const columns = this.gridColumnApi.getAllDisplayedColumns();

            const [queryParams] = columns.filter(column => column.getSort()).map(column => ({
                    orderBy: column.getColDef().field,
                    descending: !column.isSortAscending(),
                }),
            );

            this.router.navigate([], {
                queryParams: queryParams || {orderBy: null, descending: null},
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        };
    }

    public hideColumn(name: string) {
        const column = this._getColumnDef(name);
        column.hide = true;
    }

    public showColumn(name: string) {
        const column = this._getColumnDef(name);
        column.hide = false;
    }

    private _getColumnDef(name: string) {
        return this.columnDefs.find((column) => column.field === name);
    }

    setItems(value: any) {
        this.rowData = value;
    }

    updateItem(items: IIdObject | IIdObject[]) {
        if (Array.isArray(items)) {
            for (const item of items)
                this.updateItem(item);

            return;
        }

        const {gridApi, rowData} = this;
        const index = rowData.findIndex(({id}) => id == items.id);

        if (index === -1)
            return;

        const newItem = {...rowData[index], ...items};
        const rowNode = gridApi.getRowNode(`${items.id}`);
        rowData.splice(index, 1, newItem);
        rowNode.setData({...newItem, __class: 'ag-grid-updated'});
    }

    removeItem(items: IIdObject | IIdObject[]) {
        if (Array.isArray(items)) {
            for (const item of items)
                this.removeItem(item);

            return;
        }

        const {gridApi, rowData} = this;

        if (gridApi) {
            const rowNode = gridApi.getRowNode(`${items.id}`);
            const index = rowData.findIndex(({id}) => id == items.id);

            if (index === -1)
                return;

            rowData.splice(index, 1);
            gridApi.updateRowData({remove: [rowNode]});
        }
    }

    addItem(items: IIdObject | IIdObject[]) {
        if (Array.isArray(items)) {
            for (const item of items)
                this.addItem(item);

            return;
        }

        if (this.rowData.some(({id}) => items.id === id))
            return;

        this.rowData.unshift(items);
        this.gridApi.updateRowData({add: [{...items, __class: 'ag-grid-new'}], addIndex: 0});
    }

    filterColDefsByPermissions(colDefs: ColDef[]): ColDef[] {
        return colDefs.filter(cd => cd.permissionAction ? this.permissionsManager.isNotForbidden(cd.permissionAction) : true);
    }

    translateColumnHeader(column: ColDef): ColDef {
        let header = GridService.getColDefHeader(column);

        if (header === '' || (header == null && !column.field)) {
            return column;
        }

        header = header || column.field;
        const {translatePrefix = ''} = this.customOptions;
        const translateToken = translatePrefix ? `${translatePrefix}.${header}` : header;

        return {
            ...column,
            headerName: this.translate.instant(translateToken) || '',
            headerValueGetter: () => this.translate.instant(translateToken) || '',
        };
    }

    ngOnDestroy(): void {
        for (const unsubscribe of this._subscribers) {
            unsubscribe();
        }
    }
}
