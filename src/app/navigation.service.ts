import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    navigateWithQueryParams(url: string, queryParams: object) {
        return this.router.navigate([url], {
            queryParams,
            relativeTo: this.route,
        });
    }

    navigateWithObject(obj: {commands: string[], extras: NavigationExtras}) {
        return this.router.navigate(obj.commands, obj.extras);
    }
}
