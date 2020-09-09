import {GridService} from '../../../../ui/ag-grid/grid.service';
import {ActionsComponent} from './actions/actions.component';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {CountriesProvider, HolidaysPolicyProvider, IHolidaysPolicy, LocationsProvider, ResourcesTypeProvider} from 'communication';
import {CurrencyProvider} from '../../../../../../projects/communication/src/lib/services/common/currency.provider';
import {GridInputComponent, IGridInputParams} from 'dynamic-form-control';
import {Validators} from '@angular/forms';
import {GridAutocompleteComponent, IGridAutocompleteParams} from 'autocomplete';
import {
    GridCellValueMapperComponent,
    IGridCellValueMapperParams,
} from '../../../../ui/ag-grid/grid-country/grid-cell-value-mapper.component';
import {ICountry} from '../../../../../../projects/communication/src/lib/models/country';

export function getDeleteColumn(showEdit = true) {
    return {
        width: 60,
        cellRendererFramework: ActionsComponent,
        sortable: false,
        suppressMenu: true,
        cellStyle: {
            padding: '0 !important',
            borderTop: '1px solid white',
            height: '100%',
            borderBottom: '2px solid white',
            borderRight: '1px solid white',
        },
        cellRendererParams: () => {
            return {
                showEdit,
            };
        },
    };
}

export function getNameColumn(redirectToDetails = false) {
    return {
        field: 'name',
        redirectToDetails: redirectToDetails,
    };
}

export function getCountryColumn(redirectToDetails = false) {
    return {
        headerName: 'country',
        field: 'countryId',
        redirectToDetails: redirectToDetails,
        cellRendererFramework: GridCellValueMapperComponent,
        cellRendererParams: () => {
            return {
                provider: CountriesProvider,
                valueFormatter: (item: ICountry) => item.name,
            } as IGridCellValueMapperParams;
        },
        sortable: false,
    };
}

export function getCurrencyColumn(): ColDef {
    return {
        headerName: 'currency',
        field: 'currency',
        cellRendererFramework: GridCellValueMapperComponent,
        cellRendererParams: () => {
            return {
                provider: CurrencyProvider,
                valueFormatter: (item: IHolidaysPolicy) => item.name,
            } as IGridCellValueMapperParams;
        },
    };
}

export function getSimpleColumn(name: string, field?: string, provider?) {
    if (!field)
        field = name;

    return {
        headerName: name,
        field,
        editable: provider != null,
        cellEditorFramework: GridInputComponent,
        cellEditorParams: (params): IGridInputParams => {
            return {
                cellStartedEdit: true,
                field: {
                    name: field,
                    validators: [
                        Validators.required,
                        Validators.minLength(2),
                        Validators.maxLength(50),
                    ],
                },
                provider,
            };
        },
    };
}

export const holidaysPolicyColumns = [
    getNameColumn(true),
    getCountryColumn(true),
    getDeleteColumn(false),
];

export const holidayColumns = [
    getNameColumn(),
    {
        headerName: 'date',
        field: 'date',
        valueFormatter: GridService.gridDateFormatter,
        width: 100,
    },
    getDeleteColumn(),
];

export const locationsColumns = [
    getNameColumn(),
    {
        ...getSimpleColumn('address', null, LocationsProvider),
        sortable: false,
        minWidth: 240,
    },
    {
        ...getCountryColumn(),
    },
    {
        headerName: 'holidays-policy',
        field: 'holidayPolicyId',
        cellRendererFramework: GridCellValueMapperComponent,
        cellRendererParams: () => {
            return {
                provider: HolidaysPolicyProvider,
                valueFormatter: (item: IHolidaysPolicy) => item.name,
            } as IGridCellValueMapperParams;
        },
        editable: true,
        sortable: false,
        cellEditorFramework: GridAutocompleteComponent,
        cellEditorParams: (p) => {
            return {
                field: {
                    name: 'holidayPolicyId',
                    provider: HolidaysPolicyProvider,
                },
                provider: LocationsProvider,
            } as IGridAutocompleteParams;
        },
    },
    getDeleteColumn(),
];

export const skillsColumns = [
    getNameColumn(),
    getDeleteColumn(),
];

export const resourcesTypeColumns = [
    {
        headerName: 'name',
        field: 'name',
        editable: true,
        cellEditorFramework: GridInputComponent,
        cellEditorParams: (params: ICellRendererParams): IGridInputParams => {
            return {
                cellStartedEdit: true,
                field: {
                    name: 'name',
                    validators: [
                        Validators.required,
                        Validators.minLength(2),
                        Validators.maxLength(50),
                    ],
                },
                provider: ResourcesTypeProvider,
            };
        },
    },
    {
        headerName: 'rate',
        field: 'rate',
        editable: true,
        cellEditorFramework: GridInputComponent,
        cellEditorParams: (params): IGridInputParams => {
            return {
                cellStartedEdit: true,
                field: {
                    name: 'rate',
                    type: 'number',
                    validators: [
                        Validators.required,
                    ],
                },
                provider: ResourcesTypeProvider,
            };
        },
    },
    getCurrencyColumn(),
    getDeleteColumn(),
];
