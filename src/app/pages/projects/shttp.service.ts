import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpService } from '../../../../projects/communication/src/lib/http.service';
import { HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { TransferState } from '@angular/platform-browser';
import { CookieStorage } from 'cookie-storage';
import { IProjectIdProvider } from '../../permissions/services/projects-permissions-manager.service';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface RequestParams {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    params?: HttpParams | {
        [param: string]: string | string[];
    };
}

@Injectable()
export class ProjectIdProvider {
    private _projectId$ = new BehaviorSubject<number>(null);
    public projectId$ = this._projectId$.asObservable();
    provider: IProjectIdProvider;

    get projectId() {
        if (this.provider) {
            return this.provider.projectId;
        }

        return this._projectId$.value;
    }

    init(projectIdContainer: IProjectIdProvider) {
        this.provider = projectIdContainer;
    }

    setProjectId(id: number) {
        this._projectId$.pipe(
            filter(projectId => projectId !== id)
        ).subscribe(projectId => this._projectId$.next(projectId));
    }
}