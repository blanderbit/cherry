import { CompanySettings } from './company-settings';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlModule } from 'form-control';
import { Translate } from 'translate';
import { FormItemModule } from './forms/form-item/form-item.module';
import { DatepickerModule } from 'date';
import { CompanySettingsForm } from './forms/company-settings-form.component';
import { LocationsProvider, PermissionsLocationsAction, PermissionsProvider, Provider } from 'communication';
import { LocationsFormComponent } from './forms/locations-form/locations-form.component';
import { locationsColumns } from './columns';
import { AutocompleteModule } from 'autocomplete';
import { DynamicFormControlModule } from 'dynamic-form-control';
import { CompanySettingsPermissions } from './keys';
import { ICompanySettingsPermissions } from './models/permissions';
import { GRID_COLUMN_DEFS, GRID_CONTAINER_OPTIONS, IGridContainerOptions } from '../../../../ui/ag-grid/grid-container/token';

@NgModule({
    imports: [
        CommonModule,
        FormControlModule,
        Translate,
        FormItemModule,
        DatepickerModule,
        AutocompleteModule,
        DynamicFormControlModule,
    ],
    declarations: [
        LocationsFormComponent
    ],
    providers: [
        {
            provide: CompanySettingsForm,
            useValue: LocationsFormComponent
        },
        {
            provide: Provider,
            useExisting: LocationsProvider
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: locationsColumns,
        }
    ],
    entryComponents: [
        LocationsFormComponent
    ]
})
export class ComponentsModule {
}

@CompanySettings({
    localize: 'locations-settings',
    imports: [
        ComponentsModule
    ],
    providers: [
        {
            provide: CompanySettingsPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<ICompanySettingsPermissions>(PermissionsLocationsAction, 'location')
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: '',
            } as IGridContainerOptions,
        }
    ]
})
export class LocationsModule {
}
