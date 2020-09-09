import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { navigableComponents, TrackRoutingModule } from './track-routing.module';
import { SharedModule } from '../../_shared/shared.module';
import { TrackHeaderComponent } from './track-header/track-header.component';
import { AddTasksRowComponent } from './add-tasks-row/add-tasks-row.component';
import { DayViewComponent } from './day-view/day-view.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { TrackCurrentDaysListComponent } from './track-current-days-list/track-current-days-list.component';
import { TaskSearchComponent } from './task-search/task-search.component';
import { TrackHttpService } from './track-http.service';
import { AutocompleteModule } from 'autocomplete';
import { MatTableModule } from '@angular/material/table';
import { ViewTimePipe } from './view-time.pipe';
import { CheckboxModule } from '../../../../ui/checkbox/checkbox.module';
import { LoaderModule } from 'loader';

import { DialogModule } from '../../../../ui/dialogs/dialog/dialog.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Translate } from 'translate';
import { DateModule, DatepickerModule } from 'date';
import { MatCardModule } from '@angular/material/card';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { FormControlModule } from 'form-control';
import { IdentifyModule } from '../../../../identify/identify.module';
import { TrackService } from './track.service';
import { AutosizeModule } from 'ngx-autosize';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommentsModule } from '../../comments/comments.module';
import { MatInputModule } from '@angular/material/input';
import { ManualTimeInputModule } from '../../../../ui/manual-time-input/manual-time-input.module';
import { PermissionsModule } from 'permissions';

@NgModule({
    declarations: [
        ...navigableComponents,
        TrackHeaderComponent,
        AddTasksRowComponent,
        DayViewComponent,
        WeekViewComponent,
        TrackCurrentDaysListComponent,
        TaskSearchComponent,
        ViewTimePipe,
        AddTaskDialogComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    TrackRoutingModule,
    ReactiveFormsModule,
    AutocompleteModule,
    MatTableModule,
    MatCardModule,
    CheckboxModule,
    LoaderModule,
    FormsModule,
    DialogModule,
    Translate.localize('track'),
    DateModule,
    FormControlModule,
    IdentifyModule,
    AutosizeModule,
    DatepickerModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    CommentsModule,
    MatInputModule,
    ManualTimeInputModule,
    PermissionsModule,
  ],
    providers: [
        TrackService,
        TrackHttpService,
        ViewTimePipe,
        NgbActiveModal
    ],
    entryComponents: [
        AddTaskDialogComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TrackModule {}
