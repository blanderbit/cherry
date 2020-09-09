import { IErrorReponseData } from './../../../projects/communication/src/lib/models/error-response';
import { AuthModule } from './auth.module';
import { AuthComponent } from './auth.component';
import { ProfileService } from 'src/app/identify/profile.service';
import { Observable, of, throwError } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ICreateAccountQueryParams } from './create-account/create-account.component';
import { catchError, finalize } from 'rxjs/operators';
import { IErrorResponse } from 'projects/communication/src/lib/models/error-response';
import { ServerErrorCodes } from 'communication';
import { fromPromise } from 'rxjs/internal-compatibility';
import { authErrorUrl as authErrorPageUrl, loginUrl, signUpUrl } from './auth.routes';

export interface ICreateAccountResolverData<T = IErrorReponseData> {
    data: T;
}

@Injectable()
export class CreateAccountResolver implements Resolve<Observable<IErrorReponseData> | Promise<boolean>> {
    queryParams: ICreateAccountQueryParams;

    get email(): string {
        return this.queryParams && this.queryParams.email;
    }

    get token(): string {
        return this.queryParams && this.queryParams.token;
    }

    constructor(private profile: ProfileService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IErrorReponseData> | Promise<boolean> {
        const queryParams = route.queryParams as ICreateAccountQueryParams;

        this.queryParams = {
            ...queryParams,
            token: AuthComponent.normalizeToken(queryParams.token)
        };

        if (this.email && this.token) {
            return this.confirmEmail(this.queryParams);
        } else {
            return this.router.navigate([signUpUrl]);
        }
    }

    confirmEmail(params: ICreateAccountQueryParams): Observable<IErrorReponseData> {
        return this.profile.confirmEmail(params).pipe(
            catchError((err: IErrorResponse) => {
                const errorCode = err.error.code;

                switch (errorCode) {
                    case ServerErrorCodes.UserNotFound:
                        return this.router.navigate([signUpUrl]);
                    case ServerErrorCodes.EmailAlreadyConfirmed:
                        return of(null);
                    case ServerErrorCodes.InvalidToken:
                        return this.router.navigate([authErrorPageUrl]);
                    default:
                        return of(err.error);
                }
            }),
        );
    }
}
