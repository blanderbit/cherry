import { Component } from '@angular/core';
import { LoadingComponent } from 'components';
import { ActivatedRoute, Router } from '@angular/router';
import { skipInitialAnimation } from './animations';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    animations: [skipInitialAnimation]
})
export class AuthComponent extends LoadingComponent<any> {
    public showLogo = true;

    static normalizeToken(token: string): string {
        return encodeURI(token).replace(/%20/g, '+');
    }

    constructor(
        protected _route: ActivatedRoute,
        protected _router: Router,
    ) {
        super();
    }

}
