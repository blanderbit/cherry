import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Translate } from 'translate';
import { ResourcesRoutes } from './resources.routing';
import { SidebarModule } from '../../ui/sidebar/sidebar.module';
import { Meta } from 'meta';
import { ResourcesRouterComponent } from './resources-router.component';

export const ResourcesPermissions = new InjectionToken('Resources permission');

@NgModule({

    imports: [
        CommonModule,
        ResourcesRoutes,
        SidebarModule,
        Translate.localize('resources'),
        Meta.forChild(),
    ],
    declarations: [
        ResourcesRouterComponent,
    ],
})
export class ResourcesModule {
}
