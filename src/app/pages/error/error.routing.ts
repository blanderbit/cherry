import { Routes, RouterModule } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';
import { ErrorComponent } from './error.component';

const routes: Routes = [
    {
        path: '',
        component: ErrorComponent,
        canActivate: [MetaGuard],
    },
    {
        path: ':error',
        component: ErrorComponent,
        canActivate: [MetaGuard],
    },
];

export const ErrorRoutes = RouterModule.forChild(routes);
