import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsDialogComponent } from './comments-dialog/comments-dialog.component';
import { CommentDialogControlComponent } from './comment-dialog-control/comment-dialog-control.component';
import { FormControlModule } from 'form-control';
import { AutosizeModule } from 'ngx-autosize';
import { DateModule } from 'date';
import { DialogModule } from '../../../ui/dialogs/dialog/dialog.module';
import { TranslateModule } from '@ngx-translate/core';

const COMPONENTS = [
    CommentsDialogComponent,
    CommentDialogControlComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        CommonModule,
        FormControlModule,
        AutosizeModule,
        DateModule,
        DialogModule,
        TranslateModule
    ],
    entryComponents: [
        CommentsDialogComponent,
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class CommentsModule {
}
