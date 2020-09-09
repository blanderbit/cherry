import { RouterModule, Routes } from '@angular/router';
import { TimeAppComponent } from './timeapp.component';
import { ISidebarNavigationData, SidebarComponent } from '../../ui/sidebar/sidebar/sidebar.component';
import { MetaGuard } from '@ngx-meta/core';

const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard],
        component: TimeAppComponent,
        children: [
            {
                path: '',
                redirectTo: 'track',
                pathMatch: 'full'
            },
            {
                path: 'track',
                loadChildren: () => import('./pages/track/track.module').then(m => m.TrackModule),
            },
            {
                path: '**',
                redirectTo: 'track'
            }
        ]
    },
    {
        path: '',
        component: SidebarComponent,
        data: {
            navigation: [
                {icon: 'icon-timesheets', url: 'track',  title: 'side.subtitle'}
            ]
        } as ISidebarNavigationData,
        outlet: 'sideBar'
    },
];

export const TimeAppRoutes = RouterModule.forChild(routes);

