import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCommentsComponent } from './task-comments/task-comments.component';
import { TaskCommentComponent } from './task-comment/task-comment.component';
import { CommentInputComponent } from './comment-input/comment-input.component';
import { Translate } from 'translate';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from '../user/user.module';
import { IdentifyModule } from '../identify/identify.module';
import { MenuModule } from 'menu';
import { TaskCommentsManagerService } from './task-comments-manager.service';
import { CustomDirectivesModule } from '../custom-directives/custom-directives.module';
import { AutosizeModule } from 'ngx-autosize';
import { DateModule, DatepickerModule } from 'date';
import { MaterialMenuModule } from '../ui/material-menu/material-menu.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PermissionsModule } from 'permissions';
import {
    ModalAddFileFromLinkComponent
} from '../common-tasks/task-attachments/modal-add-file-from-link/modal-add-file-from-link.component';
import { CloudModule } from '../ui/cloud/cloud.module';
import { MentionsInputModule } from '../ui/mentions-input/mentions-input.module';

const COMPONENTS = [
    TaskCommentsComponent,
    TaskCommentComponent,
    CommentInputComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS,
    ],
  imports: [
    CommonModule,
    Translate.localize('task-comments'),
    ReactiveFormsModule,
    UserModule,
    IdentifyModule,
    MenuModule,
    CustomDirectivesModule,
    AutosizeModule,
    DatepickerModule,
    DateModule,
    MaterialMenuModule,
    MatButtonModule,
    MatMenuModule,
    PermissionsModule,
    CloudModule,
    MentionsInputModule,
  ],
    exports: COMPONENTS,
    providers: [
        TaskCommentsManagerService,
    ],
    entryComponents: [
        ModalAddFileFromLinkComponent
    ]
})
export class TaskCommentsModule {
}
