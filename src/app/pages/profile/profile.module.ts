import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutes} from './profile.routing';
import {SettingsComponent} from './settings/settings.component';
import {AppsComponent} from './apps/apps.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SettingsSideBarComponent} from './side-bar/settings-side-bar.component';
import {Translate} from 'translate';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoaderModule} from '../../ui/loader/loader.module';
import {FormControlModule} from '../../form-control/form-control.module';
import {CloudModule} from '../../ui/cloud/cloud.module';
import {IdentifyModule} from '../../identify/identify.module';
import {UserModule} from 'src/app/user/user.module';
import {Meta} from 'meta';
import {PermissionsModule} from 'permissions';

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutes,
        FormsModule,
        ReactiveFormsModule,
        Translate.localize('profile'),
        NgbModule,
        LoaderModule,
        FormControlModule,
        CloudModule,
        IdentifyModule,
        UserModule,
        Meta.forChild(),
        PermissionsModule,
    ],
    declarations: [
        ProfileComponent,
        SettingsComponent,
        AppsComponent,
        SettingsSideBarComponent,
    ],
    exports: [
    ],
    providers: [
    ]
})
export class ProfileModule {

}
