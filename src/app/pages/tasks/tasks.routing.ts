import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { DetailsComponent } from './details/details.component';
import { TasksSideBarComponent } from './task-side-bar/tasks-side-bar.component';
import { TasksComponent } from './tasks.component';
import { IPermissionRouterData, PermissionsGuard } from '../../identify/permissions.guard';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { AllTasksComponent } from './all-tasks/all-tasks.component';
import { TasksByProjectComponent } from './tasks-by-project/tasks-by-project.component';
import { TasksRoutes } from './index';
import { IRouterRedirect } from '../../components/router-redirect.component';
import { PermissionAction } from 'communication';

export const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard],
        canActivateChild: [PermissionsGuard],
        component: TasksComponent,
        children: [
            {
                path: TasksRoutes.My,
                component: MyTasksComponent,
                data: {
                    permissionAction: PermissionAction.ViewMyTasks
                } as IPermissionRouterData
            },
            {
                path: TasksRoutes.All,
                component: AllTasksComponent,
                data: {
                    permissionAction: PermissionAction.ViewAllTasks
                } as IPermissionRouterData
            },
            {
                path: TasksRoutes.ByProject,
                component: TasksByProjectComponent,
            },
            {
                path: ':id',
                component: DetailsComponent,
                data: {
                    excludeFromRedirect: true
                } as IRouterRedirect
            },
        ],
    },
    {
        path: '',
        component: TasksSideBarComponent,
        outlet: 'sideBar',
    }
];

export const TaskRoutes = RouterModule.forChild(routes);
