import { CommonTasksModule } from './../../common-tasks/common-tasks.module';
import { AddAssigneeComponent } from './../../common-tasks/add-assignee/add-assignee.component';
import { DateModule, DatepickerModule } from 'date';
import { CreateKanbanTaskComponent } from './create-kanban-task/create-kanban-task.component';
import { DeleteColumnDialogComponent } from './delete-column-dialog/delete-column-dialog.component';
import { DialogModule } from 'src/app/ui/dialogs/dialog/dialog.module';
import { MatMenuModule } from '@angular/material/menu';
import { KanbanColumnTaskComponent } from './kanban-column-task/kanban-column-task.component';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';
import { CommonProjectsModule } from './../../common-projects/common-projects.module';
import { CustomDirectivesModule } from './../../custom-directives/custom-directives.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from './../../../../projects/menu/src/lib/menu.module';
import { NavigationBackModule } from './../../ui/navigation-back/navigation-back.module';
import { UserModule } from './../../user/user.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Translate } from 'translate';
import { FormControlModule } from './../../form-control/form-control.module';
import { PermissionsModule } from './../../permissions/permissions.module';
import { SelectModule } from './../../ui/select/select.module';
import { SidebarModule } from './../../ui/sidebar/sidebar.module';
import { KanbanComponent } from './kanban.component';
import { KanbanRoutingModule } from './kanban.routing.module';
import { ProjectKanbanBoardComponent } from './project-kanban-board/project-kanban-board.component';
import { MembersModalComponent } from 'src/app/common-projects/members-modal/members-modal.component';
import { KanbanTaskDirective } from './kanban-task.directive';
import { KanbanProjectsComponent } from './kanban-projects/kanban-projects.component';
import { LoaderModule } from 'loader';
import { GridModule } from 'grid';
import { CreateModule } from 'create';
import { KanbanSideMenuComponent } from './kanban-side-menu/kanban-side-menu.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { KanbanColumnsComponent } from './kanban-columns/kanban-columns.component';
import { KanbanColumnTasksComponent } from './kanban-column-tasks/kanban-column-tasks.component';
import { DeleteProjectComponent } from '../../common-projects/delete-project/delete-project.component';
import { ProjectStatusDropdownModule } from '../../common-projects/project-status-dropdown/project-status-dropdown.module';

@NgModule({
    imports: [
        KanbanRoutingModule,
        CommonModule,
        CommonTasksModule,
        CommonProjectsModule,
        SidebarModule,
        PermissionsModule,
        SelectModule,
        FormControlModule,
        Translate.localize('projects'),
        UserModule,
        NavigationBackModule,
        MenuModule,
        ReactiveFormsModule,
        CustomDirectivesModule,
        MenuModule,
        DragDropModule,
        MatMenuModule,
        DialogModule,
        DatepickerModule,
        CreateModule.forBoard(),
        DateModule,
        LoaderModule,
        GridModule,
        DragDropModule,
        MatButtonModule,
        ProjectStatusDropdownModule,
    ],
    declarations: [
        KanbanComponent,
        KanbanProjectsComponent,
        ProjectKanbanBoardComponent,
        KanbanColumnComponent,
        KanbanColumnTaskComponent,
        DeleteColumnDialogComponent,
        KanbanTaskDirective,
        CreateKanbanTaskComponent,
        KanbanSideMenuComponent,
        KanbanColumnsComponent,
        KanbanColumnTasksComponent,
    ],
    entryComponents: [
        MembersModalComponent,
        DeleteColumnDialogComponent,
        DeleteProjectComponent,
        AddAssigneeComponent,
    ]
})
export class KanbanModule { }
