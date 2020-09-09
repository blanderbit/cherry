import { UserModule } from './../../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { AppItemModule } from '../../ui/app-item/app-item.module';
import { Translate } from 'translate';
import { PermissionsModule } from 'permissions';
import { TrialNotificationModule } from '../../ui/trial-notification/trial-notification.module';
import { Meta } from 'meta';
import { MetaGuard } from '@ngx-meta/core';

export const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard],
        component: HomeComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        Translate.localize('home'),

        Meta.forChild(),
        AppItemModule,
        PermissionsModule,
        TrialNotificationModule,
        UserModule,
    ],
    declarations: [

        HomeComponent,
    ],
    exports: [],
    providers: [],
})
export class HomeModule {

}
