import { Component } from '@angular/core';
import { RouterRedirectComponent } from '../../components/router-redirect.component';
import { DashboardRoutes } from '../dashboard/dashboard.routes';

@Component({
  selector: 'app-task',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent extends RouterRedirectComponent {
    _baseRoute = DashboardRoutes.Tasks;
}
