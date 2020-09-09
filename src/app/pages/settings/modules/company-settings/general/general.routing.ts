import { Route, RouterModule } from '@angular/router';
import { GeneralComponent } from './general.component';

export const routes: Route[] = [
    {
        path: '',
        component: GeneralComponent
    }
];

export const GeneralRouting = RouterModule.forChild(routes);
