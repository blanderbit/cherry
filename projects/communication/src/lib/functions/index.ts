import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

export function redirectTo404(err, router: Router): Observable<any> {
    if (err instanceof HttpErrorResponse && err.status === 404) {
        if (router) {
            return fromPromise(router.navigate(['/404']));
        }

        console.warn('Item not fount. For redirect to Not fount page provide a router instance');
    }

    return throwError(err);
}

export function nullIfError(res: Observable<any>): Observable<any> {
    return res.pipe(catchError(() => of(null)));
}

export function defaultIfError<T = any>(value: T) {
    return function (res: Observable<T>): Observable<T> {
        return res.pipe(catchError(() => of(value)));
    };
}


export function handleFileSize<T = any>(res: Observable<T>): Observable<T> {
    return res.pipe(
        catchError(err => {
            if (checkErrorStatus(err, 413)) {
                err = new HttpErrorResponse({
                    error: {
                        code: 413,
                        ...err
                    }
                });
            }

            return throwError(err);
        })
    );
}

function checkErrorStatus(err: any, code: number) {
    return err && err instanceof HttpErrorResponse && err.status === code;
}
