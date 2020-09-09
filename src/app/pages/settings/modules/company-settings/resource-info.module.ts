import { CompanySettings } from './company-settings';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlModule } from 'form-control';
import { Translate } from 'translate';
import { FormItemModule } from './forms/form-item/form-item.module';
import { DatepickerModule } from 'date';
import { CompanySettingsForm } from './forms/company-settings-form.component';
import { PermissionsProvider, PermissionsResourceTypesAction, Provider, ResourcesTypeProvider } from 'communication';
import { ResourceTypeFormComponent } from './forms/resource-info-form/resource-type-form.component';
import { resourcesTypeColumns } from './columns';
import { CustomDirectivesModule } from '../../../../custom-directives/custom-directives.module';
import { DynamicFormControlModule } from 'dynamic-form-control';
import { AutocompleteModule } from 'autocomplete';
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
        CustomDirectivesModule,
        AutocompleteModule,
        DynamicFormControlModule
    ],
    declarations: [
        ResourceTypeFormComponent
    ],
    providers: [
        {
            provide: CompanySettingsForm,
            useValue: ResourceTypeFormComponent
        },
        {
            provide: Provider,
            useExisting: ResourcesTypeProvider
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: resourcesTypeColumns,
        }
    ],
    entryComponents: [
        ResourceTypeFormComponent
    ]
})
export class ComponentsModule {
}

@CompanySettings({
    localize: 'resource-info-settings',
    imports: [
        ComponentsModule
    ],
    providers: [
        {
            provide: CompanySettingsPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<ICompanySettingsPermissions>(PermissionsResourceTypesAction, 'resourceType')
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: '',
            } as IGridContainerOptions,
        }
    ]
})
export class ResourceInfoModule {
}
