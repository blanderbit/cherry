import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { BaseUrlService } from './base-url.service';
import { LocalStorageService } from '../local-storage.service';
import { SnackBarService } from '../snack-bar.service';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpWrapperService {
  protected basicUrl: string;

  constructor(private http: HttpClient,
              private router: Router,
              private baseUrlService: BaseUrlService,
              private localStorageService: LocalStorageService,
              private snackBarService: SnackBarService) {
    this.basicUrl = this.baseUrlService.getBaseUrl();
  }

  static transformSearchParams(params: any = {}): HttpParams {
    let searchParams: HttpParams = new HttpParams();

    for (const i in params) {
      if (params.hasOwnProperty(i)) {
        if (typeof params[i] === 'object') {
          for (const j in params[i]) {
            if (params[i].hasOwnProperty(j) && params[i][j]) {
              searchParams = searchParams.set(j, params[i][j]);
            }
          }
        } else {
          searchParams = searchParams.set(i, params[i]);
        }
      }
    }

    return searchParams;
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err instanceof ErrorEvent || HttpErrorResponse) {

      if (err.status === 0) {
        this.snackBarService.openSnackBar('Server is down or you have no internet connection', 'error');
      }

      if (err.status === 400) {
        this.snackBarService.openSnackBar('Bad request', 'error');
      }

      if (err.status === 401) {
        this.snackBarService.openSnackBar('Unauthorized', 'error');
      }

      if (err.status === 403) {
        this.snackBarService.openSnackBar('Access denied', 'error');
      }

      if (err.status === 404) {
        this.snackBarService.openSnackBar('Not found', 'error');
      }

      if (err.status >= 500) {
        this.snackBarService.openSnackBar('Server error', 'error');
      }

      // custom codes
    }

    return throwError(err);
  }

  post(resource: string, params: any = {}, options: any = {}): Observable<any> {
    const headers = new HttpHeaders({});

    return this.http.post(`${this.basicUrl}/${resource}`, params, {
      headers,
      responseType: options.responseType ? options.responseType : 'json'
    })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  put(resource: string, params: any = {}, options: any = {}): Observable<any> {
    const headers = new HttpHeaders({});

    return this.http.put(`${this.basicUrl}/${resource}`, params, {
      headers,
      responseType: options.responseType ? options.responseType : 'json'
    })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  patch(resource: string, params: any = {}, options: any = {}): Observable<any> {
    const headers = new HttpHeaders({});

    return this.http.patch(`${this.basicUrl}/${resource}`, params, {
      headers,
      responseType: options.responseType ? options.responseType : 'json'
    })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  get(resource: string, params: any = {}, options: any = {}, head: any = {}): Observable<any> {
    const headers = new HttpHeaders({
      ...head
    });

    return this.http.get(`${this.basicUrl}/${resource}`, {
      headers,
      params: HttpWrapperService.transformSearchParams(params),
      responseType: options.responseType ? options.responseType : 'json'
    })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  delete(resource: string, params: any = {}, options: any = {}): Observable<any> {
    const headers = new HttpHeaders({});

    return this.http.delete(`${this.basicUrl}/${resource}`, {
      headers,
      params: HttpWrapperService.transformSearchParams(params),
      responseType: options.responseType ? options.responseType : 'json'
    })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
