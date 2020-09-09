import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { ProfileComponent } from './profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AppsComponent } from './apps/apps.component';
import { SettingsSideBarComponent } from './side-bar/settings-side-bar.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard],
        component: ProfileComponent,
        children: [
            {
                path: '',
                component: SettingsComponent,
            },
            {
                path: 'notifications',
                loadChildren: () =>
                    import('./modules/notification-settings/notification-settings.module').then(m => m.NotificationSettingsModule),
            },
            {
                path: 'settings',
                redirectTo: ''
            },
            {
                path: 'apps',
                component: AppsComponent
            },
        ],
    },
    {
        path: '',
        component: SettingsSideBarComponent,
        outlet: 'sideBar'
    },
];

export const ProfileRoutes = RouterModule.forChild(routes);
