import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { ISidebarNavigationData, SidebarComponent } from '../../ui/sidebar/sidebar/sidebar.component';
import { PermissionsGuard } from '../../identify/permissions.guard';
import { PermissionsSystemLevelAction } from 'communication';
import { IRouterRedirect } from '../../components/router-redirect.component';
import { ResourcesRouterComponent } from './resources-router.component';
import { RESOURCES_ROUTES } from './resources-routes';

export const routes: Routes = [
    {
        path: '',
        canActivate: [MetaGuard],
        canActivateChild: [PermissionsGuard],
        component: ResourcesRouterComponent,
        children: [
            {
                path: `${RESOURCES_ROUTES.human}`,
                loadChildren: () => import('./human.module').then(m => m.HumanResourcesModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ReviewHumanResource
                } as IRouterRedirect
            },
            {
                path: `${RESOURCES_ROUTES.material}`,
                loadChildren: () => import('./material.module').then(m => m.MaterialResourcesModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ReviewMaterialResource
                } as IRouterRedirect
            },
            {
                path: `${RESOURCES_ROUTES.generic}`,
                loadChildren: () => import('./generic.module').then(m => m.GenericResourcesModule),
                data: {
                    permissionAction: PermissionsSystemLevelAction.ReviewGenericResource
                } as IRouterRedirect
            },
        ]
    },
    {
        path: '',
        component: SidebarComponent,
        outlet: 'sideBar',
        data: {
            navigation: [
                {
                    icon: 'icon-edit-profile',
                    url: `${RESOURCES_ROUTES.human}`,
                    title: 'side.human',
                    permissionAction: 'ReviewHumanResource',
                },
                {
                    icon: 'icon-projects',
                    url: `${RESOURCES_ROUTES.material}`,
                    title: 'side.material',
                    permissionAction: 'ReviewMaterialResource',
                },
                {
                    icon: 'icon-generic-resources',
                    url: `${RESOURCES_ROUTES.generic}`,
                    title: 'side.generic',
                    permissionAction: 'ReviewGenericResource',
                },
            ]
        } as ISidebarNavigationData,
    },
];

export const ResourcesRoutes = RouterModule.forChild(routes);
