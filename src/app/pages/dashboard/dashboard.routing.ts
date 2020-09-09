import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { AuthGuard } from '../../identify/auth.guard';
import { PermissionsSystemLevelAction } from 'communication';
import { PermissionsGuard } from '../../identify/permissions.guard';
import { IRouterRedirect } from '../../components/router-redirect.component';
import { DashboardRoutes } from './dashboard.routes';

export const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard, AuthGuard],
        canActivateChild: [AuthGuard, PermissionsGuard],
        component: DashboardComponent,
        children: [
            {
                path: DashboardRoutes.Projects,
                loadChildren: () => import('../projects/projects.module').then(m => m.ProjectsModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ViewProjectApp,
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.HOME,
                loadChildren: () => import('../home/home.module').then(m => m.HomeModule),
                data: {
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.Tasks,
                loadChildren: () => import('../tasks/tasks.module').then(m => m.TasksModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ViewTaskApp
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.Resources,
                loadChildren: () => import('../resources/resources.module').then(m => m.ResourcesModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ViewResourceApp
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.TimeApp,
                loadChildren: () => import('../timeapp/timeapp.module').then(m => m.TimeAppModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ViewTimeApp
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.Kanban,
                loadChildren: () => import('../kanban/kanban.module').then(m => m.KanbanModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ViewKanban
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.Profile,
                loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ViewProfile
                } as IRouterRedirect
            },
            {
                path: DashboardRoutes.Settings,
                loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule),
            },
        ]
    },
];

export const DashboardRoutingModule = RouterModule.forChild(routes);
