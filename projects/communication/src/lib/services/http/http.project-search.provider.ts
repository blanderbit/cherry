import {Injectable} from '@angular/core';
import {HttpProjectsProvider} from './http-projects.provider';
import {Observable} from 'rxjs';
import {IProject, ProjectStatus} from '../../models';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class SearchProjectProvider extends HttpProjectsProvider {
    getItems(obj?: any): Observable<IProject[]> {
        obj = {
            ...obj,
            canCreateTask: true,
            status: ProjectStatus.InProgress
        };

        return this._http.get<IProject[]>(this._getRESTURL('search'), {
            params: new HttpParams({fromObject: obj})
        });
    }
}
