import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { AppConfig } from '../app.config';
import { allSettled } from 'q';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

    constructor(private _router: Router,
                private _profileService: ProfileService,
                private _appConfig: AppConfig,
                @Inject(PLATFORM_ID) private _platformId: Object) {
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
        return this._isNavigationPermitted();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this._isNavigationPermitted();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this._isNavigationPermitted();
    }

    private _isNavigationPermitted(): Observable<boolean> {
        console.log('Check Access isPlatformServer', isPlatformServer(this._platformId));
        if (isPlatformServer(this._platformId))
            return of(true);

        return this._appConfig.config$.pipe(
            switchMap(() => {
                return this._profileService.getProfile().pipe(
                    catchError(error => {
                        console.error('getProfile error', error);
                        location.replace(this._getLoginUrl());
                        return of(false);
                    }),
                    map(value => true),
                );
            })
        );
    }

    private _getLoginUrl() {
        const {authentication: {redirect, login}} = this._appConfig;

        return `${login}?redirect=${location.href || redirect}`;
    }
}
