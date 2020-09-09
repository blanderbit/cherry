import { Component, Injector, OnInit } from '@angular/core';
import { RouterRedirectComponent } from '../../components/router-redirect.component';
import { DashboardRoutes } from '../dashboard/dashboard.routes';

@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html',
})
export class SettingsComponent extends RouterRedirectComponent implements OnInit {
    protected _baseRoute = `${DashboardRoutes.Settings}`;
}
