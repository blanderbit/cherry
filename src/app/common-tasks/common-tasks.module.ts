import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'menu';
import { LoaderModule } from 'loader';
import { Translate } from 'translate';
import { AgGridModule } from 'ag-grid-angular';
import { FormControlModule } from 'form-control';
import { RouterModule } from '@angular/router';
import { AssigneeComponent } from './assignee/assignee.component';
import { AddAssigneeComponent } from './add-assignee/add-assignee.component';
import { UserModule } from '../user/user.module';
import { StatusComponent } from './status.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CustomDirectivesModule } from '../custom-directives/custom-directives.module';
import { IdentifyModule } from '../identify/identify.module';
import { CheckboxModule } from '../ui/checkbox/checkbox.module';
import { SelectModule } from '../ui/select/select.module';
import { TimeInputModule } from '../ui/time-input/time-input.module';
import { AddTimeComponent } from './add-time/add-time.component';
import { AddEffortComponent } from './plan-effort/add-effort.component';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { TaskProgressComponent } from './progress/task-progress.component';
import { TaskDependencyComponent } from './task-dependency/task-dependency.component';
import { TaskDependenciesComponent } from './task-dependencies/task-dependencies.component';
import { TaskDependenciesDialogComponent } from './task-dependencies-dialog/task-dependencies-dialog.component';
import { DialogModule } from '../ui/dialogs/dialog/dialog.module';
import { EditTimeDialogComponent } from './edit-time-dialog/edit-time-dialog.component';
import { WeekdayComponent } from './weekday/weekday.component';
import { GridModule } from 'grid';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UiModule } from '../ui/ui.module';
import { TaskCommentsModule } from '../task-comments/task-comments.module';
import { AutosizeModule } from 'ngx-autosize';
import { DateModule, DatepickerModule } from 'date';
import { PermissionsModule } from '../permissions/permissions.module';
import { ManualTimeInputModule } from '../ui/manual-time-input/manual-time-input.module';
import { AddTaskInlineComponent } from './add-task-inline/add-task-inline.component';
import { AutocompleteModule } from 'autocomplete';
import { A11yModule } from '@angular/cdk/a11y';
import { TaskAttachmentsComponent } from './task-attachments/task-attachments.component';
import { MaterialMenuModule } from '../ui/material-menu/material-menu.module';
import { ModalAddFileFromLinkComponent } from './task-attachments/modal-add-file-from-link/modal-add-file-from-link.component';
import { ModalPreviewComponent } from './task-attachments/modal-preview/modal-preview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragndropDirective } from './directives/dragndrop.directive';
import { DragNDropComponent } from './task-attachments/drag-ndrop/drag-ndrop.component';
import { AttachmentsService } from './service/attachment.service';
import { CloudModule } from '../ui/cloud/cloud.module';
import { ImageLoadDirective } from './directives/image-load.directive';
import { TextSplitFormatPipe } from './pipes/text.split.format.pipe';
import { CloudConfigure } from './service/cloud.configure';
import { MatMenuModule } from '@angular/material/menu';
import { AssigneeCompletedStatusComponent } from './assignee-completed-status/assignee-completed-status.component';
import { AssignmentsStatusService } from './assignments-status.service';

@NgModule({
    declarations: [
        TaskDetailsComponent,
        AssigneeComponent,
        AddAssigneeComponent,
        AssigneeCompletedStatusComponent,
        StatusComponent,
        AddTaskInlineComponent,
        AddTimeComponent,
        AddEffortComponent,
        TaskProgressComponent,
        TaskDependencyComponent,
        TaskDependenciesComponent,
        TaskDependenciesDialogComponent,
        EditTimeDialogComponent,
        WeekdayComponent,
        TaskAttachmentsComponent,
        ModalAddFileFromLinkComponent,
        ModalPreviewComponent,
        ImageLoadDirective,
        DragndropDirective,
        DragNDropComponent,
        TextSplitFormatPipe
    ],
    entryComponents: [
        AddAssigneeComponent,
        StatusComponent,
        AddTimeComponent,
        AddEffortComponent,
        TaskDependenciesDialogComponent,
        EditTimeDialogComponent,
        TaskAttachmentsComponent,
        ModalPreviewComponent,
        DragNDropComponent
    ],
    exports: [
        AssigneeComponent,
        TaskDetailsComponent,
        AddTaskInlineComponent,
        StatusComponent,
        TaskAttachmentsComponent,
        ImageLoadDirective,
        TextSplitFormatPipe,
        DragndropDirective,
    ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MenuModule,
    LoaderModule,
    Translate,
    AgGridModule,
    FormControlModule,
    UserModule,
    SelectModule,
    TextFieldModule,
    CustomDirectivesModule,
    IdentifyModule,
    TimeInputModule,
    CheckboxModule,
    DatepickerModule,
    NgxBootstrapSliderModule,
    DialogModule,
    GridModule,
    InfiniteScrollModule,
    UiModule,
    TaskCommentsModule,
    AutosizeModule,
    DateModule,
    ManualTimeInputModule,
    PermissionsModule,
    MaterialMenuModule,
    NgbModule,
    AutocompleteModule,
    CloudModule,
    A11yModule,
    MatMenuModule,
  ],
    providers: [
        CloudConfigure,
        AssignmentsStatusService
    ]
})
export class CommonTasksModule {
}
