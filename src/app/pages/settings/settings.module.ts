import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsAdminRoutes } from './settings.routing';
import { AdminUsersComponent } from './users/admin-users.component';
import { UsersManagementPageComponent } from './users-management-page/users-management-page.component';
import { Translate } from 'translate';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form/user-form.component';
import { LoaderModule } from '../../ui/loader/loader.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '../../form-control/form-control.module';
import { IdentifyModule } from '../../identify/identify.module';
import { AgGridModule } from 'ag-grid-angular';
import { GridModule } from '../../ui/ag-grid/ag-grid.module';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';
import { SelectModule } from '../../ui/select/select.module';
import { SidebarModule } from '../../ui/sidebar/sidebar.module';
import { Meta } from 'meta';
import { SettingsComponent } from './settings.component';
import { AdminSubscriptionComponent } from './admin-subscription/admin-subscription.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [
        AdminUsersComponent,
        UsersManagementPageComponent,
        AdminSubscriptionComponent,
        UserFormComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        SettingsAdminRoutes,
        Translate.localize('settings'),
        ReactiveFormsModule,
        LoaderModule,
        NgbDropdownModule,
        FormControlModule,
        IdentifyModule,
        AgGridModule.withComponents([]),
        GridModule,
        SelectModule,
        CustomDirectivesModule,
        SidebarModule,
        Meta.forChild(),
        MatDividerModule,
    ],
})
export class SettingsModule {
}
