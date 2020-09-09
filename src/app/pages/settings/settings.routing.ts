import { Route, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { INavigationItem, ISidebarNavigationData, SidebarComponent } from '../../ui/sidebar/sidebar/sidebar.component';
import { PermissionActionType, PermissionsSystemLevelAction } from 'communication';
import { IPermissionRouterData, PermissionsGuard } from '../../identify/permissions.guard';
import { SettingsComponent } from './settings.component';
import { SettingsRoutes } from './settings-routes';

const SIDEBAR_TRANSLATE_PREFIX = 'side.';

export const routes: Route[] = [
    {
        path: '',
        canActivate: [MetaGuard, PermissionsGuard],
        component: SettingsComponent,
        data: {
            permissionAction: PermissionsSystemLevelAction.ViewSettingsApp,
        } as IPermissionRouterData,
        children: [
            // #TODO Uncomment after implementation
            // {
            //     path: SettingsRoutes.Subscriptions,
            //     component: AdminSubscriptionComponent,
            //     data: {
            //         excludeFromRedirect: true
            //     } as IRouterRedirect
            //     // loadChildren: './admin-subscription/admin-subscription.module#AdminSubscriptionModule',
            // },
            {
                path: SettingsRoutes.Users,
                loadChildren: () => import('../resources/human.module').then(m => m.HumanResourcesModule),
            },
            {
                path: SettingsRoutes.CompanySettings,
                loadChildren: () => import('./modules/company-settings/company-settings.module').then(m => m.CompanySettingsModule),
            },
        ],
    },
    {
        path: '',
        component: SidebarComponent,
        data: {
            titleUrl: './settings',
            navigation: [
                // #TODO Uncomment after implementation
                // {
                //      title: `${SIDEBAR_TRANSLATE_PREFIX}subscriptionAndLicenses`,
                //      url: `${SettingsRoutes.Subscriptions}`,
                //  },
                {
                    title: `${SIDEBAR_TRANSLATE_PREFIX}users`,
                    url: `${SettingsRoutes.Users}`,
                },
                {
                    title: `${SIDEBAR_TRANSLATE_PREFIX}companySettings`,
                    url: `/settings/${SettingsRoutes.CompanySettings}`,
                    navigation: [
                        getSidebarRoute(SettingsRoutes.General, PermissionsSystemLevelAction.ViewGeneralCompanySettings),
                        getSidebarRoute(SettingsRoutes.HolidaysPolicy, PermissionsSystemLevelAction.ViewHolidayPolicies),
                        getSidebarRoute(SettingsRoutes.Locations, PermissionsSystemLevelAction.ViewLocations),
                        getSidebarRoute(SettingsRoutes.ResourceTypesAndRates, PermissionsSystemLevelAction.ViewResourceType),
                        getSidebarRoute(SettingsRoutes.Skills, PermissionsSystemLevelAction.ViewSkills),
                        // TODO: Will be implemented in platform v2
                        // {
                        //     title: `${SIDEBAR_TRANSLATE_PREFIX}timeOffTypes`,
                        //     url: `${SettingsRoutes.CompanySettings}/${SettingsRoutes.TimeOffTimes}`,
                        //     routerLinkActive: 'color-blue',
                        // }
                    ],
                },
            ],
        } as ISidebarNavigationData,
        outlet: 'sideBar',
    },
];

export function getUrl(suffix: string) {
    return `/settings/${SettingsRoutes.CompanySettings}/${suffix}`;
}

export function getSidebarRoute(suffix: string, permissionAction?: PermissionActionType): INavigationItem {
    const route: INavigationItem = {
        title: `${SIDEBAR_TRANSLATE_PREFIX}${suffix}`,
        url: `/settings/${SettingsRoutes.CompanySettings}/${suffix}`,
        routerLinkActive: 'color-blue',
    };

    if (permissionAction) {
        route.permissionAction = permissionAction;
    }

    return route;
}

export const SettingsAdminRoutes = RouterModule.forChild(routes);
