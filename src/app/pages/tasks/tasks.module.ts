import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { TaskRoutes } from './tasks.routing';
import { TasksSideBarComponent } from './task-side-bar/tasks-side-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'menu';
import { CloudModule } from '../../ui/cloud/cloud.module';
import { LoaderModule } from '../../ui/loader/loader.module';
import { Translate } from 'translate';
import { AgGridModule } from 'ag-grid-angular';
import { FormControlModule } from '../../form-control/form-control.module';
import { CommonTasksModule } from '../../common-tasks/common-tasks.module';
import { GridModule } from '../../ui/ag-grid/ag-grid.module';
import { SidebarModule } from '../../ui/sidebar/sidebar.module';
import { TasksResolver } from '../../resolvers/tasks.resolver';
import { CreateModule } from 'create';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';
import { IdentifyModule } from '../../identify/identify.module';
import { NavigationBackModule } from '../../ui/navigation-back/navigation-back.module';
import { DetailsComponent } from './details/details.component';
import { Meta } from 'meta';
import { ProjectStatusModule } from '../../ui/project-status/project-status.module';
import { DateModule, DatepickerModule } from 'date';
import { SharedModule } from '../timeapp/_shared/shared.module';
import { AutocompleteModule } from 'autocomplete';
import { PermissionsModule } from 'permissions';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { AllTasksComponent } from './all-tasks/all-tasks.component';
import { TasksByProjectComponent } from './tasks-by-project/tasks-by-project.component';
import { TasksListComponent } from './tasks-list.component';
import {AttachmentsService} from "../../common-tasks/service/attachment.service";

@NgModule({
    declarations: [
        TasksComponent,
        TasksSideBarComponent,
        DetailsComponent,
        MyTasksComponent,
        AllTasksComponent,
        TasksByProjectComponent,
        TasksListComponent,
    ],
    exports: [
    ],
    imports: [
        GridModule.withComponents([]),
        CommonModule,
        CommonTasksModule,
        TaskRoutes,
        ReactiveFormsModule,
        MenuModule,
        CloudModule,
        LoaderModule,
        Translate.localize('tasks'),
        AgGridModule,
        FormControlModule,
        SidebarModule,
        CustomDirectivesModule,
        SidebarModule,
        CreateModule.forTasks(),
        IdentifyModule,
        NavigationBackModule,
        Meta.forChild(),
        ProjectStatusModule,
        DatepickerModule,
        SharedModule,
        AutocompleteModule,
        PermissionsModule,
        DateModule,
    ],
    providers: [
        TasksResolver,
        AttachmentsService
    ]
})
export class TasksModule {
}
