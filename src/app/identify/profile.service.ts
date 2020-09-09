import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, mapTo, shareReplay, switchMap, tap } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {
    ExcludeId,
    HumanResourcesProvider,
    IHumanResource,
    IIdObject,
    IPermission,
    ISystemAppsListContainer,
    PermissionAction,
    PermissionValue,
} from 'communication';
import { NotifierService } from 'notifier';
// TODO: Do not use path shortening - cyclic dependency
import { SystemPermissionsManager } from '../permissions/services/system-permissions-manager.service';
import {
    normalizeFormDataObject,
    UrlEncodingCodec,
} from '../../../projects/communication/src/lib/services/http/http-human-resources.provider';
import { ICompany, ICompanyIdProvider } from '../../../projects/communication/src/lib/models/companies';
import { IForgotPasswordInfo } from '../auth/forgot-password/forgot-password.component';
import { DashboardRoutes } from '../pages/dashboard/dashboard.routes';
import { Router } from '@angular/router';

export interface IProfile extends IIdObject, ISystemAppsListContainer {
    id: number;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    resourceId: number;
    companyId: number;
}

@Injectable()
export class ProfileService {
    private _profileLoading = false;
    private _profile$: Observable<IProfile>;
    private _profile: IProfile;
    private _avatar$ = new BehaviorSubject<string>(null);
    public avatar$ = this._avatar$.asObservable();
    public companies: ICompany[] = [];

    static getFullName(user: IHumanResource | IProfile) {
        if (user) {
            const {name, firstName, lastName} = (user || {}) as IHumanResource;

            return name || `${firstName} ${lastName}`;
        }
    }

    get avatar() {
        return this._avatar$.value;
    }

    get profile(): IProfile {
        return this._profile;
    }

    set profile(value: IProfile) {
        this._profile = value;
        // this.onAvatarChanged();
    }

    get id() {
        return this._profile && this.profile.id;
    }

    get resourceId() {
        return this._profile && this._profile.resourceId;
    }

    get authUrl(): string {
        const {http} = this._appConfig;
        return http && http.auth;
    }

    get identityUrl(): string {
        const {http} = this._appConfig;
        return http && http.identity;
    }

    get avatarUrl() {
        if (this.profile)
            return `${this.identityUrl}/users/${this.profile.id}/photos`;
    }

    constructor(
        @Inject(Router) private _router: Router,
        @Inject(HumanResourcesProvider) private _usersService: HumanResourcesProvider,
        @Inject(SystemPermissionsManager) private _permissionsManager: SystemPermissionsManager,
        @Inject(NotifierService) private _notifier: NotifierService,
        @Inject(AppConfig) private _appConfig: AppConfig,
        @Inject(HttpClient) protected _http: HttpClient) {
    }

    login(credentials: ExcludeId<ILoginData>): Observable<any> {
        const body = new HttpParams({fromObject: {...credentials}});
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

        return this._http.post(`${this.authUrl}/login`, body.toString(), {headers});
    }

    refreshToken(obj?: IRefreshTokenData): Observable<any> {
        let headers = new HttpHeaders();

        if (obj && obj.companyId) {
            headers = headers.append('companyId', obj.companyId.toString());
        }

        return this._http.post(`${this.authUrl}/refreshToken`, {}, {headers})
            .pipe(
                catchError((err) => {
                    if (err.status === 200)
                        return of(null);

                    return throwError(err);
                }),
            );
    }

    logout(): Observable<null> {
        return this._http.post<null>(`${this.authUrl}/logout`, null)
            .pipe(finalize(() => this._redirectToLogin()));
    }

    updateProfile(obj: IProfile): Observable<IProfile> {
        return this._updateProfile(obj).pipe(
            switchMap(() => this.getProfile(true)),
        );
    }

    getProfile(refresh = false, refreshCompanies = true): Observable<IProfile> {
        if ((!this.profile && !this._profileLoading) || refresh) {
            this._profileLoading = true;

            this._profile$ = this._getProfile()
                .pipe(
                    tap(profile => this.profile = profile),
                    switchMap((profile) => refreshCompanies ? this.getMyCompanies().pipe(mapTo(profile)) : of(profile)),
                    switchMap((profile) => this._permissionsManager.loadPermissions({
                            appActions: profile.apps,
                            customPermissions: this._getCustomPermissions(),
                        })
                            .pipe(mapTo(profile)),
                    ))
                .pipe(
                    tap(profile => {
                        this.profile = profile;
                        this.onAvatarChanged();
                    }),
                    finalize(() => this._profileLoading = false),
                    shareReplay(1),
                );
        }

        return this._profile$;
    }

