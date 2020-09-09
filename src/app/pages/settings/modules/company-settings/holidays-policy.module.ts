import { CompanySettings } from './company-settings';
import { NgModule } from '@angular/core';
import { HolidaysPolicyFormComponent } from './forms/holidays-policy-form/holidays-policy-form.component';
import { CommonModule } from '@angular/common';
import { FormControlModule } from 'form-control';
import { Translate } from 'translate';
import { FormItemModule } from './forms/form-item/form-item.module';
import { DatepickerModule } from 'date';
import { CompanySettingsForm } from './forms/company-settings-form.component';
import { HolidaysPolicyProvider, PermissionsHolidaysPolicyAction, PermissionsProvider, Provider } from 'communication';
import { holidaysPolicyColumns } from './columns';
import { CompanySettingsPermissions, PARAM_KEYS } from './keys';
import { AutocompleteModule } from 'autocomplete';
import { DynamicFormControlModule } from 'dynamic-form-control';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from '../../../../ui/dialogs/confirm-dialog/confirm-dialog.module';
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
        ConfirmDialogModule,
    ],
    declarations: [
        HolidaysPolicyFormComponent,
    ],
    providers: [
        {
            provide: CompanySettingsForm,
            useValue: HolidaysPolicyFormComponent,
        },

        {
            provide: Provider,
            useExisting: HolidaysPolicyProvider,
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: holidaysPolicyColumns,
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: '',
            } as IGridContainerOptions,
        }
    ],
    entryComponents: [
        HolidaysPolicyFormComponent,
    ],
})
export class ComponentsModule {
}


@CompanySettings({
    localize: 'holidays-policy',
    imports: [
        ComponentsModule,
        RouterModule.forChild([
            {
                path: `:${PARAM_KEYS.POLICY_ID}`,
                loadChildren: () => import('./holidays.module').then(m => m.HolidaysModule),
            },
        ]),
    ],
    providers: [
        {
            provide: CompanySettingsPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<ICompanySettingsPermissions>(PermissionsHolidaysPolicyAction, 'holidaypolicy')
        },
    ],
})
export class HolidaysPolicyModule {
}
