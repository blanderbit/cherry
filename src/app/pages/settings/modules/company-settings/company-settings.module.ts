import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionsSystemLevelAction } from 'communication';
import { CompanySettingsComponent } from './company-settings.component';
import { PermissionsGuard } from '../../../../identify/permissions.guard';
import { IRouterRedirect } from '../../../../components/router-redirect.component';
import { SettingsRoutes } from '../../settings-routes';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CompanySettingsComponent,
                canActivateChild: [PermissionsGuard],
                children: [
                    {
                        path: SettingsRoutes.General,
                        loadChildren: () => import('./general/general.module').then(m => m.GeneralModule),
                        data: {
                            permissionAction: PermissionsSystemLevelAction.ViewGeneralCompanySettings,
                        } as IRouterRedirect,
                    },
                    {
                        path: SettingsRoutes.HolidaysPolicy,
                        loadChildren: () => import('./holidays-policy.module').then(m => m.HolidaysPolicyModule),
                        data: {
                            permissionAction: PermissionsSystemLevelAction.ViewHolidayPolicies,
                        } as IRouterRedirect,
                    },
                    {
                        path: SettingsRoutes.Locations,
                        loadChildren: () => import('./locations.module').then(m => m.LocationsModule),
                        data: {
                            permissionAction: PermissionsSystemLevelAction.ViewLocations,
                        } as IRouterRedirect,
                    },
                    {
                        path: SettingsRoutes.Skills,
                        loadChildren: () => import('./skills.module').then(m => m.SkillsModule),
                        data: {
                            permissionAction: PermissionsSystemLevelAction.ViewSkills,
                        } as IRouterRedirect,
                    },
                    {
                        path: SettingsRoutes.ResourceTypesAndRates,
                        loadChildren: () => import('./resource-info.module').then(m => m.ResourceInfoModule),
                        data: {
                            permissionAction: PermissionsSystemLevelAction.ViewResourceType,
                        } as IRouterRedirect,
                    },
                ],
            },
        ]),
    ],
    declarations: [
        CompanySettingsComponent
    ]
})
export class CompanySettingsModule {
}
