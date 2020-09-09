import { Component } from '@angular/core';
import { RouterRedirectComponent } from '../../components/router-redirect.component';
import { DashboardRoutes } from '../dashboard/dashboard.routes';

@Component({
    selector: 'resources',
    templateUrl: 'resources-router.component.html'
})
export class ResourcesRouterComponent extends RouterRedirectComponent {
    protected _baseRoute = `${DashboardRoutes.Resources}`;
}