    changeAvatar(data: string) {
        return this._http.post(`${this.avatarUrl}`, data, {
            reportProgress: true,
            observe: 'events',
        }).pipe(
            tap((v) => {
                if (v instanceof HttpResponse) {
                    this.onAvatarChanged();
                }
            }),
        );
    }

    clearProfile() {
        this._profile$ = null;
    }

    public onAvatarChanged() {
        if (this.resourceId) {
            this._avatar$.next(`${this.avatarUrl}?${new Date()}`);
        }
    }

    private _getProfile() {
        return this._http.get<IProfile>(`${this.identityUrl}/profile`, {withCredentials: true});
    }

    private _updateProfile(obj: IProfile): Observable<IProfile> {
        return this._http.put<IProfile>(`${this.identityUrl}/profile`, obj);
    }

    private _redirectToLogin() {
        location.replace(this._loginUrl());
    }

    private _loginUrl() {
        const {authentication: {redirect, login}} = this._appConfig;

        return `${login}?redirect=${location.href || redirect}`;
    }

    private _getCustomPermissions(): IPermission[] {
        const hasOwnCompany = this.companies.some(i => i.creatorId === this.id);
        const currentCompanyIsOwn = this.getCurrentCompany().creatorId === this.id;

        return [{
            actionId: PermissionAction.ViewGeneralCompanySettings,
            value: (currentCompanyIsOwn || !hasOwnCompany) ? PermissionValue.Allow : PermissionValue.Deny,
        }] as IPermission[];
    }

    // TODO: Move to specific service
    createUser(obj: {email: string}) {
        return this._http.post<{email: string}>(`${this._appConfig.http.identity}/users`, obj);
    }

    updateUser(obj: IUpdateUserData) {
        const body = new HttpParams({fromObject: normalizeFormDataObject(obj)});
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

        return this._http.put<IUpdateUserData>(`${this._appConfig.http.identity}/users`, body, {headers});
    }

    resendVerificationEmail(obj: IResendVerificationEmailData) {
        const url = this._appConfig.http.identity;
        return this._http.post<any>(`${url}/users/resend-verification-email`, obj);
    }

    forgotPassword(obj: ExcludeId<IForgotPasswordInfo>): Observable<any> {
        const headers = new HttpHeaders({'Content-Type': ' application/json'});

        return this._http.post<any>(`${this._appConfig.http.identity}/users/forgot-password`, obj, {headers});
    }

    resetPassword(obj: ExcludeId<IResetPasswordData>) {
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        const body = new HttpParams({fromObject: normalizeFormDataObject(obj), encoder: new UrlEncodingCodec()});

        return this._http.put<any>(`${this._appConfig.http.identity}/users/reset-password`, body, {headers});
    }

    resetPasswordValidation(data: {token: string, email: string}): Observable<boolean> {
        return this._http.post<any>(`${this._appConfig.http.identity}/users/reset-password/validation`, data);
    }

    confirmEmail(obj: IConfirmEmailData) {
        const url = this._appConfig.http.identity;

        return this._http.put<any>(`${url}/users/verification-email`, obj);
    }

    getMyCompanies(): Observable<ICompany[]> {
        return this._http.get<ICompany[]>(`${this.identityUrl}/users/companies`).pipe(
            tap((companies) => this.companies = companies),
        );
    }

    selectCompany(companyId: string | number, refreshProfile = true, refreshCompanies = true): Observable<any> {
        return this.refreshToken({
            companyId: companyId,
        }).pipe(
            switchMap(() => this.getProfile(refreshProfile, refreshCompanies)),
            tap(() => this._router.navigate(['/', DashboardRoutes.HOME]).then()),
        );
    }

    getCurrentCompany(): ICompany {
        return this.companies.find(i => i.id === this.profile.companyId);
    }
}

export type IRefreshTokenData = ICompanyIdProvider;

export interface IResetPasswordData extends IIdObject {
    password: string;
    confirmPassword: string;
    resetToken: string;
    email: string;
}

export interface IResendVerificationEmailData {
    email: string;
    companyId?: number;
}

export interface ILoginData extends IIdObject {
    userName: string;
    password: string;

    // for types compatibity
    email?: string;
}

export interface IUpdateUserData extends IIdObject {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    subscribedToNewsletter: boolean;
    isTermOfUseAndPrivacyPolicyAccepted: boolean;
    companyId?: number;
}

export interface IConfirmEmailData {
    token: string;
    email: string;
}

