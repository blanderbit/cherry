import { Component, OnInit } from '@angular/core';
import { RouterRedirectComponent } from '../../../../components/router-redirect.component';
import { SettingsRoutes } from '../../settings-routes';

@Component({
    selector: 'company-settings',
    templateUrl: 'company-settings.component.html',
})
export class CompanySettingsComponent extends RouterRedirectComponent implements OnInit {
    protected _baseRoute = `${SettingsRoutes.CompanySettings}`;
}
