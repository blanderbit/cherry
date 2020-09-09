import { Translate } from './../../../projects/translate/src/lib/translate';
import { LoaderModule } from './../ui/loader/loader.module';
import { SelectModule } from './../ui/select/select.module';
import { UserModule } from './../user/user.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonProjectsComponent } from './common-projects.component';
import { MembersModalComponent } from './members-modal/members-modal.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { UiModule } from '../ui/ui.module';
import { RouterModule } from '@angular/router';
import { ProjectStatusModule } from '../ui/project-status/project-status.module';
import { ProjectStatusDropdownModule } from './project-status-dropdown/project-status-dropdown.module';
import { ArchiveProjectComponent } from './archive-project/archive-project.component';
import { DeleteProjectComponent } from './delete-project/delete-project.component';
import { DialogModule } from '../ui/dialogs/dialog/dialog.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserModule,
        SelectModule,
        LoaderModule,
        Translate,
        UiModule,
        RouterModule,
        ProjectStatusModule,
        ProjectStatusDropdownModule,
        DialogModule,
    ],
    declarations: [
        CommonProjectsComponent,
        MembersModalComponent,
        ProjectCardComponent,
        ProjectCardComponent,
        ArchiveProjectComponent,
        DeleteProjectComponent,
    ],
    exports: [
        MembersModalComponent,
        ProjectCardComponent
    ],
    entryComponents: [
        MembersModalComponent,
        ArchiveProjectComponent
    ],
    providers: [
    ]
})
export class CommonProjectsModule { }
