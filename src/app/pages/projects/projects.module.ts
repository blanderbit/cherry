import { CommonProjectsModule } from './../../common-projects/common-projects.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsRoutes } from './projects.routing';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'menu';
import { ProjectDetailsContainerComponent } from './details-wrapper/project-details-container.component';
import { Translate } from 'translate';
import { AgGridModule } from 'ag-grid-angular';
import { TeamComponent } from './team/team.component';
import { ProjectDetailsComponent } from './details/project-details.component';
import { TeamMemberTileComponent } from './team-member-tile/team-member-tile.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { GanttComponent } from './gantt/gantt.component';
import { LoaderModule } from 'loader';
import { GridModule } from 'grid';
import { CreateModule } from 'create';
import { CommonTasksModule } from '../../common-tasks/common-tasks.module';
import { UserModule } from '../../user/user.module';
import { IdentifyModule } from '../../identify/identify.module';
import { FormControlModule } from 'form-control';
import { SelectModule } from '../../ui/select/select.module';
import { SidebarModule } from '../../ui/sidebar/sidebar.module';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';
import { TimeInputModule } from '../../ui/time-input/time-input.module';
import { ProjectsResolver } from '../../resolvers/projects.resolver';
import { ProjectTasksComponent } from './project-tasks/project-tasks.component';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NavigationBackModule } from '../../ui/navigation-back/navigation-back.module';
import { DialogModule } from '../../ui/dialogs/dialog/dialog.module';
import { ArchiveProjectComponent } from '../../common-projects/archive-project/archive-project.component';
import { Meta } from 'meta';
import { UiModule } from '../../ui/ui.module';
import { ProjectStatusModule } from '../../ui/project-status/project-status.module';
import { DeleteProjectComponent } from '../../common-projects/delete-project/delete-project.component';
import { InfoDialogModule } from '../../ui/dialogs/info-dialog/info-dialog.module';
import { DateModule, DatepickerModule } from 'date';
import { PermissionsModule } from 'permissions';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ProjectsWrapperComponent } from './projects-wrapper/projects.wrapper';
import { ManualTimeInputModule } from '../../ui/manual-time-input/manual-time-input.module';
import { ResourcesListComponent } from './team/resources-list/resources-list.component';
import { FilesComponent } from './files/files.component';
import { MaterialMenuModule } from '../../ui/material-menu/material-menu.module';
import { CloudModule } from '../../ui/cloud/cloud.module';
import { CheckboxModule } from '../../ui/checkbox/checkbox.module';
import { AttachmentsService } from '../../common-tasks/service/attachment.service';
import { FilesSelectedComponent } from './files-selected/files-selected.component';
import { AutosizeModule } from 'ngx-autosize';
import { MembersModalComponent } from 'src/app/common-projects/members-modal/members-modal.component';
import { ProjectStatusDropdownModule } from '../../common-projects/project-status-dropdown/project-status-dropdown.module';


@NgModule({
    declarations: [
        ProjectsWrapperComponent,
        ProjectsComponent,
        SideMenuComponent,
        ProjectDetailsContainerComponent,
        ProjectTasksComponent,
        TeamComponent,
        ProjectDetailsComponent,
        TeamMemberTileComponent,
        GanttComponent,
        FilesComponent,
        ResourcesListComponent,
        FilesSelectedComponent,
    ],
    entryComponents: [
        DeleteProjectComponent,
        MembersModalComponent,
    ],
  imports: [
    CommonModule,
    ProjectsRoutes,
    CommonProjectsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    GridModule,
    MenuModule,
    Translate.localize('projects'),
    LoaderModule,
    CreateModule.forProjects(),
    CreateModule.forTasks(),
    CommonTasksModule,
    UserModule,
    IdentifyModule,
    FormControlModule,
    TextFieldModule,
    SelectModule,
    SidebarModule,
    CustomDirectivesModule,
    DatepickerModule,
    TimeInputModule,
    NgxBootstrapSliderModule,
    InfiniteScrollModule,
    NavigationBackModule,
    DialogModule,
    InfoDialogModule,
    Meta.forChild(),
    UiModule,
    ProjectStatusModule,
    DateModule,
    MatMenuModule,
    MatButtonModule,
    PermissionsModule,
    ManualTimeInputModule,
    MaterialMenuModule,
    CloudModule,
    CheckboxModule,
    AutosizeModule,
    ProjectStatusDropdownModule,
  ],
    exports: [
        SideMenuComponent,
    ],
    providers: [
        ProjectsResolver,
        AttachmentsService,
    ],
})
export class ProjectsModule {
}
