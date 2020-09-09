import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Translate } from 'translate';
import { MenuModule } from 'menu';
import { CustomDirectivesModule } from '../../custom-directives/custom-directives.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SelectModule } from '../select/select.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IdentifyModule } from '../../identify/identify.module';
import { LoaderModule } from 'loader';
import { PermissionsModule } from 'permissions';



@NgModule({
    declarations: [
        ProjectsListComponent,
        SidebarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        Translate,
        MenuModule,
        CustomDirectivesModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        SelectModule,
        IdentifyModule,
        LoaderModule,
        PermissionsModule,
    ],
    exports: [
        ProjectsListComponent,
        SidebarComponent,
    ],
})
export class SidebarModule {
}
