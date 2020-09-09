import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from 'grid';
import { Translate } from 'translate';
import { HolidaysProvider, PermissionsHolidayAction, PermissionsProvider, Provider } from 'communication';
import { holidayColumns } from './columns';
import { HolidaysFormComponent } from './forms/holidays-form/holidays-form.component';
import { FormControlModule } from 'form-control';
import { FormItemModule } from './forms/form-item/form-item.module';
import { DatepickerModule } from 'date';
import { CompanySettings } from './company-settings';
import { CompanySettingsForm } from './forms/company-settings-form.component';
import { HolidaysHeaderComponent } from './holidays-header/holidays-header.component';
import { CompanySettingsPermissions, HEADER } from './keys';
import { ListHandler } from './list/list.handler';
import { HolidayListHandler } from './holiday-list.handler';
import { ICompanySettingsPermissions } from './models/permissions';
import { NavigationBackModule } from '../../../../ui/navigation-back/navigation-back.module';
import { MatButtonModule } from '@angular/material/button';
import { GRID_COLUMN_DEFS, GRID_CONTAINER_OPTIONS, IGridContainerOptions } from '../../../../ui/ag-grid/grid-container/token';

@NgModule({
    declarations: [
        HolidaysFormComponent,
        HolidaysHeaderComponent,
    ],
    imports: [
        CommonModule,
        GridModule,
        FormControlModule,
        FormItemModule,
        DatepickerModule,
        Translate,
        NavigationBackModule,
        MatButtonModule,
    ],
    providers: [
        {
            provide: ListHandler,
            useClass: HolidayListHandler,
        },
        {
            provide: HEADER,
            useValue: HolidaysHeaderComponent,
        },
        {
            provide: CompanySettingsForm,
            useValue: HolidaysFormComponent,
        },
        {
            provide: Provider,
            useExisting: HolidaysProvider,
        },
        {
            provide: GRID_COLUMN_DEFS,
            useValue: holidayColumns,
        },
        {
            provide: GRID_CONTAINER_OPTIONS,
            useValue: {
                translatePrefix: '',
            } as IGridContainerOptions,
        }
    ],
    exports: [],
    entryComponents: [
        HolidaysFormComponent,
        HolidaysHeaderComponent,
    ]
})
export class ComponentsModule {
}


@CompanySettings({
    localize: 'holidays-settings',
    imports: [
        ComponentsModule
    ],
    providers: [
        {
            provide: CompanySettingsPermissions,
            useValue: PermissionsProvider
                .generalizePermissionsAction<ICompanySettingsPermissions>(PermissionsHolidayAction, 'holiday')
        },
    ],
})
export class HolidaysModule {
}
