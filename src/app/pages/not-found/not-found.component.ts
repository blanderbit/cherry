import {Component} from '@angular/core';
import {DashboardRoutes} from '../dashboard/dashboard.routes';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
    homeLink = DashboardRoutes.HOME;

}
