import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Injectable, Injector, OnDestroy, OnInit } from '@angular/core';
import { PermissionsService } from 'permissions';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { IPermissionRouterData } from '../identify/permissions.guard';
import {Location} from "@angular/common";

export interface IRouterRedirect extends IPermissionRouterData {
    excludeFromRedirect?: boolean;
}

@Injectable()
export abstract class RouterRedirectComponent implements OnInit, OnDestroy {
    protected _router: Router;
    protected _activatedRoute: ActivatedRoute;
    protected _permissionsService: PermissionsService;
    protected _location: Location

    protected abstract _baseRoute: string;

    constructor(protected _injector: Injector) {
        this._router = this._injector.get(Router);
        this._activatedRoute = this._injector.get(ActivatedRoute);
        this._permissionsService = this._injector.get(PermissionsService);
    }

    ngOnInit(): void {
        this._navigateToAvailableChild();

        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event: NavigationEnd) => event.url.split('?')[0]),
                distinctUntilChanged(),
                untilDestroyed(this),
            )
            .subscribe(() => {
                this._navigateToAvailableChild();
            });
    }

    protected _navigateToAvailableChild(): void {
        if (this._isChildrenActivated()) return;

        const routes = this._activatedRoute.routeConfig.children;

        for (let i = 0; i < routes.length; i++) {
            const currentRoute = routes[i];
            const currentRouteData = (currentRoute.data || {}) as IRouterRedirect;

            if (currentRouteData.excludeFromRedirect) continue;

            if (!currentRouteData.permissionAction
                || this._permissionsService.isNotForbidden(currentRouteData.permissionAction)) {
                this._router.navigate([currentRoute.path], { relativeTo: this._activatedRoute });
                return;
            }
        }
        this._router.navigate(['error/403']);
    }

    protected _isChildrenActivated(): boolean {
        return getLastSegmentFromUrl(this._router) !== this._baseRoute;
    }

    // This method must be present for untilDestroyed operator
    ngOnDestroy(): void {
    }
}

export function getLastSegmentFromUrl(router: Router) {
    const children = router.parseUrl(router.url).root.children;
    const segments = children.primary ? children.primary.segments : [{ path: '' }];

    return segments[segments.length - 1].path;
}
