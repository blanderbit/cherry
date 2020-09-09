import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Translate } from 'translate';
import { Meta } from 'meta';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard.routing';
import { NavigationComponent } from './menuComponents/navigation/navigation.component';
import { HelpComponent } from './menuComponents/help/help.component';
import { SettingsComponent } from './menuComponents/settings/settings.component';
import { NotificationComponent } from './menuComponents/notification/notification.component';
import { SearchComponent } from './menuComponents/search/search.component';
import { NgbAlertModule, NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuModule } from 'projects/menu/src/lib/menu.module';
import { IdentifyModule } from '../../identify/identify.module';
import { RealtimeFrameComponent } from 'src/app/pages/dashboard/realtime-frame/realtime-frame.component';
import { UserModule } from 'src/app/user/user.module';
import { PermissionsModule } from 'permissions';
import { AttachmentsService } from '../../common-tasks/service/attachment.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LinkTaskComponent } from './menuComponents/notification/link-task/link-task.component';
import { CompaniesComponent } from './menuComponents/companies/companies.component';
import { LoaderModule } from 'loader';
import { CompanyLogoModule } from '../../companies/company-logo/company-logo.module';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        Translate.forRoot('dashboard'),
        Meta.forChild(),
        NgbModule,
        NgbButtonsModule,
        NgbAlertModule,
        FormsModule,
        ReactiveFormsModule,
        MenuModule,
        IdentifyModule,
        UserModule,
        PermissionsModule,
        InfiniteScrollModule,
        LoaderModule,
        CompanyLogoModule,
    ],
    providers: [
        AttachmentsService,
        // ProfileService
    ],
    declarations: [
        DashboardComponent,
        NavigationBarComponent,
        NavigationComponent,
        HelpComponent,
        SettingsComponent,
        NotificationComponent,
        SearchComponent,
        RealtimeFrameComponent,
        LinkTaskComponent,
        CompaniesComponent,
    ],
})
export class DashboardModule {
}
