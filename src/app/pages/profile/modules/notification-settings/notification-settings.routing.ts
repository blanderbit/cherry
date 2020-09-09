import { Routes, RouterModule } from '@angular/router';
import { NotificationSettingsComponent } from './notification-settings.component';

export const routes: Routes = [
    {
        path: '',
        component: NotificationSettingsComponent,
    },
];

export const NotificationRoutes = RouterModule.forChild(routes);
